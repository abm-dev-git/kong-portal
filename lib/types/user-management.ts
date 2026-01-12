// ============ MEMBER TYPES ============

export type MemberRole = 'admin' | 'editor' | 'viewer';
export type MemberStatus = 'active' | 'suspended' | 'removed';

export interface OrganizationMember {
  id: string;
  userId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: MemberRole;
  status: MemberStatus;
  joinedAt: string;
  invitedBy: string | null;
  lastActiveAt: string | null;
  hasLinkedInConnection: boolean;
}

export interface MembersListResponse {
  members: OrganizationMember[];
  totalCount: number;
}

export interface UpdateRoleRequest {
  newRole: MemberRole;
}

// ============ INVITE TYPES ============

export type InviteStatus = 'pending' | 'accepted' | 'expired' | 'revoked';

export interface OrganizationInvite {
  id: string;
  email: string;
  role: MemberRole;
  status: InviteStatus;
  invitedByName: string | null;
  message: string | null;
  createdAt: string;
  expiresAt: string;
  sendCount: number;
}

export interface CreateInviteRequest {
  email: string;
  role: MemberRole;
  message?: string;
}

export interface InvitesListResponse {
  invites: OrganizationInvite[];
  totalCount: number;
}

export interface AcceptInviteRequest {
  token: string;
}

export interface PendingInvitesResponse {
  invites: Array<OrganizationInvite & { organizationName?: string }>;
}

// ============ CURRENT USER ============

export interface CurrentUserResponse {
  id: string;
  userId: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  role: MemberRole;
  organizationId: string;
  organizationName: string;
}

// ============ ERROR CODES ============

export type UserManagementErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'NOT_FOUND'
  | 'MEMBER_EXISTS'
  | 'INVITE_EXISTS'
  | 'CANNOT_DEMOTE_SELF'
  | 'LAST_ADMIN'
  | 'INVITE_EXPIRED'
  | 'INVITE_INVALID';

export const ErrorMessages: Record<UserManagementErrorCode, string> = {
  UNAUTHORIZED: 'Please sign in to continue',
  FORBIDDEN: "You don't have permission for this action",
  NOT_FOUND: 'The requested item was not found',
  MEMBER_EXISTS: 'This user is already a team member',
  INVITE_EXISTS: 'A pending invite already exists for this email',
  CANNOT_DEMOTE_SELF: 'You cannot change your own role',
  LAST_ADMIN: 'Cannot remove the last admin',
  INVITE_EXPIRED: 'This invitation has expired',
  INVITE_INVALID: 'This invitation is no longer valid',
};

// ============ ROLE HELPERS ============

export const ROLE_LABELS: Record<MemberRole, string> = {
  admin: 'Admin',
  editor: 'Editor',
  viewer: 'Viewer',
};

export const ROLE_DESCRIPTIONS: Record<MemberRole, string> = {
  admin: 'Full access to all features, settings, and billing',
  editor: 'Can use features and manage data, no billing or user management',
  viewer: 'Read-only access to dashboards and reports',
};

// ============ CURRENT USER WITH PERMISSIONS ============

export interface CurrentUser extends OrganizationMember {
  organizationId: string;
  organizationName: string;
  permissions: string[];  // e.g., ['contacts:read', 'enrichment:trigger']
}
