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
 */
export function useTeams(token?: string, orgId?: string, workspaceId?: string) {
  const [data, setData] = useState<TeamListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId to avoid recreating fetch function
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const workspaceIdRef = useRef(workspaceId);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    workspaceIdRef.current = workspaceId;
  }, [token, orgId, workspaceId]);

  const fetchTeams = useCallback(async (isInitialFetch = false, includeArchived = false) => {
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

  // Initial fetch - only when token becomes available
  useEffect(() => {
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchTeams(true);
    } else if (!token) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchTeams]);

  // Refetch when workspaceId changes
  useEffect(() => {
    if (token && hasFetchedRef.current) {
      fetchTeams(false);
    }
  }, [workspaceId, token, fetchTeams]);

  const refetch = useCallback((showLoading = false) => fetchTeams(showLoading), [fetchTeams]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching teams the current user belongs to
 */
export function useMyTeams(token?: string, orgId?: string, workspaceId?: string) {
  const [data, setData] = useState<TeamListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasFetchedRef = useRef(false);
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const workspaceIdRef = useRef(workspaceId);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    workspaceIdRef.current = workspaceId;
  }, [token, orgId, workspaceId]);

  const fetchMyTeams = useCallback(async (isInitialFetch = false) => {
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
    if (token && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchMyTeams(true);
    } else if (!token) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchMyTeams]);

  useEffect(() => {
    if (token && hasFetchedRef.current) {
      fetchMyTeams(false);
    }
  }, [workspaceId, token, fetchMyTeams]);

  const refetch = useCallback((showLoading = false) => fetchMyTeams(showLoading), [fetchMyTeams]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching a single team by ID
 */
export function useTeam(teamId: string | undefined, token?: string, orgId?: string) {
  const [data, setData] = useState<Team | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasFetchedRef = useRef(false);
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const teamIdRef = useRef(teamId);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    teamIdRef.current = teamId;
  }, [token, orgId, teamId]);

  const fetchTeam = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentTeamId = teamIdRef.current;

    if (!currentToken || !currentTeamId || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current);
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
    if (token && teamId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchTeam(true);
    } else if (!token || !teamId) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, teamId, fetchTeam]);

  useEffect(() => {
    if (token && teamId && hasFetchedRef.current) {
      fetchTeam(false);
    }
  }, [teamId, token, fetchTeam]);

  const refetch = useCallback((showLoading = false) => fetchTeam(showLoading), [fetchTeam]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching team members
 */
export function useTeamMembers(teamId: string | undefined, token?: string, orgId?: string) {
  const [data, setData] = useState<TeamMemberListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasFetchedRef = useRef(false);
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);
  const teamIdRef = useRef(teamId);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
    teamIdRef.current = teamId;
  }, [token, orgId, teamId]);

  const fetchMembers = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentTeamId = teamIdRef.current;

    if (!currentToken || !currentTeamId || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current);
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
    if (token && teamId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchMembers(true);
    } else if (!token || !teamId) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, teamId, fetchMembers]);

  useEffect(() => {
    if (token && teamId && hasFetchedRef.current) {
      fetchMembers(false);
    }
  }, [teamId, token, fetchMembers]);

  const refetch = useCallback((showLoading = false) => fetchMembers(showLoading), [fetchMembers]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for team mutation operations
 */
export function useTeamMutations(token?: string, orgId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
  }, [token, orgId]);

  const createTeam = useCallback(async (request: CreateTeamRequest): Promise<Team | null> => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
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
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
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
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
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
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
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
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
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
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
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
