'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { WorkspaceSwitcher } from './WorkspaceSwitcher'

export interface NavItem {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>
  iconColor?: string
}

export interface NavGroup {
  title: string | null
  collapsible?: boolean
  items: NavItem[]
}

interface SidebarNavProps {
  groups: NavGroup[]
  storageKey: string
  /** The base path to check for exact match (e.g., '/settings' or '/dashboard') */
  basePath: string
  className?: string
  navClassName?: string
  /** Show workspace switcher at top of sidebar */
  showWorkspaceSwitcher?: boolean
}

export function SidebarNav({
  groups,
  storageKey,
  basePath,
  className,
  navClassName,
  showWorkspaceSwitcher = true,
}: SidebarNavProps) {
  const pathname = usePathname()
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  // Load collapsed state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey)
      if (stored) {
        setCollapsedSections(JSON.parse(stored))
      }
    } catch {
      // Ignore localStorage errors
    }
  }, [storageKey])

  // Save collapsed state to localStorage
  const toggleSection = (title: string) => {
    setCollapsedSections(prev => {
      const next = { ...prev, [title]: !prev[title] }
      try {
        localStorage.setItem(storageKey, JSON.stringify(next))
      } catch {
        // Ignore localStorage errors
      }
      return next
    })
  }

  return (
    <aside className={cn('flex-shrink-0', className)}>
      {/* Workspace Switcher */}
      {showWorkspaceSwitcher && (
        <div className="mb-6">
          <WorkspaceSwitcher />
        </div>
      )}
      <nav className={cn('space-y-6', navClassName)}>
        {groups.map((group, groupIndex) => {
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
                    (item.href !== basePath && pathname.startsWith(item.href))
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
  )
}
