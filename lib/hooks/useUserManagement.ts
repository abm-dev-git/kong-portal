import { useMemo, useCallback } from 'react';
import { createApiClient } from '../api-client';
import type {
  MemberRole,
  OrganizationInvite,
  CreateInviteRequest,
  OrganizationMember
} from '../types/user-management';

/**
 * Custom hook for user management mutations
 * Returns action functions that can be called to perform mutations
 */
export function useUserManagement(token?: string, orgId?: string) {
  // Create API client with current auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  /**
   * Update a member's role
   */
  const updateMemberRole = useCallback(async (userId: string, newRole: MemberRole) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const result = await api.patch<OrganizationMember>(
      `/v1/users/members/${userId}/role`,
      { newRole }
    );

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update role');
    }

    return result.data;
  }, [api, token]);

  /**
   * Remove a member from the organization
   */
  const removeMember = useCallback(async (userId: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const result = await api.delete(`/v1/users/members/${userId}`);

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to remove member');
    }

    return true;
  }, [api, token]);

  /**
   * Create an invitation
   */
  const createInvite = useCallback(async (invite: CreateInviteRequest) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const result = await api.post<OrganizationInvite>('/v1/users/invites', invite);

    if (!result.success) {
      const error = new Error(result.error?.message || 'Failed to create invite') as Error & { code?: string };
      error.code = result.error?.code;
      throw error;
    }

    return result.data;
  }, [api, token]);

  /**
   * Revoke an invitation
   */
  const revokeInvite = useCallback(async (inviteId: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const result = await api.delete(`/v1/users/invites/${inviteId}`);

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to revoke invite');
    }

    return true;
  }, [api, token]);

  /**
   * Accept an invitation
   */
  const acceptInvite = useCallback(async (inviteToken: string) => {
    if (!token) {
      throw new Error('Not authenticated');
    }

    const result = await api.post<OrganizationMember>('/v1/users/invites/accept', { token: inviteToken });

    if (!result.success) {
      const error = new Error(result.error?.message || 'Failed to accept invite') as Error & { code?: string };
      error.code = result.error?.code;
      throw error;
    }

    return result.data;
  }, [api, token]);

  return {
    updateMemberRole,
    removeMember,
    createInvite,
    revokeInvite,
    acceptInvite,
  };
}
