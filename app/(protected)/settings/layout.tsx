'use client'

import { SidebarNav } from '@/components/shared/SidebarNav'
import { settingsNav } from '@/lib/config/navigation'

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <SidebarNav
        groups={settingsNav}
        storageKey="settings-nav-collapsed"
        basePath="/settings"
        className="lg:w-64"
      />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
