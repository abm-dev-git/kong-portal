'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth, useOrganization, useUser } from '@clerk/nextjs';
import { Key, Zap, BarChart3, Users, Sparkles, Loader2 } from 'lucide-react';
import { StatsCard } from './StatsCard';
import { UsageBar } from './UsageBar';
import { ActivityFeed } from './ActivityFeed';
import { IntegrationStatus } from './IntegrationStatus';
import { GettingStartedCard } from './GettingStartedCard';
import { PlaygroundCard } from './PlaygroundCard';
import { useLinkedInStatus } from '@/lib/hooks/useLinkedInStatus';
import { useEnrichmentStats } from '@/lib/hooks/useEnrichmentStats';
import type { ApiKey } from '@/lib/api-keys';

interface DashboardContentProps {
  firstName: string;
}

export function DashboardContent({ firstName }: DashboardContentProps) {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const { user } = useUser();
  const [token, setToken] = useState<string | undefined>();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [isLoadingKeys, setIsLoadingKeys] = useState(true);

  // Get auth token
  useEffect(() => {
    getToken().then((t) => setToken(t || undefined));
  }, [getToken]);

  const orgId = organization?.id;

  // Fetch LinkedIn status
  const { data: linkedInStatus, isLoading: isLoadingLinkedIn, refetch: refetchLinkedIn } = useLinkedInStatus(token, orgId);

  // Fetch enrichment stats (for determining if Getting Started should show)
  const { hasCompletedEnrichment, isLoading: isLoadingEnrichment, refetch: refetchEnrichmentStats } = useEnrichmentStats(token, orgId);

  // Fetch API keys
  const fetchApiKeys = useCallback(async () => {
    try {
      const response = await fetch('/api/api-keys');
      if (response.ok) {
        const data = await response.json();
        setApiKeys(data.keys || []);
      }
    } catch (error) {
      console.error('Failed to fetch API keys:', error);
    } finally {
      setIsLoadingKeys(false);
    }
  }, []);

  useEffect(() => {
    fetchApiKeys();
  }, [fetchApiKeys]);

  // Determine user state from real data
  const hasApiKey = apiKeys.length > 0;
  // Check for connected status - API may return isConnected boolean or status string
  const hasLinkedIn = linkedInStatus?.isConnected === true || linkedInStatus?.status === 'connected';
  const hasActivity = hasCompletedEnrichment;
  // Show new user view if they don't have an API key yet
  // Hide getting started once they have both API key AND completed an enrichment
  const isNewUser = !hasApiKey;
  const showGettingStarted = !hasCompletedEnrichment || !hasApiKey;

  // Show loading state while initial data is being fetched to prevent layout jumping
  const isInitialLoading = isLoadingKeys || (token && (isLoadingLinkedIn || isLoadingEnrichment));

  // Mock stats - these would come from a real API in production
  const stats = {
    apiCalls: { today: 0, change: 0 },
    enrichedContacts: { total: 0, change: 0 },
    activeKeys: apiKeys.length,
    successRate: 100,
  };

  const usage = {
    apiCalls: { used: 0, limit: 100 },
    enrichments: { used: 0, limit: 100 },
  };

  const activities: { id: string; type: 'enrichment' | 'api_key' | 'integration' | 'settings'; title: string; description: string; timestamp: string; status?: 'success' | 'error' | 'pending' }[] = [];

  // Show loading skeleton while initial data loads
  if (isInitialLoading) {
    return (
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-2">
          <div className="h-9 w-64 bg-[var(--navy)] rounded animate-pulse" />
          <div className="h-5 w-80 bg-[var(--navy)] rounded animate-pulse" />
        </div>
        {/* Content skeleton */}
        <div className="space-y-6">
          <div className="h-64 bg-[var(--navy)] rounded-lg animate-pulse" />
          <div className="h-48 bg-[var(--navy)] rounded-lg animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-40 bg-[var(--navy)] rounded-lg animate-pulse" />
            <div className="h-40 bg-[var(--navy)] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

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

      {/* New User Onboarding View - shown when no API key yet */}
      {isNewUser ? (
        <div className="space-y-6">
          {/* Inline Playground - First! */}
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
            <PlaygroundCard
              currentUser={user ? {
                name: user.fullName || user.firstName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                imageUrl: user.imageUrl,
              } : undefined}
            />
          </div>

          {/* Getting Started Steps */}
          <GettingStartedCard
            hasApiKey={hasApiKey}
            hasLinkedIn={hasLinkedIn}
            hasFirstEnrichment={hasCompletedEnrichment}
            token={token}
            orgId={orgId}
            onApiKeyCreated={fetchApiKeys}
            onLinkedInConnected={() => refetchLinkedIn(true)}
            onEnrichmentComplete={() => refetchEnrichmentStats()}
          />

          {/* Integrations - smaller section for new users */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <IntegrationStatus linkedInConnected={hasLinkedIn} />
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
              href="/dashboard/api-keys"
            />
            <StatsCard
              title="Success Rate"
              value={`${stats.successRate}%`}
              icon={Zap}
              subtitle="All-time enrichment success"
            />
          </div>

          {/* Getting Started - shown until user completes first enrichment */}
          {showGettingStarted && (
            <GettingStartedCard
              hasApiKey={hasApiKey}
              hasLinkedIn={hasLinkedIn}
              hasFirstEnrichment={hasCompletedEnrichment}
              token={token}
              orgId={orgId}
              onApiKeyCreated={fetchApiKeys}
              onLinkedInConnected={() => refetchLinkedIn(true)}
              onEnrichmentComplete={() => refetchEnrichmentStats()}
            />
          )}

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
            <IntegrationStatus linkedInConnected={hasLinkedIn} />
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
            <PlaygroundCard
              className="border-0 bg-transparent p-0"
              currentUser={user ? {
                name: user.fullName || user.firstName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                imageUrl: user.imageUrl,
              } : undefined}
            />
          </div>

          {/* Activity Feed */}
          <ActivityFeed activities={activities} />
        </>
      )}
    </div>
  );
}
