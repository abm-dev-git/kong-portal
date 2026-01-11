'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Settings, User, Linkedin, Database, CreditCard, Users, Building2, UsersRound } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const settingsNav: NavItem[] = [
  { href: '/settings', label: 'Overview', icon: Settings },
  { href: '/settings/account', label: 'Account', icon: User },
  { href: '/settings/team', label: 'Team Members', icon: Users },
  { href: '/settings/workspaces', label: 'Workspaces', icon: Building2 },
  { href: '/settings/teams', label: 'Teams', icon: UsersRound },
  { href: '/settings/linkedin', label: 'LinkedIn', icon: Linkedin },
  { href: '/settings/hubspot', label: 'HubSpot', icon: Database },
  { href: '/settings/dynamics', label: 'Dynamics 365', icon: Database },
  { href: '/settings/salesforce', label: 'Salesforce', icon: Database },
  { href: '/settings/billing', label: 'Billing', icon: CreditCard },
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar Navigation */}
      <aside className="lg:w-64 flex-shrink-0">
        <nav className="space-y-1">
          {settingsNav.map((item) => {
            const isActive = pathname === item.href ||
              (item.href !== '/settings' && pathname.startsWith(item.href))
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive
                    ? 'bg-[var(--turquoise)]/10 text-[var(--turquoise)] border border-[var(--turquoise)]/30'
                    : 'text-[var(--cream)]/70 hover:bg-[var(--navy)] hover:text-[var(--cream)]'
                )}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
