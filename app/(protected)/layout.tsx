import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/shared/Navigation'
import { WorkspaceProvider } from '@/lib/contexts/WorkspaceContext'

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()

  if (!userId) {
    redirect('/sign-in')
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
