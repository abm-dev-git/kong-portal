import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type { MembersListResponse, MemberRole } from '../types/user-management';

/**
 * Custom hook for fetching organization members
 * SSR-safe - follows useLinkedInStatus pattern
 * @param token - Clerk JWT token or 'DEVLOGIN' for DevLogin mode
 * @param orgId - Organization ID
 * @param roleFilter - Optional role filter
 * @param devLoginKey - Optional DevLogin key for E2E testing
 */
export function useMembers(token?: string, orgId?: string, roleFilter?: MemberRole, devLoginKey?: string) {
  const [data, setData] = useState<MembersListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId/devLoginKey to avoid recreating fetchMembers
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const roleFilterRef = useRef(roleFilter);
  const devLoginKeyRef = useRef(devLoginKey);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    roleFilterRef.current = roleFilter;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, roleFilter, devLoginKey]);

  const fetchMembers = useCallback(async (isInitialFetch = false) => {
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

  // Initial fetch - only when token or devLoginKey becomes available
  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchMembers(true);
    } else if (!hasAuth) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, devLoginKey, fetchMembers]);

  // Refetch when roleFilter changes
  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && hasFetchedRef.current) {
      fetchMembers(false);
    }
  }, [roleFilter, token, devLoginKey, fetchMembers]);

  const refetch = useCallback((showLoading = false) => fetchMembers(showLoading), [fetchMembers]);

  return { data, isLoading, error, refetch };
}
