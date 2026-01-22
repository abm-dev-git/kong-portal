'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useAuth } from '@clerk/nextjs'
import { Workspace } from '@/lib/types/workspaces'
import { createApiClient } from '@/lib/api-client'

interface WorkspaceContextValue {
  currentWorkspace: Workspace | null
  workspaces: Workspace[]
  isLoading: boolean
  error: string | null
  setCurrentWorkspace: (workspace: Workspace) => void
  refreshWorkspaces: () => Promise<void>
}

const WorkspaceContext = createContext<WorkspaceContextValue | undefined>(undefined)

const WORKSPACE_STORAGE_KEY = 'abm-current-workspace-id'

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { getToken, orgId } = useAuth()
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      const token = await getToken()
      if (!token) {
        setIsLoading(false)
        return
      }

      const api = createApiClient(token, orgId ?? undefined)
      const result = await api.get<{ items: Workspace[] }>('/v1/workspaces')

      if (result.success && result.data?.items) {
        setWorkspaces(result.data.items)

        // Try to restore previously selected workspace
        const storedId = localStorage.getItem(WORKSPACE_STORAGE_KEY)
        const storedWorkspace = result.data.items.find(w => w.id === storedId)

        if (storedWorkspace) {
          setCurrentWorkspaceState(storedWorkspace)
        } else if (result.data.items.length > 0) {
          // Default to first workspace (usually the default one)
          const defaultWs = result.data.items.find(w => w.isDefault) || result.data.items[0]
          setCurrentWorkspaceState(defaultWs)
          localStorage.setItem(WORKSPACE_STORAGE_KEY, defaultWs.id)
        }
      } else {
        setError(result.error?.message || 'Failed to load workspaces')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load workspaces')
    } finally {
      setIsLoading(false)
    }
  }, [getToken, orgId])

  useEffect(() => {
    fetchWorkspaces()
  }, [fetchWorkspaces])

  const setCurrentWorkspace = useCallback((workspace: Workspace) => {
    setCurrentWorkspaceState(workspace)
    localStorage.setItem(WORKSPACE_STORAGE_KEY, workspace.id)
  }, [])

  const refreshWorkspaces = useCallback(async () => {
    await fetchWorkspaces()
  }, [fetchWorkspaces])

  return (
    <WorkspaceContext.Provider
      value={{
        currentWorkspace,
        workspaces,
        isLoading,
        error,
        setCurrentWorkspace,
        refreshWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  )
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext)
  if (context === undefined) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider')
  }
  return context
}
