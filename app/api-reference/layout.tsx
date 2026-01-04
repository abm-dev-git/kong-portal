import { Navigation } from '@/components/shared/Navigation'

export default function ApiReferenceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[var(--dark-blue)]">
      <Navigation />
      {children}
    </div>
  )
}
