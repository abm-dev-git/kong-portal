// ============ WORKSPACE TYPES ============

export type WorkspaceStatus = 'active' | 'archived';
export type WorkspaceMemberRole = 'owner' | 'admin' | 'member' | 'viewer';

export interface Workspace {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  status: WorkspaceStatus;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string | null;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  role: WorkspaceMemberRole;
  addedAt: string;
  addedBy: string | null;
}

export interface WorkspaceListResponse {
  workspaces: Workspace[];
  totalCount: number;
}

export interface WorkspaceMemberListResponse {
  members: WorkspaceMember[];
  totalCount: number;
}

export interface CreateWorkspaceRequest {
  name: string;
  slug?: string;
  description?: string;
  isDefault?: boolean;
}

export interface UpdateWorkspaceRequest {
  name?: string;
  description?: string;
  isDefault?: boolean;
}

export interface AddWorkspaceMemberRequest {
  userId: string;
  role?: WorkspaceMemberRole;
}

// ============ ROLE HELPERS ============

export const WORKSPACE_ROLE_LABELS: Record<WorkspaceMemberRole, string> = {
  owner: 'Owner',
  admin: 'Admin',
  member: 'Member',
  viewer: 'Viewer',
};

export const WORKSPACE_ROLE_DESCRIPTIONS: Record<WorkspaceMemberRole, string> = {
  owner: 'Full control over workspace including deletion',
  admin: 'Can manage workspace settings and members',
  member: 'Can create and edit content',
  viewer: 'Read-only access to workspace content',
};

// Role hierarchy for permission checks
export const WORKSPACE_ROLE_HIERARCHY: Record<WorkspaceMemberRole, number> = {
  owner: 4,
  admin: 3,
  member: 2,
  viewer: 1,
};

export function canManageWorkspace(role: WorkspaceMemberRole): boolean {
  return WORKSPACE_ROLE_HIERARCHY[role] >= WORKSPACE_ROLE_HIERARCHY.admin;
}

export function canEditContent(role: WorkspaceMemberRole): boolean {
  return WORKSPACE_ROLE_HIERARCHY[role] >= WORKSPACE_ROLE_HIERARCHY.member;
}
