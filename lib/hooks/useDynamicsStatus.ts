import { useState, useEffect, useCallback, useMemo } from 'react';
import { createApiClient } from '../api-client';

export interface DynamicsStatus {
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  integrationId?: string;
  organizationName?: string;
  environment?: 'Production' | 'Sandbox';
  environmentUrl?: string;
  lastSyncAt?: string;
  version?: string;
}

interface HealthResponse {
  connected?: boolean;
  is_connected?: boolean;
  integration_id?: string;
  organization_name?: string;
  environment?: string;
  environment_url?: string;
  last_sync?: string;
  version?: string;
}

/**
 * Custom hook for MS Dynamics 365 connection status
 * SSR-safe - doesn't use react-query to avoid QueryClientProvider requirement during SSR
 */
export function useDynamicsStatus(token?: string, orgId?: string) {
  const [data, setData] = useState<DynamicsStatus | undefined>(undefined);
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
      const result = await api.get<HealthResponse>('/v1/crm/config/platforms/dynamics/health');

      if (result.success && result.data) {
        const response = result.data;
        // Map API response to our interface
        setData({
          status: (response.connected || response.is_connected) ? 'connected' : 'disconnected',
          integrationId: response.integration_id,
          organizationName: response.organization_name,
          environment: response.environment as DynamicsStatus['environment'],
          environmentUrl: response.environment_url,
          lastSyncAt: response.last_sync,
          version: response.version,
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
