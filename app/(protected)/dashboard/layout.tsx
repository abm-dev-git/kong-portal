'use client'

import { LayoutDashboard, Key, Book, FileText, Settings } from 'lucide-react'
import { SidebarNav, NavGroup } from '@/components/shared/SidebarNav'
import { HubSpotIcon, SalesforceIcon, LinkedInIcon } from '@/components/icons/BrandIcons'

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
