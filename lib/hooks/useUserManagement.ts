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
export function useUserManagement(token?: string, orgId?: string, devLoginKey?: string) {
  // Create API client with current auth context (supports DevLogin for E2E testing)
  const api = useMemo(() => createApiClient(token, orgId, devLoginKey), [token, orgId, devLoginKey]);

  // Check if authenticated (either via token or DevLogin)
  const isAuthenticated = Boolean(token || devLoginKey);

  /**
   * Update a member's role
   */
  const updateMemberRole = useCallback(async (userId: string, newRole: MemberRole) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const result = await api.patch<OrganizationMember>(
      `/users/members/${userId}/role`,
      { newRole }
    );

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to update role');
    }

    return result.data;
  }, [api, isAuthenticated]);

  /**
   * Remove a member from the organization
   */
  const removeMember = useCallback(async (userId: string) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const result = await api.delete(`/users/members/${userId}`);

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to remove member');
    }

    return true;
  }, [api, isAuthenticated]);

  /**
   * Create an invitation
   */
  const createInvite = useCallback(async (invite: CreateInviteRequest) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const result = await api.post<OrganizationInvite>('/users/invites', invite);

    if (!result.success) {
      const error = new Error(result.error?.message || 'Failed to create invite') as Error & { code?: string };
      error.code = result.error?.code;
      throw error;
    }

    return result.data;
  }, [api, isAuthenticated]);

  /**
   * Revoke an invitation
   */
  const revokeInvite = useCallback(async (inviteId: string) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const result = await api.delete(`/users/invites/${inviteId}`);

    if (!result.success) {
      throw new Error(result.error?.message || 'Failed to revoke invite');
    }

    return true;
  }, [api, isAuthenticated]);

  /**
   * Accept an invitation
   */
  const acceptInvite = useCallback(async (inviteToken: string) => {
    if (!isAuthenticated) {
      throw new Error('Not authenticated');
    }

    const result = await api.post<OrganizationMember>('/users/invites/accept', { token: inviteToken });

    if (!result.success) {
      const error = new Error(result.error?.message || 'Failed to accept invite') as Error & { code?: string };
      error.code = result.error?.code;
      throw error;
    }

    return result.data;
  }, [api, isAuthenticated]);

  return {
    updateMemberRole,
    removeMember,
    createInvite,
    revokeInvite,
    acceptInvite,
  };
}
