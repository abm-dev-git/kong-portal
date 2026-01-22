import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type {
  Team,
  TeamListResponse,
  TeamMember,
  TeamMemberListResponse,
  CreateTeamRequest,
  UpdateTeamRequest,
  AddTeamMemberRequest,
  UpdateTeamMemberRoleRequest,
  TeamMemberRole,
} from '../types/teams';

/**
 * Custom hook for fetching and managing teams
 * SSR-safe - follows useMembers pattern
 * @param token - Clerk JWT token or 'DEVLOGIN' for DevLogin mode
 * @param orgId - Organization ID
 * @param workspaceId - Optional workspace ID filter
 * @param devLoginKey - Optional DevLogin key for E2E testing
 */
export function useTeams(token?: string, orgId?: string, workspaceId?: string, devLoginKey?: string) {
  const [data, setData] = useState<TeamListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId/devLoginKey to avoid recreating fetch function
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const workspaceIdRef = useRef(workspaceId);
  const devLoginKeyRef = useRef(devLoginKey);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    workspaceIdRef.current = workspaceId;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, workspaceId, devLoginKey]);

  const fetchTeams = useCallback(async (isInitialFetch = false, includeArchived = false) => {
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
      const params = new URLSearchParams();
      if (workspaceIdRef.current) {
        params.append('workspaceId', workspaceIdRef.current);
      }
      if (includeArchived) {
        params.append('includeArchived', 'true');
      }
      const queryString = params.toString() ? `?${params.toString()}` : '';
      const result = await api.get<TeamListResponse>(`/v1/teams${queryString}`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch teams'));
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
      fetchTeams(true);
    } else if (!hasAuth) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, devLoginKey, fetchTeams]);

  // Refetch when workspaceId changes
  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && hasFetchedRef.current) {
      fetchTeams(false);
    }
  }, [workspaceId, token, devLoginKey, fetchTeams]);

  const refetch = useCallback((showLoading = false) => fetchTeams(showLoading), [fetchTeams]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching teams the current user belongs to
 * @param token - Clerk JWT token or 'DEVLOGIN' for DevLogin mode
 * @param orgId - Organization ID
 * @param workspaceId - Optional workspace ID filter
 * @param devLoginKey - Optional DevLogin key for E2E testing
 */
export function useMyTeams(token?: string, orgId?: string, workspaceId?: string, devLoginKey?: string) {
  const [data, setData] = useState<TeamListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasFetchedRef = useRef(false);
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const workspaceIdRef = useRef(workspaceId);
  const devLoginKeyRef = useRef(devLoginKey);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    workspaceIdRef.current = workspaceId;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, workspaceId, devLoginKey]);

  const fetchMyTeams = useCallback(async (isInitialFetch = false) => {
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
      const params = workspaceIdRef.current ? `?workspaceId=${workspaceIdRef.current}` : '';
      const result = await api.get<TeamListResponse>(`/v1/teams/my${params}`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch teams'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchMyTeams(true);
    } else if (!hasAuth) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, devLoginKey, fetchMyTeams]);

  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && hasFetchedRef.current) {
      fetchMyTeams(false);
    }
  }, [workspaceId, token, devLoginKey, fetchMyTeams]);

  const refetch = useCallback((showLoading = false) => fetchMyTeams(showLoading), [fetchMyTeams]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching a single team by ID
 * @param teamId - Team ID
 * @param token - Clerk JWT token or 'DEVLOGIN' for DevLogin mode
 * @param orgId - Organization ID
 * @param devLoginKey - Optional DevLogin key for E2E testing
 */
export function useTeam(teamId: string | undefined, token?: string, orgId?: string, devLoginKey?: string) {
  const [data, setData] = useState<Team | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasFetchedRef = useRef(false);
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const teamIdRef = useRef(teamId);
  const devLoginKeyRef = useRef(devLoginKey);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    teamIdRef.current = teamId;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, teamId, devLoginKey]);

  const fetchTeam = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentTeamId = teamIdRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;

    // Need either a real token or a DevLogin key, plus teamId
    if ((!currentToken && !currentDevLoginKey) || !currentTeamId || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.get<Team>(`/v1/teams/${currentTeamId}`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch team'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && teamId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchTeam(true);
    } else if (!hasAuth || !teamId) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, devLoginKey, teamId, fetchTeam]);

  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && teamId && hasFetchedRef.current) {
      fetchTeam(false);
    }
  }, [teamId, token, devLoginKey, fetchTeam]);

  const refetch = useCallback((showLoading = false) => fetchTeam(showLoading), [fetchTeam]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching team members
 * @param teamId - Team ID
 * @param token - Clerk JWT token or 'DEVLOGIN' for DevLogin mode
 * @param orgId - Organization ID
 * @param devLoginKey - Optional DevLogin key for E2E testing
 */
export function useTeamMembers(teamId: string | undefined, token?: string, orgId?: string, devLoginKey?: string) {
  const [data, setData] = useState<TeamMemberListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasFetchedRef = useRef(false);
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const teamIdRef = useRef(teamId);
  const devLoginKeyRef = useRef(devLoginKey);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    teamIdRef.current = teamId;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, teamId, devLoginKey]);

  const fetchMembers = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentTeamId = teamIdRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;

    // Need either a real token or a DevLogin key, plus teamId
    if ((!currentToken && !currentDevLoginKey) || !currentTeamId || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.get<TeamMemberListResponse>(`/v1/teams/${currentTeamId}/members`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch team members'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && teamId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchMembers(true);
    } else if (!hasAuth || !teamId) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, devLoginKey, teamId, fetchMembers]);

  useEffect(() => {
    const hasAuth = token || devLoginKey;
    if (hasAuth && teamId && hasFetchedRef.current) {
      fetchMembers(false);
    }
  }, [teamId, token, devLoginKey, fetchMembers]);

  const refetch = useCallback((showLoading = false) => fetchMembers(showLoading), [fetchMembers]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for team mutation operations
 * @param token - Clerk JWT token or 'DEVLOGIN' for DevLogin mode
 * @param orgId - Organization ID
 * @param devLoginKey - Optional DevLogin key for E2E testing
 */
export function useTeamMutations(token?: string, orgId?: string, devLoginKey?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const devLoginKeyRef = useRef(devLoginKey);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    devLoginKeyRef.current = devLoginKey;
  }, [token, orgId, devLoginKey]);

  const createTeam = useCallback(async (request: CreateTeamRequest): Promise<Team | null> => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;
    if (!currentToken && !currentDevLoginKey) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.post<Team>('/v1/teams', request);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(new Error(result.error?.message || 'Failed to create team'));
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateTeam = useCallback(async (teamId: string, request: UpdateTeamRequest): Promise<Team | null> => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;
    if (!currentToken && !currentDevLoginKey) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.put<Team>(`/v1/teams/${teamId}`, request);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(new Error(result.error?.message || 'Failed to update team'));
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const archiveTeam = useCallback(async (teamId: string): Promise<boolean> => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;
    if (!currentToken && !currentDevLoginKey) {
      setError(new Error('Not authenticated'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.delete(`/v1/teams/${teamId}`);

      if (result.success) {
        return true;
      } else {
        setError(new Error(result.error?.message || 'Failed to archive team'));
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMember = useCallback(async (teamId: string, request: AddTeamMemberRequest): Promise<TeamMember | null> => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;
    if (!currentToken && !currentDevLoginKey) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.post<TeamMember>(`/v1/teams/${teamId}/members`, request);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(new Error(result.error?.message || 'Failed to add member'));
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const removeMember = useCallback(async (teamId: string, userId: string): Promise<boolean> => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;
    if (!currentToken && !currentDevLoginKey) {
      setError(new Error('Not authenticated'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.delete(`/v1/teams/${teamId}/members/${userId}`);

      if (result.success) {
        return true;
      } else {
        setError(new Error(result.error?.message || 'Failed to remove member'));
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateMemberRole = useCallback(async (teamId: string, userId: string, role: TeamMemberRole): Promise<TeamMember | null> => {
    const currentToken = tokenRef.current;
    const currentDevLoginKey = devLoginKeyRef.current;
    if (!currentToken && !currentDevLoginKey) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current, currentDevLoginKey);
      const result = await api.patch<TeamMember>(`/v1/teams/${teamId}/members/${userId}/role`, { role } as UpdateTeamMemberRoleRequest);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(new Error(result.error?.message || 'Failed to update member role'));
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    createTeam,
    updateTeam,
    archiveTeam,
    addMember,
    removeMember,
    updateMemberRole,
    isLoading,
    error,
  };
}
