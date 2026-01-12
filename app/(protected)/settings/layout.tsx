'use client'

import { Settings, User, CreditCard, Users, Building2 } from 'lucide-react'
import { SidebarNav, NavGroup } from '@/components/shared/SidebarNav'
import { HubSpotIcon, SalesforceIcon, DynamicsIcon, LinkedInIcon } from '@/components/icons/BrandIcons'

const settingsGroups: NavGroup[] = [
  {
    title: null,
    items: [
      { href: '/settings', label: 'Overview', icon: Settings },
    ]
  },
  {
    title: 'Account',
    items: [
      { href: '/settings/account', label: 'Profile', icon: User },
      { href: '/settings/billing', label: 'Billing', icon: CreditCard },
    ]
  },
  {
    title: 'Organization',
    items: [
      { href: '/settings/team', label: 'Members', icon: Users },
      { href: '/settings/workspaces', label: 'Workspaces', icon: Building2 },
    ]
  },
  {
    title: 'Integrations',
    collapsible: true,
    items: [
      { href: '/settings/linkedin', label: 'LinkedIn', icon: LinkedInIcon, iconColor: '#0A66C2' },
      { href: '/settings/hubspot', label: 'HubSpot', icon: HubSpotIcon, iconColor: '#ff7a59' },
      { href: '/settings/salesforce', label: 'Salesforce', icon: SalesforceIcon, iconColor: '#00a1e0' },
      { href: '/settings/dynamics', label: 'Dynamics 365', icon: DynamicsIcon, iconColor: '#002050' },
    ]
  }
]

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <SidebarNav
        groups={settingsGroups}
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
