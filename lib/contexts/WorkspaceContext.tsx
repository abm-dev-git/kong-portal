'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react'
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

// Helper to get DevLogin key from cookie
function getDevLoginKey(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(/(?:^|;\s*)devlogin=([^;]*)/)
  return match ? decodeURIComponent(match[1]) : null
}

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const { getToken, orgId } = useAuth()
  const [currentWorkspace, setCurrentWorkspaceState] = useState<Workspace | null>(null)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const hasFetchedRef = useRef(false)

  const fetchWorkspaces = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)

      // Check for DevLogin key first
      const devLoginKey = getDevLoginKey()

      // Get Clerk token (may be null in DevLogin mode)
      const token = await getToken().catch(() => null)

      // Need either a token or devLoginKey
      if (!token && !devLoginKey) {
        setIsLoading(false)
        return
      }

      const api = createApiClient(token ?? undefined, orgId ?? undefined, devLoginKey ?? undefined)
      const result = await api.get<{ workspaces: Workspace[] }>('/v1/workspaces')

      // Handle both { workspaces: [...] } and { items: [...] } response formats
      const items = result.data?.workspaces || (result.data as unknown as { items: Workspace[] })?.items || []

      if (result.success && items.length > 0) {
        setWorkspaces(items)

        // Try to restore previously selected workspace
        const storedId = localStorage.getItem(WORKSPACE_STORAGE_KEY)
        const storedWorkspace = items.find(w => w.id === storedId)

        if (storedWorkspace) {
          setCurrentWorkspaceState(storedWorkspace)
        } else if (items.length > 0) {
          // Default to first workspace (usually the default one)
          const defaultWs = items.find(w => w.isDefault) || items[0]
          setCurrentWorkspaceState(defaultWs)
          localStorage.setItem(WORKSPACE_STORAGE_KEY, defaultWs.id)
        }
      } else if (!result.success) {
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
