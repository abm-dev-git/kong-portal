import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/settings(.*)',
  '/usage(.*)',
])

const isPublicRoute = createRouteMatcher([
  '/',
  '/api-reference(.*)',
  '/docs(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

// DevLogin key for E2E testing - must match backend configuration
// SECURITY: Only works when NEXT_PUBLIC_DEVLOGIN_ENABLED=true (non-production)
const DEVLOGIN_KEY = process.env.DEVLOGIN_KEY || ''
const DEVLOGIN_ENABLED = process.env.NEXT_PUBLIC_DEVLOGIN_ENABLED === 'true'

/**
 * Check if request has valid DevLogin authentication
 * Used for E2E testing to bypass Clerk auth in non-production environments
 */
function hasValidDevLogin(req: Request): boolean {
  console.log('[DevLogin] Checking DevLogin auth', {
    enabled: DEVLOGIN_ENABLED,
    keyConfigured: !!DEVLOGIN_KEY,
    keyLength: DEVLOGIN_KEY.length
  })

  if (!DEVLOGIN_ENABLED || !DEVLOGIN_KEY) {
    console.log('[DevLogin] DevLogin disabled or no key configured')
    return false
  }

  // Check X-DevLogin-Key header
  const headerKey = req.headers.get('X-DevLogin-Key')
  if (headerKey === DEVLOGIN_KEY) {
    console.log('[DevLogin] Valid header key found')
    return true
  }

  // Check devlogin cookie
  const cookieHeader = req.headers.get('cookie')
  console.log('[DevLogin] Cookie header:', cookieHeader?.substring(0, 100))
  if (cookieHeader) {
    const cookies = cookieHeader.split(';').reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split('=')
      acc[key] = value
      return acc
    }, {} as Record<string, string>)

    console.log('[DevLogin] Cookie keys:', Object.keys(cookies))
    if (cookies['devlogin'] === DEVLOGIN_KEY) {
      console.log('[DevLogin] Valid cookie key found')
      return true
    }
  }

  console.log('[DevLogin] No valid DevLogin credentials found')
  return false
}

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    // Check for DevLogin bypass (E2E testing only)
    if (hasValidDevLogin(req)) {
      // Allow request to continue without Clerk auth
      return NextResponse.next()
    }

    const { userId } = await auth()
    if (!userId) {
      // Use forwarded headers to get the correct origin
      const forwardedProto = req.headers.get('x-forwarded-proto') || 'http'
      const forwardedHost = req.headers.get('x-forwarded-host') || req.headers.get('host') || 'localhost:3000'
      const origin = `${forwardedProto}://${forwardedHost}`

      const signInUrl = new URL('/sign-in', origin)
      const redirectUrl = new URL(req.nextUrl.pathname + req.nextUrl.search, origin)
      signInUrl.searchParams.set('redirect_url', redirectUrl.toString())
      return NextResponse.redirect(signInUrl)
    }
  }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}
