'use client';

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Check, AlertCircle, Loader2 } from 'lucide-react';
import type { LinkedInStatus } from '@/lib/hooks/useLinkedInStatus';

interface LinkedInStatusBadgeProps {
  status?: LinkedInStatus['status'];
}

export function LinkedInStatusBadge({ status }: LinkedInStatusBadgeProps) {
  const displayStatus = status ?? 'disconnected';

  const badgeConfig = {
    connected: {
      variant: 'success' as const,
      icon: Check,
      label: 'Connected',
    },
    pending: {
      variant: 'warning' as const,
      icon: Loader2,
      label: 'Pending',
    },
    disconnected: {
      variant: 'outline' as const,
      icon: null,
      label: 'Disconnected',
    },
    error: {
      variant: 'error' as const,
      icon: AlertCircle,
      label: 'Error',
    },
  };

  const config = badgeConfig[displayStatus] ?? badgeConfig.disconnected;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant}>
      {Icon && (
        <Icon
          className={
            displayStatus === 'pending'
              ? 'animate-spin h-3 w-3'
              : 'h-3 w-3'
          }
        />
      )}
      {config.label}
    </Badge>
  );
}
