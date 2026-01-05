import { useState, useEffect, useCallback, useMemo } from 'react';
import { createApiClient } from '../api-client';

export interface HubSpotStatus {
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  integrationId?: string;
  portalId?: string;
  lastSyncAt?: string;
  lastTestedAt?: string;
  testStatus?: 'success' | 'failed' | 'pending';
  rateLimit?: {
    remaining: number;
    limit: number;
    resetsAt?: string;
  };
}

interface HealthResponse {
  connected?: boolean;
  is_connected?: boolean;
  integration_id?: string;
  portal_id?: string;
  last_sync?: string;
  last_tested_at?: string;
  test_status?: string;
  rate_limit?: {
    remaining: number;
    limit: number;
    resets_at?: string;
  };
}

/**
 * Custom hook for HubSpot connection status
 * SSR-safe - doesn't use react-query to avoid QueryClientProvider requirement during SSR
 */
export function useHubSpotStatus(token?: string, orgId?: string) {
  const [data, setData] = useState<HubSpotStatus | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const fetchStatus = useCallback(async () => {
    if (!token || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const result = await api.get<HealthResponse>('/v1/crm/config/platforms/hubspot/health');

      if (result.success && result.data) {
        const response = result.data;
        // Map API response to our interface
        setData({
          status: (response.connected || response.is_connected) ? 'connected' : 'disconnected',
          integrationId: response.integration_id,
          portalId: response.portal_id,
          lastSyncAt: response.last_sync,
          lastTestedAt: response.last_tested_at,
          testStatus: response.test_status as HubSpotStatus['testStatus'],
          rateLimit: response.rate_limit ? {
            remaining: response.rate_limit.remaining,
            limit: response.rate_limit.limit,
            resetsAt: response.rate_limit.resets_at,
          } : undefined,
        });
        setError(null);
      } else {
        // Handle disconnected state from backend error
        if (result.error?.details && typeof result.error.details === 'object') {
          const details = result.error.details as { configured?: boolean };
          if (details.configured === false) {
            setData({ status: 'disconnected' });
            setError(null);
            return;
          }
        }
        throw new Error(result.error?.message || 'Failed to fetch status');
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      setData({ status: 'disconnected' });
    } finally {
      setIsLoading(false);
    }
  }, [token, api]);

  // Initial fetch
  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // Poll when status is pending
  useEffect(() => {
    if (data?.status === 'pending') {
      const interval = setInterval(fetchStatus, 5000);
      return () => clearInterval(interval);
    }
  }, [data?.status, fetchStatus]);

  const refetch = useCallback(() => fetchStatus(), [fetchStatus]);

  return { data, isLoading, error, refetch };
}
