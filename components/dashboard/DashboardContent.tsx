'use client';

import Link from 'next/link';
import { Key, Zap, BarChart3, Users, Sparkles } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { UsageBar } from './UsageBar';
import { ActivityFeed } from './ActivityFeed';
import { IntegrationStatus } from './IntegrationStatus';
import { GettingStartedCard } from './GettingStartedCard';
import { PlaygroundCard } from './PlaygroundCard';

interface DashboardContentProps {
  firstName: string;
}

export function DashboardContent({ firstName }: DashboardContentProps) {
  // Mock data - in production this would come from API
  const stats = {
    apiCalls: { today: 0, change: 0 },
    enrichedContacts: { total: 0, change: 0 },
    activeKeys: 0,
    successRate: 100,
  };

  const usage = {
    apiCalls: { used: 0, limit: 100 },
    enrichments: { used: 0, limit: 100 },
  };

  const activities: { id: string; type: 'enrichment' | 'api_key' | 'integration' | 'settings'; title: string; description: string; timestamp: string; status?: 'success' | 'error' | 'pending' }[] = [];

  // Determine user state
  const hasApiKey = stats.activeKeys > 0;
  const hasActivity = stats.apiCalls.today > 0 || stats.enrichedContacts.total > 0;
  const isNewUser = !hasApiKey && !hasActivity;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Welcome{isNewUser ? '' : ' back'}, {firstName}
        </h1>
        <p className="text-[var(--cream)]/70">
          {isNewUser
            ? 'Get started with ABM.dev in just 2 minutes.'
            : "Here's an overview of your ABM.dev activity."}
        </p>
      </div>

      {/* New User Onboarding View */}
      {isNewUser ? (
        <div className="space-y-6">
          {/* Getting Started Steps */}
          <GettingStartedCard
            hasApiKey={hasApiKey}
            hasFirstCall={hasActivity}
          />

          {/* Inline Playground */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[var(--turquoise)]" />
              <h2 className="text-lg font-medium text-[var(--cream)]">
                Try the API right now
              </h2>
            </div>
            <p className="text-sm text-[var(--cream)]/60">
              No API key needed for this demo. See real enrichment in action with ABM thought leaders.
            </p>
            <PlaygroundCard />
          </div>

          {/* Integrations - smaller section for new users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IntegrationStatus />
            <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
              <h3 className="text-lg font-medium text-[var(--cream)] mb-3">Need help?</h3>
              <p className="text-sm text-[var(--cream)]/60 mb-4">
                Check out our documentation for guides, API reference, and best practices.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/docs/getting-started"
                  className="px-4 py-2 rounded-lg bg-[var(--turquoise)]/10 text-[var(--turquoise)] text-sm font-medium hover:bg-[var(--turquoise)]/20 transition-colors"
                >
                  Quick Start Guide
                </Link>
                <Link
                  href="/api-reference"
                  className="px-4 py-2 rounded-lg bg-[var(--turquoise)]/10 text-[var(--turquoise)] text-sm font-medium hover:bg-[var(--turquoise)]/20 transition-colors"
                >
                  API Reference
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Existing User View */
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
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
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
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

          {/* Quick Playground Access for existing users */}
          <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-[var(--cream)]">Quick Enrichment</h3>
                <p className="text-sm text-[var(--cream)]/60">Test the API with sample data</p>
              </div>
              <Link
                href="/api-reference/playground"
                className="text-sm text-[var(--turquoise)] hover:underline"
              >
                Open full playground →
              </Link>
            </div>
            <PlaygroundCard className="border-0 bg-transparent p-0" />
          </div>

          {/* Activity Feed */}
          <ActivityFeed activities={activities} />
        </>
      )}
    </div>
  );
}
