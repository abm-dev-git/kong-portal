'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConnectHubSpotModal, HubSpotIcon } from './ConnectHubSpotModal';
import { DisconnectConfirmModal } from './DisconnectConfirmModal';
import { useHubSpotStatus } from '@/lib/hooks/useHubSpotStatus';
import { ExternalLink, Loader2, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyStateHubSpotNotConnected } from '@/components/ui/empty-state';
import { createApiClient } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';

// Helper to format relative time
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins === 1 ? '' : 's'} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? '' : 's'} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? '' : 's'} ago`;
  return date.toLocaleDateString();
}

// Status badge component
function HubSpotStatusBadge({ status }: { status: string }) {
  const variants: Record<string, { variant: 'success' | 'warning' | 'outline' | 'error'; label: string }> = {
    connected: { variant: 'success', label: 'Connected' },
    pending: { variant: 'warning', label: 'Pending' },
    disconnected: { variant: 'outline', label: 'Disconnected' },
    error: { variant: 'error', label: 'Error' },
  };

  const config = variants[status] || variants.disconnected;

  return (
    <Badge variant={config.variant}>
      {status === 'pending' && <Loader2 className="size-3 animate-spin mr-1" />}
      {config.label}
    </Badge>
  );
}

// Feature toggle (read-only)
function FeatureToggle({
  label,
  enabled,
  disabled = false
}: {
  label: string;
  enabled?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="flex items-center gap-2 cursor-default">
      <div className={`
        size-4 rounded border flex items-center justify-center
        ${enabled
          ? 'bg-[var(--turquoise)] border-[var(--turquoise)]'
          : 'bg-transparent border-[var(--cream)]/30'
        }
        ${disabled ? 'opacity-50' : ''}
      `}>
        {enabled && <CheckCircle2 className="size-3 text-[var(--dark-blue)]" />}
      </div>
      <span className={`text-sm ${disabled ? 'text-[var(--cream)]/40' : 'text-[var(--cream)]/70'}`}>
        {label}
      </span>
    </label>
  );
}

interface HubSpotSettingsCardProps {
  token?: string;
  orgId?: string;
}

export function HubSpotSettingsCard({ token, orgId }: HubSpotSettingsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const { data: status, isLoading, refetch } = useHubSpotStatus(token, orgId);

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const handleDisconnect = async () => {
    if (!status?.integrationId) {
      toast.error('Cannot disconnect: Integration ID not found');
      return;
    }

    setIsDisconnecting(true);
    try {
      const result = await api.delete(`/v1/crm/config/integrations/${status.integrationId}`);

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to disconnect');
      }

      setDisconnectModalOpen(false);
      toast.success('HubSpot account disconnected successfully');
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to disconnect HubSpot account');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await refetch();
    } finally {
      setIsTesting(false);
    }
  };

  const handleSuccess = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
        {/* Header section skeleton */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <Skeleton className="size-10 rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-56" />
            </div>
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>

        {/* Content section skeleton */}
        <div className="space-y-4">
          <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          </div>

          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
    );
  }

  const isConnected = status?.status === 'connected';

  return (
    <>
      <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-[var(--dark-blue)] p-2 rounded-lg">
              <HubSpotIcon className="size-6 text-[#ff7a59]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--cream)]">
                {status?.displayName || 'HubSpot Connection'}
              </h3>
              <p className="text-sm text-[var(--cream)]/60">
                {isConnected
                  ? 'Your HubSpot account is connected'
                  : 'Connect your HubSpot account for CRM sync'}
              </p>
            </div>
          </div>
          {status?.status && <HubSpotStatusBadge status={status.status} />}
        </div>

        {isConnected ? (
          <div className="space-y-4">
            {/* Connection Details */}
            <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4">
              <div className="space-y-2">
                {status?.accountName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Account</span>
                    <span className="text-sm text-[var(--cream)] font-medium">
                      {status.accountName}
                    </span>
                  </div>
                )}
                {status?.portalId && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Portal ID</span>
                    <span className="text-sm text-[var(--cream)] font-medium font-mono">
                      {status.portalId}
                    </span>
                  </div>
                )}
                {status?.lastTestedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Last Tested</span>
                    <span className="text-sm text-[var(--cream)]">
                      {formatRelativeTime(status.lastTestedAt)}
                    </span>
                  </div>
                )}
                {status?.rateLimit && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">API Calls Remaining</span>
                    <span className="text-sm text-[var(--cream)]">
                      {status.rateLimit.remaining}/{status.rateLimit.limit}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4">
              <h4 className="text-sm font-medium text-[var(--cream)] mb-3">Features</h4>
              <div className="flex flex-wrap gap-x-6 gap-y-2">
                <FeatureToggle
                  label="Person Enrichment"
                  enabled={status?.enablePersonEnrichment}
                />
                <FeatureToggle
                  label="Company Enrichment"
                  enabled={status?.enableCompanyEnrichment}
                />
                <FeatureToggle
                  label="Auto Writeback"
                  enabled={status?.autoWritebackEnabled}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleTestConnection}
                disabled={isTesting}
                className="flex-1"
              >
                {isTesting ? (
                  <>
                    <Loader2 className="animate-spin size-4 mr-2" />
                    Testing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="size-4 mr-2" />
                    Test Connection
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://app.hubspot.com', '_blank')}
                className="flex-1"
              >
                <ExternalLink className="size-4 mr-2" />
                Open HubSpot
              </Button>
            </div>

            <Button
              variant="outline"
              onClick={() => setDisconnectModalOpen(true)}
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              Disconnect
            </Button>
          </div>
        ) : (
          <EmptyStateHubSpotNotConnected
            onConnect={() => setModalOpen(true)}
            className="py-8"
          />
        )}
      </div>

      <ConnectHubSpotModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
        token={token}
        orgId={orgId}
      />

      <DisconnectConfirmModal
        open={disconnectModalOpen}
        onOpenChange={setDisconnectModalOpen}
        onConfirm={handleDisconnect}
        integrationName="HubSpot"
        isDisconnecting={isDisconnecting}
      />
    </>
  );
}
