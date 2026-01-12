'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Key, Book, FileText, Settings, ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { HubSpotIcon, SalesforceIcon, LinkedInIcon } from '@/components/icons/BrandIcons'

interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  iconColor?: string
}

interface NavGroup {
  title: string | null
  collapsible?: boolean
  items: NavItem[]
}

const dashboardNav: NavGroup[] = [
  {
    title: null,
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    title: 'API Management',
    items: [
      { href: '/api-keys', label: 'API Keys', icon: Key },
      { href: '/api-reference', label: 'API Reference', icon: Book },
    ]
  },
  {
    title: 'Integrations',
    collapsible: true,
    items: [
      { href: '/settings/linkedin', label: 'LinkedIn', icon: LinkedInIcon, iconColor: '#0A66C2' },
      { href: '/settings/hubspot', label: 'HubSpot', icon: HubSpotIcon, iconColor: '#ff7a59' },
      { href: '/settings/salesforce', label: 'Salesforce', icon: SalesforceIcon, iconColor: '#00a1e0' },
    ]
  },
  {
    title: 'Resources',
    items: [
      { href: '/docs', label: 'Documentation', icon: FileText },
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  }
]

const STORAGE_KEY = 'dashboard-nav-collapsed'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  // Load collapsed state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setCollapsedSections(JSON.parse(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleSection = (title: string) => {
    setCollapsedSections(prev => {
      const next = { ...prev, [title]: !prev[title] }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Ignore localStorage errors
      }
      return next
    })
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-60 flex-shrink-0">
        <nav className="space-y-6 lg:sticky lg:top-24">
          {dashboardNav.map((group, groupIndex) => {
            const isCollapsed = group.title ? collapsedSections[group.title] : false

            return (
              <div key={groupIndex} className="space-y-1">
                {/* Section Header */}
                {group.title && (
                  <button
                    onClick={() => group.collapsible && toggleSection(group.title!)}
                    className={cn(
                      'flex items-center justify-between w-full px-3 py-2 text-xs font-semibold uppercase tracking-wider',
                      'text-[var(--cream)]/50',
                      group.collapsible && 'hover:text-[var(--cream)]/70 cursor-pointer transition-colors'
                    )}
                  >
                    <span>{group.title}</span>
                    {group.collapsible && (
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isCollapsed && '-rotate-90'
                        )}
                      />
                    )}
                  </button>
                )}

                {/* Section Items */}
                <div className={cn(
                  'space-y-1 overflow-hidden transition-all duration-200',
                  isCollapsed && 'max-h-0 opacity-0',
                  !isCollapsed && 'max-h-96 opacity-100'
                )}>
                  {group.items.map((item) => {
                    const isActive = pathname === item.href ||
                      (item.href !== '/dashboard' && pathname.startsWith(item.href))
                    const Icon = item.icon

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          'flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors',
                          group.title && 'ml-1', // Indent items under headers
                          isActive
                            ? 'bg-[var(--turquoise)]/10 text-[var(--turquoise)] border border-[var(--turquoise)]/30'
                            : 'text-[var(--cream)]/70 hover:bg-[var(--navy)] hover:text-[var(--cream)]'
                        )}
                      >
                        <Icon
                          className="w-5 h-5"
                          style={item.iconColor ? { color: item.iconColor } : undefined}
                        />
                        <span className="font-medium text-sm">{item.label}</span>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 lg:pl-4">
        {children}
      </main>
    </div>
  )
}
