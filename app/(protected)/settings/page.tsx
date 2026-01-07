import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Badge } from '@/components/ui/badge'
import { Linkedin, CreditCard, User, ArrowRight, ChevronRight } from 'lucide-react'

// HubSpot icon component
function HubSpotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.984v-.066a2.198 2.198 0 00-4.396 0V3.1c0 .9.54 1.67 1.313 2.012v2.789a5.42 5.42 0 00-2.477 1.277l-6.44-5.019a2.385 2.385 0 00.092-.642v-.065a2.385 2.385 0 10-2.556 2.376 2.375 2.375 0 001.045-.239l6.317 4.923a5.454 5.454 0 00-.77 2.796 5.464 5.464 0 00.787 2.843l-1.907 1.907a1.81 1.81 0 00-.527-.082 1.834 1.834 0 101.833 1.833c0-.184-.029-.36-.08-.527l1.89-1.89a5.456 5.456 0 108.009-8.463 5.426 5.426 0 00-3.4-1.092zm-.117 8.442a2.85 2.85 0 110-5.702 2.85 2.85 0 010 5.702z" />
    </svg>
  )
}

// Salesforce icon component
function SalesforceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.98 6.182a4.27 4.27 0 013.38-1.655 4.277 4.277 0 013.967 2.674 3.643 3.643 0 011.404-.28 3.675 3.675 0 013.678 3.678 3.643 3.643 0 01-.285 1.416 3.196 3.196 0 011.877 2.914 3.203 3.203 0 01-3.203 3.203 3.203 3.203 0 01-.54-.046 3.95 3.95 0 01-3.487 2.089 3.947 3.947 0 01-1.772-.418 4.494 4.494 0 01-7.83-1.573 3.315 3.315 0 01-.616.058 3.34 3.34 0 01-3.34-3.34 3.34 3.34 0 012.035-3.074 4.072 4.072 0 01-.19-1.234 4.094 4.094 0 014.094-4.094 4.072 4.072 0 01.828.085z" />
    </svg>
  )
}

// Dynamics icon component
function DynamicsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.5 4.5v6.75l-7.5 4.5-7.5-4.5V4.5L12 9l7.5-4.5zM12 11.25l7.5-4.5V15l-7.5 4.5L4.5 15V6.75l7.5 4.5z" />
    </svg>
  )
}

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
