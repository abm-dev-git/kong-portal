import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type { MembersListResponse, MemberRole } from '../types/user-management';

/**
 * Custom hook for fetching organization members
 * SSR-safe - follows useLinkedInStatus pattern
 */
export function useMembers(token?: string, orgId?: string, roleFilter?: MemberRole) {
  const [data, setData] = useState<MembersListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId to avoid recreating fetchMembers
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const roleFilterRef = useRef(roleFilter);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    roleFilterRef.current = roleFilter;
  }, [token, orgId, roleFilter]);

  const fetchMembers = useCallback(async (isInitialFetch = false) => {
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
      const params = roleFilterRef.current ? `?role=${roleFilterRef.current}` : '';
      const result = await api.get<MembersListResponse>(`/v1/users/members${params}`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        // Handle error response
        setError(new Error(result.error?.message || 'Failed to fetch members'));
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
      fetchMembers(true);
    } else if (!token) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchMembers]);

  // Refetch when roleFilter changes
  useEffect(() => {
    if (token && hasFetchedRef.current) {
      fetchMembers(false);
    }
  }, [roleFilter, token, fetchMembers]);

  const refetch = useCallback((showLoading = false) => fetchMembers(showLoading), [fetchMembers]);

  return { data, isLoading, error, refetch };
}
