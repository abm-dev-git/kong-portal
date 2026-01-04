'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { LinkedInStatusBadge } from './LinkedInStatusBadge';
import { ConnectLinkedInModal } from './ConnectLinkedInModal';
import { useLinkedInStatus } from '@/lib/hooks/useLinkedInStatus';
import { Linkedin, ExternalLink, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyStateLinkedInNotConnected } from '@/components/ui/empty-state';
import { createApiClient } from '@/lib/api-client';

interface LinkedInSettingsCardProps {
  token?: string;
  orgId?: string;
}

export function LinkedInSettingsCard({ token, orgId }: LinkedInSettingsCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { data: status, isLoading, refetch } = useLinkedInStatus(token, orgId);

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const handleDisconnect = async () => {
    if (!confirm('Are you sure you want to disconnect your LinkedIn account?')) {
      return;
    }

    setIsDisconnecting(true);
    try {
      const result = await api.delete('/v1/linkedin-connection');

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to disconnect');
      }

      await refetch();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to disconnect LinkedIn account');
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
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
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
              <Linkedin className="size-6 text-[var(--turquoise)]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[var(--cream)]">LinkedIn Connection</h3>
              <p className="text-sm text-[var(--cream)]/60">
                {isConnected
                  ? 'Your LinkedIn account is connected'
                  : 'Connect your LinkedIn account for data enrichment'}
              </p>
            </div>
          </div>
          {status?.status && <LinkedInStatusBadge status={status.status} />}
        </div>

        {isConnected ? (
          <div className="space-y-4">
            <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4">
              <div className="space-y-2">
                {status?.linkedInProfileName && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Profile Name</span>
                    <span className="text-sm text-[var(--cream)] font-medium">
                      {status.linkedInProfileName}
                    </span>
                  </div>
                )}
                {status?.linkedInProfileUrl && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Profile URL</span>
                    <a
                      href={status.linkedInProfileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[var(--turquoise)] hover:text-[var(--turquoise)]/80 hover:underline flex items-center gap-1"
                    >
                      View Profile
                      <ExternalLink className="size-3" />
                    </a>
                  </div>
                )}
                {status?.connectedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Connected At</span>
                    <span className="text-sm text-[var(--cream)]">
                      {new Date(status.connectedAt).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Button
              variant="outline"
              onClick={handleDisconnect}
              disabled={isDisconnecting}
              className="w-full border-red-500/50 text-red-400 hover:bg-red-500/10"
            >
              {isDisconnecting ? (
                <>
                  <Loader2 className="animate-spin size-4 mr-2" />
                  Disconnecting...
                </>
              ) : (
                'Disconnect LinkedIn'
              )}
            </Button>
          </div>
        ) : (
          <EmptyStateLinkedInNotConnected
            onConnect={() => setModalOpen(true)}
            className="py-8"
          />
        )}
      </div>

      <ConnectLinkedInModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={handleSuccess}
        token={token}
        orgId={orgId}
      />
    </>
  );
}
