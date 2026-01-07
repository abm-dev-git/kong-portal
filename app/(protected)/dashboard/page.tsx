import { auth, currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { StatsCard, UsageBar, ActivityFeed, IntegrationStatus } from '@/components/dashboard'
import { Key, Settings, Zap, BarChart3, Users, ArrowRight, FileText, BookOpen } from 'lucide-react'

export default async function DashboardPage() {
  const { userId } = await auth()
  const user = await currentUser()
  const firstName = user?.firstName || 'there'

  // Mock data - in production this would come from API
  const stats = {
    apiCalls: { today: 0, change: 0 },
    enrichedContacts: { total: 0, change: 0 },
    activeKeys: 0,
    successRate: 100,
  }

  const usage = {
    apiCalls: { used: 0, limit: 100 },
    enrichments: { used: 0, limit: 100 },
  }

  const activities: { id: string; type: 'enrichment' | 'api_key' | 'integration' | 'settings'; title: string; description: string; timestamp: string; status?: 'success' | 'error' | 'pending' }[] = [
    // Empty for now - would come from API
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Welcome back, {firstName}
        </h1>
        <p className="text-[var(--cream)]/70">
          Here&apos;s an overview of your ABM.dev activity.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="API Calls Today"
          value={stats.apiCalls.today}
          icon={BarChart3}
          change={{ value: stats.apiCalls.change, period: 'vs yesterday' }}
        />
        <StatsCard
          title="Enriched Contacts"
          value={stats.enrichedContacts.total}
          icon={Users}
          change={{ value: stats.enrichedContacts.change, period: 'this week' }}
        />
        <StatsCard
          title="Active API Keys"
          value={stats.activeKeys}
          icon={Key}
        />
        <StatsCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={Zap}
          subtitle="All-time enrichment success"
        />
      </div>

      {/* Usage & Integrations Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Section */}
        <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 space-y-6">
          <h3 className="text-lg font-medium text-[var(--cream)]">Usage This Month</h3>
          <UsageBar
            label="API Calls"
            used={usage.apiCalls.used}
            limit={usage.apiCalls.limit}
          />
          <UsageBar
            label="Enrichments"
            used={usage.enrichments.used}
            limit={usage.enrichments.limit}
          />
          <div className="pt-2">
            <Link href="/settings/billing" className="text-sm text-[var(--turquoise)] hover:underline">
              Upgrade for more usage →
            </Link>
          </div>
        </div>

        {/* Integrations Section */}
        <IntegrationStatus />
      </div>

      {/* Activity Feed */}
      <ActivityFeed activities={activities} />

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2
          className="text-xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Quick Actions
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/api-keys" className="block group">
            <div className="p-5 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-[var(--turquoise)]/10">
                  <Key className="w-5 h-5 text-[var(--turquoise)]" />
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--cream)]/30 group-hover:text-[var(--turquoise)] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-[var(--cream)] font-medium mb-1">API Keys</h3>
              <p className="text-xs text-[var(--cream)]/60">Create and manage keys</p>
            </div>
          </Link>

          <Link href="/api-reference" className="block group">
            <div className="p-5 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-[var(--turquoise)]/10">
                  <FileText className="w-5 h-5 text-[var(--turquoise)]" />
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--cream)]/30 group-hover:text-[var(--turquoise)] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-[var(--cream)] font-medium mb-1">API Reference</h3>
              <p className="text-xs text-[var(--cream)]/60">Explore the API</p>
            </div>
          </Link>

          <Link href="/docs" className="block group">
            <div className="p-5 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-[var(--turquoise)]/10">
                  <BookOpen className="w-5 h-5 text-[var(--turquoise)]" />
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--cream)]/30 group-hover:text-[var(--turquoise)] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-[var(--cream)] font-medium mb-1">Documentation</h3>
              <p className="text-xs text-[var(--cream)]/60">Learn how it works</p>
            </div>
          </Link>

          <Link href="/settings" className="block group">
            <div className="p-5 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all h-full">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2.5 rounded-lg bg-[var(--turquoise)]/10">
                  <Settings className="w-5 h-5 text-[var(--turquoise)]" />
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--cream)]/30 group-hover:text-[var(--turquoise)] group-hover:translate-x-0.5 transition-all" />
              </div>
              <h3 className="text-[var(--cream)] font-medium mb-1">Settings</h3>
              <p className="text-xs text-[var(--cream)]/60">Configure integrations</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}
