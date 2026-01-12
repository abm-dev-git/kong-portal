import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type { CurrentUserResponse } from '../types/user-management';

/**
 * Custom hook for fetching current user's organization membership
 * SSR-safe - follows useLinkedInStatus pattern
 */
export function useCurrentUser(token?: string, orgId?: string) {
  const [data, setData] = useState<CurrentUserResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId to avoid recreating fetchUser
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
  }, [token, orgId]);

  const fetchUser = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;

    if (!currentToken || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.get<CurrentUserResponse>('/v1/users/me');

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch user'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch - only when token becomes available
  useEffect(() => {
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchUser(true);
    } else if (!token) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchUser]);

  const refetch = useCallback((showLoading = false) => fetchUser(showLoading), [fetchUser]);

  // Helper: check if user is admin
  const isAdmin = data?.role === 'admin';

  return { data, isLoading, error, refetch, isAdmin };
}
