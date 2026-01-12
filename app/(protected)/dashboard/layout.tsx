'use client'

import { SidebarNav } from '@/components/shared/SidebarNav'
import { dashboardNav } from '@/lib/config/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
      <SidebarNav
        groups={dashboardNav}
        storageKey="dashboard-nav-collapsed"
        basePath="/dashboard"
        className="w-full lg:w-60"
        navClassName="lg:sticky lg:top-24"
      />
      <main className="flex-1 min-w-0 lg:pl-4">
        {children}
      </main>
    </div>
  )
}
