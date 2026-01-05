import { useState, useEffect, useCallback, useMemo } from 'react';
import { createApiClient } from '../api-client';

export interface LinkedInStatus {
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  linkedInProfileName?: string;
  linkedInProfileUrl?: string;
  connectedAt?: string;
  lastVerifiedAt?: string;
  message?: string;
}

/**
 * Custom hook for LinkedIn connection status
 * SSR-safe - doesn't use react-query to avoid QueryClientProvider requirement during SSR
 */
export function useLinkedInStatus(token?: string, orgId?: string) {
  const [data, setData] = useState<LinkedInStatus | undefined>(undefined);
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
      const result = await api.get<LinkedInStatus>('/v1/linkedin-connection/status');

      if (result.success && result.data) {
        setData(result.data);
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
