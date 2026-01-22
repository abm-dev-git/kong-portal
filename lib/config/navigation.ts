import {
  LayoutDashboard,
  Key,
  User,
  CreditCard,
  Users,
  UsersRound,
  Activity,
  Settings,
  Building2,
  BarChart3,
} from 'lucide-react'
import { NavGroup } from '@/components/shared/SidebarNav'
import {
  HubSpotIcon,
  LinkedInIcon,
} from '@/components/icons/BrandIcons'

/**
 * Unified navigation - used across all protected pages
 * Workspace switcher is shown separately at the top of the sidebar
 */
export const unifiedNav: NavGroup[] = [
  {
    title: null,
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    ]
  },
  {
    title: 'Account',
    collapsible: true,
    items: [
      { href: '/settings/account', label: 'Profile', icon: User },
      { href: '/settings/usage', label: 'Usage', icon: BarChart3 },
      { href: '/settings/billing', label: 'Billing', icon: CreditCard },
      { href: '/settings/team', label: 'Members', icon: Users },
      { href: '/settings/teams', label: 'Teams', icon: UsersRound },
      { href: '/settings/workspaces', label: 'Workspaces', icon: Building2 },
    ]
  },
  {
    title: 'Platform',
    items: [
      { href: '/dashboard/api-keys', label: 'API Keys', icon: Key },
      { href: '/dashboard/enrichments', label: 'Enrichments', icon: Activity },
      { href: '/dashboard/prompts', label: 'Configuration', icon: Settings },
    ]
  },
  {
    title: 'Integrations',
    collapsible: true,
    items: [
      { href: '/settings/linkedin', label: 'LinkedIn', icon: LinkedInIcon, iconColor: '#0A66C2' },
      { href: '/settings/hubspot', label: 'HubSpot', icon: HubSpotIcon, iconColor: '#ff7a59' },
    ]
  },
]

// Keep legacy exports for backwards compatibility during transition
export const dashboardNav = unifiedNav
export const settingsNav = unifiedNav
