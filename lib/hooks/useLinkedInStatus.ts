import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';

// Poll response type for automatic login detection
export interface PollLinkedInResponse {
  isComplete: boolean;
  status: 'waiting' | 'connected' | 'error';
  message: string;
  currentUrl?: string;
  profileName?: string;
  profileUrl?: string;
}

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

  // Initial fetch - only when BOTH token and orgId are available
  useEffect(() => {
    if (token && orgId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchStatus(true);
    } else if (!token || !orgId) {
      // Reset if token or orgId is cleared (user logged out or switched org)
      hasFetchedRef.current = false;
      if (!token) {
        setIsLoading(true);
      }
    }
  }, [token, orgId, fetchStatus]);

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

/**
 * Hook for polling LinkedIn login status during connection flow
 * Automatically detects when user completes login - no manual button needed!
 */
export function usePollLinkedInLogin(
  sessionId: string | null,
  token?: string,
  orgId?: string,
  enabled: boolean = true
) {
  const [data, setData] = useState<PollLinkedInResponse | null>(null);
  const [isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Use refs to avoid recreating callbacks
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
  }, [token, orgId]);

  useEffect(() => {
    if (!enabled || !sessionId || !tokenRef.current || typeof window === 'undefined') {
      return;
    }

    // Stop polling if already complete
    if (data?.isComplete) {
      return;
    }

    setIsPolling(true);
    let intervalId: NodeJS.Timeout;

    const pollStatus = async () => {
      try {
        const api = createApiClient(tokenRef.current, orgIdRef.current);
        const result = await api.get<PollLinkedInResponse>(
          `/v1/linkedin-connection/poll/${sessionId}`
        );

        if (result.success && result.data) {
          setData(result.data);
          setError(null);

          // Stop polling if complete
          if (result.data.isComplete) {
            setIsPolling(false);
            clearInterval(intervalId);
          }
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Poll failed'));
      }
    };

    // Initial poll
    pollStatus();

    // Poll every 2.5 seconds
    intervalId = setInterval(pollStatus, 2500);

    return () => {
      clearInterval(intervalId);
      setIsPolling(false);
    };
  }, [sessionId, enabled, data?.isComplete]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsPolling(false);
  }, []);

  return { data, isPolling, error, reset };
}
