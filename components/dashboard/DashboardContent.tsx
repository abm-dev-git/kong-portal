'use client';

import Link from 'next/link';
import { Key, Zap, BarChart3, Users } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { UsageBar } from './UsageBar';
import { ActivityFeed } from './ActivityFeed';
import { IntegrationStatus } from './IntegrationStatus';

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

  const activities: { id: string; type: 'enrichment' | 'api_key' | 'integration' | 'settings'; title: string; description: string; timestamp: string; status?: 'success' | 'error' | 'pending' }[] = [
    // Empty for now - would come from API
  ];

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

      {/* Activity Feed */}
      <ActivityFeed activities={activities} />
    </div>
  );
}
