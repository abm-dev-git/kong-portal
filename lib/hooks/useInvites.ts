import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type { InvitesListResponse, InviteStatus } from '../types/user-management';

/**
 * Custom hook for fetching organization invites
 * SSR-safe - follows useLinkedInStatus pattern
 */
export function useInvites(token?: string, orgId?: string, statusFilter?: InviteStatus) {
  const [data, setData] = useState<InvitesListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId to avoid recreating fetchInvites
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const statusFilterRef = useRef(statusFilter);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    statusFilterRef.current = statusFilter;
  }, [token, orgId, statusFilter]);

  const fetchInvites = useCallback(async (isInitialFetch = false) => {
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
      const params = statusFilterRef.current ? `?status=${statusFilterRef.current}` : '';
      const result = await api.get<InvitesListResponse>(`/v1/users/invites${params}`);

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

  // Initial fetch - only when token becomes available
  useEffect(() => {
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchInvites(true);
    } else if (!token) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchInvites]);

  // Refetch when statusFilter changes
  useEffect(() => {
    if (token && hasFetchedRef.current) {
      fetchInvites(false);
    }
  }, [statusFilter, token, fetchInvites]);

  const refetch = useCallback((showLoading = false) => fetchInvites(showLoading), [fetchInvites]);

  return { data, isLoading, error, refetch };
}
