'use client';

import React, { useState, useMemo } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConnectDynamicsModal, DynamicsIcon } from './ConnectDynamicsModal';
import { DisconnectConfirmModal } from './DisconnectConfirmModal';
import { useDynamicsStatus } from '@/lib/hooks/useDynamicsStatus';
import { ExternalLink, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyStateDynamicsNotConnected } from '@/components/ui/empty-state';
import { createApiClient } from '@/lib/api-client';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';

// Status badge component
function DynamicsStatusBadge({ status }: { status: string }) {
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

interface DynamicsSettingsCardProps {
  token?: string;
  orgId?: string;
}

export function DynamicsSettingsCard({ token, orgId }: DynamicsSettingsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [disconnectModalOpen, setDisconnectModalOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { data: status, isLoading, refetch } = useDynamicsStatus(token, orgId);

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
      toast.success('Dynamics 365 account disconnected successfully');
      await refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to disconnect Dynamics 365 account');
    } finally {
      setIsDisconnecting(false);
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
              <Skeleton className="h-5 w-44" />
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
                <Skeleton className="h-4 w-28" />
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
              <DynamicsIcon className="size-6 text-[#002050]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--cream)]">Dynamics 365 Connection</h3>
              <p className="text-sm text-[var(--cream)]/60">
                {isConnected
                  ? 'Your Dynamics 365 account is connected'
                  : 'Connect your Dynamics 365 for CRM sync'}
              </p>
            </div>
          </div>
          {status?.status && <DynamicsStatusBadge status={status.status} />}
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4">
              <div className="space-y-2">
                {status?.organizationName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Organization</span>
                    <span className="text-sm text-[var(--cream)] font-medium">
                      {status.organizationName}
                    </span>
                  </div>
                )}
                {status?.environment && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Environment</span>
                    <span className="text-sm text-[var(--cream)]">
                      {status.environment}
                    </span>
                  </div>
                )}
                {status?.environmentUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">URL</span>
                    <a
                      href={status.environmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--turquoise)] hover:underline font-mono truncate max-w-[200px]"
                    >
                      {status.environmentUrl.replace('https://', '')}
                    </a>
                  </div>
                )}
                {status?.lastSyncAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Last Sync</span>
                    <span className="text-sm text-[var(--cream)]">
                      {formatDateTime(status.lastSyncAt)}
                    </span>
                  </div>
                )}
                {status?.version && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Version</span>
                    <span className="text-sm text-[var(--cream)] font-mono">
                      {status.version}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => status?.environmentUrl && window.open(status.environmentUrl, '_blank')}
                className="flex-1"
                disabled={!status?.environmentUrl}
              >
                <ExternalLink className="size-4 mr-2" />
                Open Dynamics
              </Button>
              <Button
                variant="outline"
                onClick={() => setDisconnectModalOpen(true)}
                className="flex-1 border-red-500/50 text-red-400 hover:bg-red-500/10"
              >
                Disconnect
              </Button>
            </div>
          </div>
        ) : (
          <EmptyStateDynamicsNotConnected
            onConnect={() => setModalOpen(true)}
            className="py-8"
          />
        )}
      </div>

      <ConnectDynamicsModal
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
        integrationName="Dynamics 365"
        isDisconnecting={isDisconnecting}
      />
    </>
  );
}
