import { useState, useEffect, useCallback, useRef } from 'react';
import { createApiClient } from '../api-client';
import type {
  Workspace,
  WorkspaceListResponse,
  WorkspaceMember,
  WorkspaceMemberListResponse,
  CreateWorkspaceRequest,
  UpdateWorkspaceRequest,
  AddWorkspaceMemberRequest,
} from '../types/workspaces';

/**
 * Custom hook for fetching and managing workspaces
 * SSR-safe - follows useMembers pattern
 */
export function useWorkspaces(token?: string, orgId?: string) {
  const [data, setData] = useState<WorkspaceListResponse | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Track if initial fetch has been done
  const hasFetchedRef = useRef(false);
  // Use ref for token/orgId to avoid recreating fetch function
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);

  // Keep refs up to date
  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
  }, [token, orgId]);

  const fetchWorkspaces = useCallback(async (isInitialFetch = false, includeArchived = false) => {
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
      const params = includeArchived ? '?includeArchived=true' : '';
      const result = await api.get<WorkspaceListResponse>(`/v1/workspaces${params}`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch workspaces'));
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
      fetchWorkspaces(true);
    } else if (!token) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchWorkspaces]);

  const refetch = useCallback((showLoading = false) => fetchWorkspaces(showLoading), [fetchWorkspaces]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching the default workspace
 */
export function useDefaultWorkspace(token?: string, orgId?: string) {
  const [data, setData] = useState<Workspace | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const hasFetchedRef = useRef(false);
  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
  }, [token, orgId]);

  const fetchDefault = useCallback(async (isInitialFetch = false) => {
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
      const result = await api.get<Workspace>('/v1/workspaces/default');

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch default workspace'));
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
      fetchDefault(true);
    } else if (!token) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, fetchDefault]);

  const refetch = useCallback((showLoading = false) => fetchDefault(showLoading), [fetchDefault]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching a single workspace by ID
 */
export function useWorkspace(workspaceId: string | undefined, token?: string, orgId?: string) {
  const [data, setData] = useState<Workspace | undefined>(undefined);
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

  const fetchWorkspace = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentWorkspaceId = workspaceIdRef.current;

    if (!currentToken || !currentWorkspaceId || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.get<Workspace>(`/v1/workspaces/${currentWorkspaceId}`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch workspace'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && workspaceId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchWorkspace(true);
    } else if (!token || !workspaceId) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, workspaceId, fetchWorkspace]);

  // Refetch when workspaceId changes
  useEffect(() => {
    if (token && workspaceId && hasFetchedRef.current) {
      fetchWorkspace(false);
    }
  }, [workspaceId, token, fetchWorkspace]);

  const refetch = useCallback((showLoading = false) => fetchWorkspace(showLoading), [fetchWorkspace]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for fetching workspace members
 */
export function useWorkspaceMembers(workspaceId: string | undefined, token?: string, orgId?: string) {
  const [data, setData] = useState<WorkspaceMemberListResponse | undefined>(undefined);
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

  const fetchMembers = useCallback(async (isInitialFetch = false) => {
    const currentToken = tokenRef.current;
    const currentWorkspaceId = workspaceIdRef.current;

    if (!currentToken || !currentWorkspaceId || typeof window === 'undefined') {
      setIsLoading(false);
      return;
    }

    try {
      if (isInitialFetch) {
        setIsLoading(true);
      }

      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.get<WorkspaceMemberListResponse>(`/v1/workspaces/${currentWorkspaceId}/members`);

      if (result.success && result.data) {
        setData(result.data);
        setError(null);
      } else {
        setError(new Error(result.error?.message || 'Failed to fetch workspace members'));
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token && workspaceId && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchMembers(true);
    } else if (!token || !workspaceId) {
      hasFetchedRef.current = false;
      setIsLoading(true);
    }
  }, [token, workspaceId, fetchMembers]);

  useEffect(() => {
    if (token && workspaceId && hasFetchedRef.current) {
      fetchMembers(false);
    }
  }, [workspaceId, token, fetchMembers]);

  const refetch = useCallback((showLoading = false) => fetchMembers(showLoading), [fetchMembers]);

  return { data, isLoading, error, refetch };
}

/**
 * Hook for workspace mutation operations
 */
export function useWorkspaceMutations(token?: string, orgId?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const tokenRef = useRef(token);
  const orgIdRef = useRef(orgId);

  useEffect(() => {
    tokenRef.current = token;
    orgIdRef.current = orgId;
  }, [token, orgId]);

  const createWorkspace = useCallback(async (request: CreateWorkspaceRequest): Promise<Workspace | null> => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.post<Workspace>('/v1/workspaces', request);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(new Error(result.error?.message || 'Failed to create workspace'));
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateWorkspace = useCallback(async (workspaceId: string, request: UpdateWorkspaceRequest): Promise<Workspace | null> => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.put<Workspace>(`/v1/workspaces/${workspaceId}`, request);

      if (result.success && result.data) {
        return result.data;
      } else {
        setError(new Error(result.error?.message || 'Failed to update workspace'));
        return null;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const archiveWorkspace = useCallback(async (workspaceId: string): Promise<boolean> => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.delete(`/v1/workspaces/${workspaceId}`);

      if (result.success) {
        return true;
      } else {
        setError(new Error(result.error?.message || 'Failed to archive workspace'));
        return false;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addMember = useCallback(async (workspaceId: string, request: AddWorkspaceMemberRequest): Promise<WorkspaceMember | null> => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.post<WorkspaceMember>(`/v1/workspaces/${workspaceId}/members`, request);

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

  const removeMember = useCallback(async (workspaceId: string, userId: string): Promise<boolean> => {
    const currentToken = tokenRef.current;
    if (!currentToken) {
      setError(new Error('Not authenticated'));
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const api = createApiClient(currentToken, orgIdRef.current);
      const result = await api.delete(`/v1/workspaces/${workspaceId}/members/${userId}`);

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

  return {
    createWorkspace,
    updateWorkspace,
    archiveWorkspace,
    addMember,
    removeMember,
    isLoading,
    error,
  };
}
