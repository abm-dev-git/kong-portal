import { NextResponse } from 'next/server'

/**
 * Debug endpoint to check Clerk configuration
 * This helps diagnose authentication issues
 *
 * IMPORTANT: Remove this in production!
 */
export async function GET() {
  const hasPublishableKey = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  const hasSecretKey = !!process.env.CLERK_SECRET_KEY

  // Extract instance info from publishable key (safe to expose)
  let publishableKeyInfo = 'not set'
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    try {
      const pk = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
      // pk_test_BASE64_ENCODED_DOMAIN$
      const encoded = pk.replace(/^pk_(test|live)_/, '').replace(/\$$/, '')
      publishableKeyInfo = Buffer.from(encoded, 'base64').toString('utf-8')
    } catch {
      publishableKeyInfo = 'parse error'
    }
  }

  // Check secret key format (don't expose the actual key)
  let secretKeyInfo = 'not set'
  if (process.env.CLERK_SECRET_KEY) {
    const sk = process.env.CLERK_SECRET_KEY
    if (sk.startsWith('sk_test_')) {
      secretKeyInfo = 'test key (length: ' + sk.length + ')'
    } else if (sk.startsWith('sk_live_')) {
      secretKeyInfo = 'live key (length: ' + sk.length + ')'
    } else {
      secretKeyInfo = 'unknown format (length: ' + sk.length + ')'
    }
  }

  return NextResponse.json({
    clerk: {
      hasPublishableKey,
      hasSecretKey,
      publishableKeyInfo,
      secretKeyInfo,
    },
    env: {
      nodeEnv: process.env.NODE_ENV,
      signInUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL,
      signUpUrl: process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL,
    },
    timestamp: new Date().toISOString(),
  })
}
