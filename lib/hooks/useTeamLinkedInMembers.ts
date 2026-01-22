'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@clerk/nextjs'

export interface TeamMemberWithLinkedIn {
  userId: string
  displayName: string
  email: string
  teamRole: string
  hasLinkedInConnection: boolean
  linkedInStatus?: string
  linkedInProfileName?: string
  linkedInProfileUrl?: string
  lastUsedAt?: string
  enrichmentCount?: number
}

interface UseTeamLinkedInMembersResult {
  members: TeamMemberWithLinkedIn[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
}

export function useTeamLinkedInMembers(teamId?: string): UseTeamLinkedInMembersResult {
  const { getToken } = useAuth()
  const [members, setMembers] = useState<TeamMemberWithLinkedIn[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    if (!teamId) {
      setMembers([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const token = await getToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/linkedin/team/${teamId}/members-with-linkedin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch team members')
      }

      const data = await response.json()
      setMembers(data.members || data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load team members')
      // Fallback to mock data for development
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [teamId, getToken])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  return {
    members,
    loading,
    error,
    refresh: fetchMembers,
  }
}

export function useOrganizationLinkedInMembers(): UseTeamLinkedInMembersResult {
  const { getToken } = useAuth()
  const [members, setMembers] = useState<TeamMemberWithLinkedIn[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMembers = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = await getToken()
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/linkedin/organization/members-with-linkedin`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (!response.ok) {
        throw new Error('Failed to fetch organization members')
      }

      const data = await response.json()
      setMembers(data.members || data || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load organization members')
      setMembers([])
    } finally {
      setLoading(false)
    }
  }, [getToken])

  useEffect(() => {
    fetchMembers()
  }, [fetchMembers])

  return {
    members,
    loading,
    error,
    refresh: fetchMembers,
  }
}
