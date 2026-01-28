import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type { CurrentUserResponse } from '../types/user-management';

/**
 * Custom hook for fetching current user's organization membership
 * SSR-safe - follows useLinkedInStatus pattern
 * @param token - Clerk JWT token or 'DEVLOGIN' for DevLogin mode
 * @param orgId - Organization ID
 * @param devLoginKey - Optional DevLogin key for E2E testing
 */
export function useCurrentUser(token?: string, orgId?: string, devLoginKey?: string) {
  const [data, setData] = useState<CurrentUserResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId/devLoginKey to avoid recreating fetchUser
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const devLoginKeyRef = useRef(devLoginKey);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, devLoginKey]);

  const fetchUser = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;

    // Need either a real token or a DevLogin key
    if ((!currentToken && !currentDevLoginKey) || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.get<CurrentUserResponse>('/v1/users/me');

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        // If the /users/me endpoint fails (e.g., doesn't exist on backend) and we're in DevLogin mode,
        // assume admin role for E2E testing. This is a fallback for when the backend doesn't have
        // the users/me endpoint implemented.
        // DevLogin mode is indicated by token === 'DEVLOGIN' or having a devLoginKey
        const isDevLoginMode = currentToken === 'DEVLOGIN' || (currentDevLoginKey && !currentToken);
        if (isDevLoginMode) {
          setData({
            id: 'devlogin-user',
            userId: 'devlogin-user',
            email: 'devlogin@test.local',
            displayName: 'DevLogin User',
            avatarUrl: null,
            role: 'admin',
            organizationId: orgIdRef.current || '',
            organizationName: 'DevLogin Org',
          });
          setError(null);
        } else {
          setError(new Error(result.error?.message || 'Failed to fetch user'));
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch - only when token or devLoginKey becomes available
  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchUser(true);
    } else if (!hasAuth) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, devLoginKey, fetchUser]);

  const refetch = useCallback((showLoading = false) => fetchUser(showLoading), [fetchUser]);

  // Helper: check if user is admin (case-insensitive)
  const isAdmin = data?.role?.toLowerCase() === 'admin';

  return { data, isLoading, error, refetch, isAdmin };
}
