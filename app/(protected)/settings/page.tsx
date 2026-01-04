import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'
import { Badge } from '@/components/ui/badge'
import { Linkedin, Database, CreditCard, User, ArrowRight } from 'lucide-react'

export default async function SettingsPage() {
  const { userId } = await auth()

  const settingsLinks = [
    {
      href: '/settings/linkedin',
      icon: Linkedin,
      title: 'LinkedIn Integration',
      description: 'Connect your LinkedIn account for profile enrichment',
      status: 'Not Connected',
      statusVariant: 'warning' as const,
    },
    {
      href: '/settings/hubspot',
      icon: Database,
      title: 'HubSpot Integration',
      description: 'Connect HubSpot for CRM data synchronization',
      status: 'Not Connected',
      statusVariant: 'warning' as const,
    },
    {
      href: '/settings/billing',
      icon: CreditCard,
      title: 'Billing & Subscription',
      description: 'Manage your subscription and payment methods',
      status: 'Free Tier',
      statusVariant: 'secondary' as const,
    },
    {
      href: '/settings/account',
      icon: User,
      title: 'Account Settings',
      description: 'Update your profile and preferences',
      status: null,
      statusVariant: null,
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

      {/* Settings Links */}
      <div className="grid gap-4">
        {settingsLinks.map((link) => (
          <Link key={link.href} href={link.href} className="block">
            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 transition-colors group">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-[var(--turquoise)]/10">
                    <link.icon className="w-6 h-6 text-[var(--turquoise)]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-[var(--cream)] font-medium">{link.title}</h3>
                      {link.status && link.statusVariant && (
                        <Badge variant={link.statusVariant}>{link.status}</Badge>
                      )}
                    </div>
                    <p className="text-sm text-[var(--cream)]/60">{link.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[var(--cream)]/40 group-hover:text-[var(--turquoise)] transition-colors" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
