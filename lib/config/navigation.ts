import {
  LayoutDashboard,
  Key,
  Settings,
  User,
  CreditCard,
  Users,
  UsersRound,
  Building2,
} from 'lucide-react'
import { NavGroup } from '@/components/shared/SidebarNav'
import {
  HubSpotIcon,
  SalesforceIcon,
  DynamicsIcon,
  LinkedInIcon,
} from '@/components/icons/BrandIcons'

/**
 * Dashboard navigation - used on /dashboard and /dashboard/* pages
 * Only includes authenticated routes - public pages (docs, api-reference) are accessed separately
 */
export const dashboardNav: NavGroup[] = [
  {
    title: null,
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    title: 'API Management',
    items: [
      { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
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
    title: 'Account',
    items: [
      { href: '/settings', label: 'Settings', icon: Settings },
    ]
  }
]

/**
 * Settings navigation - used on /settings and all settings subpages
 */
export const settingsNav: NavGroup[] = [
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
      { href: '/settings/teams', label: 'Teams', icon: UsersRound },
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
