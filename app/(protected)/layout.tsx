import { auth } from '@clerk/nextjs/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/shared/Navigation'
import { WorkspaceProvider } from '@/lib/contexts/WorkspaceContext'

// DevLogin bypass for E2E testing (non-production only)
const DEVLOGIN_KEY = process.env.DEVLOGIN_KEY || ''
const DEVLOGIN_ENABLED = process.env.NEXT_PUBLIC_DEVLOGIN_ENABLED === 'true'

async function hasValidDevLogin(): Promise<boolean> {
  if (!DEVLOGIN_ENABLED || !DEVLOGIN_KEY) {
    return false
  }
  const cookieStore = await cookies()
  const devLoginCookie = cookieStore.get('devlogin')
  return devLoginCookie?.value === DEVLOGIN_KEY
}

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check for DevLogin bypass (E2E testing only)
  const isDevLogin = await hasValidDevLogin()

  if (!isDevLogin) {
    const { userId } = await auth()
    if (!userId) {
      redirect('/sign-in')
    }
  }

  return (
    <WorkspaceProvider>
      <div className="min-h-screen bg-[var(--dark-blue)]">
        <Navigation />
        <main id="main-content" className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </div>
    </WorkspaceProvider>
  )
}
