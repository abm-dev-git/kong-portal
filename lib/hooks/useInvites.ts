import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type { InvitesListResponse, InviteStatus } from '../types/user-management';

/**
 * Custom hook for fetching organization invites
 * SSR-safe - follows useLinkedInStatus pattern
 */
export function useInvites(token?: string, orgId?: string, statusFilter?: InviteStatus, devLoginKey?: string) {
  const [data, setData] = useState<InvitesListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Check if authenticated (either via token or DevLogin)
  const isAuthenticated = Boolean(token || devLoginKey);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId to avoid recreating fetchInvites
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const statusFilterRef = useRef(statusFilter);
  const devLoginKeyRef = useRef(devLoginKey);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    statusFilterRef.current = statusFilter;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, statusFilter, devLoginKey]);

  const fetchInvites = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;

    // Allow fetch if either token or devLoginKey is present
    if ((!currentToken && !currentDevLoginKey) || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const params = statusFilterRef.current ? `?status=${statusFilterRef.current}` : '';
      const result = await api.get<InvitesListResponse>(`/users/invites${params}`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        // Handle error or empty response
        setData({ invites: [], totalCount: 0 });
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial fetch - only when authenticated
  useEffect(() => {
    if (isAuthenticated && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchInvites(true);
    } else if (!isAuthenticated) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [isAuthenticated, fetchInvites]);

  // Refetch when statusFilter changes
  useEffect(() => {
    if (isAuthenticated && hasFetchedRef.current) {
      fetchInvites(false);
    }
  }, [statusFilter, isAuthenticated, fetchInvites]);

  const refetch = useCallback((showLoading = false) => fetchInvites(showLoading), [fetchInvites]);

  return { data, isLoading, error, refetch };
}
