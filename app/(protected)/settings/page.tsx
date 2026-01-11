import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Linkedin, CreditCard, User, Users, ChevronRight } from 'lucide-react'
import { HubSpotIcon, SalesforceIcon, DynamicsIcon } from '@/components/icons/BrandIcons'

export default async function SettingsPage() {
  const { userId } = await auth()

  // Data enrichment integrations
  const enrichmentIntegrations = [
    {
      href: '/settings/linkedin',
      icon: Linkedin,
      iconColor: 'text-[#0A66C2]',
      title: 'LinkedIn',
      description: 'Connect your LinkedIn account for enhanced profile enrichment',
    },
  ]

  // CRM integrations
  const crmIntegrations = [
    {
      href: '/settings/hubspot',
      icon: HubSpotIcon,
      iconColor: 'text-[#ff7a59]',
      title: 'HubSpot',
      description: 'Sync enriched contacts with HubSpot CRM',
    },
    {
      href: '/settings/salesforce',
      icon: SalesforceIcon,
      iconColor: 'text-[#00a1e0]',
      title: 'Salesforce',
      description: 'Sync enriched contacts with Salesforce CRM',
    },
    {
      href: '/settings/dynamics',
      icon: DynamicsIcon,
      iconColor: 'text-[#002050]',
      title: 'Dynamics 365',
      description: 'Sync enriched contacts with Microsoft Dynamics',
    },
  ]

  // Account settings
  const accountSettings = [
    {
      href: '/settings/team',
      icon: Users,
      iconColor: 'text-[var(--turquoise)]',
      title: 'Team Members',
      description: 'Manage team members and invitations',
    },
    {
      href: '/settings/billing',
      icon: CreditCard,
      iconColor: 'text-[var(--turquoise)]',
      title: 'Billing & Subscription',
      description: 'Manage your subscription plan and payment methods',
    },
    {
      href: '/settings/account',
      icon: User,
      iconColor: 'text-[var(--turquoise)]',
      title: 'Account Settings',
      description: 'Update your profile and security preferences',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Settings
        </h1>
        <p className="text-[var(--cream)]/70">
          Configure your integrations and account preferences.
        </p>
      </div>

      {/* Data Enrichment Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--cream)]">Data Enrichment</h2>
        <div className="grid gap-3">
          {enrichmentIntegrations.map((link) => (
            <Link key={link.href} href={link.href} className="block group">
              <div className="p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-[var(--dark-blue)]">
                      <link.icon className={`w-5 h-5 ${link.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-[var(--cream)] font-medium">{link.title}</h3>
                      <p className="text-sm text-[var(--cream)]/60">{link.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--cream)]/40 group-hover:text-[var(--turquoise)] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* CRM Integrations Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--cream)]">CRM Integrations</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {crmIntegrations.map((link) => (
            <Link key={link.href} href={link.href} className="block group">
              <div className="p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all h-full">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-[var(--dark-blue)] flex-shrink-0">
                    <link.icon className={`w-5 h-5 ${link.iconColor}`} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-[var(--cream)] font-medium flex items-center gap-2">
                      {link.title}
                      <ChevronRight className="w-4 h-4 text-[var(--cream)]/40 group-hover:text-[var(--turquoise)] group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-xs text-[var(--cream)]/60 mt-1">{link.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium text-[var(--cream)]">Account</h2>
        <div className="grid gap-3">
          {accountSettings.map((link) => (
            <Link key={link.href} href={link.href} className="block group">
              <div className="p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-lg bg-[var(--turquoise)]/10">
                      <link.icon className={`w-5 h-5 ${link.iconColor}`} />
                    </div>
                    <div>
                      <h3 className="text-[var(--cream)] font-medium">{link.title}</h3>
                      <p className="text-sm text-[var(--cream)]/60">{link.description}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-[var(--cream)]/40 group-hover:text-[var(--turquoise)] group-hover:translate-x-0.5 transition-all" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
