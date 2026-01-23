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

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
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
