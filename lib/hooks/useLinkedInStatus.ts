import { useState, useEffect, useCallback, useRef } from 'react';
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
  currentStatus?: string;
  message?: string;
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

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId to avoid recreating fetchStatus
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
  }, [token, orgId]);

  const fetchStatus = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;

    if (!currentToken || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      // Only show loading on initial fetch, not on subsequent polls
      if (isInitialFetch) {
        setIsLoading(true);
      }

      // Create API client with current token/orgId
      const api = createApiClient(currentToken, orgIdRef.current);

      // Fetch status (availability endpoint may not exist yet)
      const statusResult = await api.get<LinkedInStatus>('/v1/linkedin-connection/status');

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
          // If 404 or other error, assume disconnected
          setData({ status: 'disconnected' });
          setError(null);
        }
      }

      // Fetch availability
      const availabilityResult = await api.get<SessionAvailability>('/v1/linkedin-connection/availability');
      if (availabilityResult.success && availabilityResult.data) {
        setAvailability(availabilityResult.data);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []); // No dependencies - uses refs instead

  // Initial fetch - only when token becomes available
  useEffect(() => {
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStatus(true);
    } else if (!token) {
      // Reset if token is cleared
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchStatus]);

  // Poll when status is pending
  useEffect(() => {
    if (data?.status === 'pending') {
      const interval = setInterval(() => fetchStatus(false), 5000);
      return () => clearInterval(interval);
    }
  }, [data?.status, fetchStatus]);

  const refetch = useCallback((showLoading = false) => fetchStatus(showLoading), [fetchStatus]);

  return { data, availability, isLoading, error, refetch };
}
