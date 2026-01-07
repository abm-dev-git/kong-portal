import { useState, useEffect, useCallback, useMemo } from 'react';
import { createApiClient } from '../api-client';

export interface LinkedInStatus {
  status: 'connected' | 'pending' | 'disconnected' | 'error';
  isConnected?: boolean;
  linkedInProfileName?: string;
  linkedInProfileUrl?: string;
  connectedAt?: string;
  lastVerifiedAt?: string;
  lastUsedAt?: string;
  cookiesExpireAt?: string;
  message?: string;
}

export interface SessionAvailability {
  available: boolean;
  activeSessions: number;
  canAutoCleanup: boolean;
}

/**
 * Custom hook for LinkedIn connection status
 * SSR-safe - doesn't use react-query to avoid QueryClientProvider requirement during SSR
 */
export function useLinkedInStatus(token?: string, orgId?: string) {
  const [data, setData] = useState<LinkedInStatus | undefined>(undefined);
  const [availability, setAvailability] = useState<SessionAvailability>({ available: true, activeSessions: 0, canAutoCleanup: false });
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

      // Fetch both status and availability in parallel
      const [statusResult, availabilityResult] = await Promise.all([
        api.get<LinkedInStatus>('/v1/linkedin-connection/status'),
        api.get<SessionAvailability>('/v1/linkedin-connection/availability'),
      ]);

      // Handle status
      if (statusResult.success && statusResult.data) {
        setData(statusResult.data);
        setError(null);
      } else {
        // Handle disconnected state from backend error
        if (statusResult.error?.details && typeof statusResult.error.details === 'object') {
          const details = statusResult.error.details as { configured?: boolean };
          if (details.configured === false) {
            setData({ status: 'disconnected' });
            setError(null);
          }
        } else {
          throw new Error(statusResult.error?.message || 'Failed to fetch status');
        }
      }

      // Handle availability
      if (availabilityResult.success && availabilityResult.data) {
        setAvailability(availabilityResult.data);
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

  return { data, availability, isLoading, error, refetch };
}
