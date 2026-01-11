// ============ TEAM TYPES ============

export type TeamStatus = 'active' | 'archived';
export type TeamMemberRole = 'lead' | 'member';

export interface Team {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  status: TeamStatus;
  createdAt: string;
  updatedAt: string | null;
}

export interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: TeamMemberRole;
  joinedAt: string;
  addedBy: string | null;
}

export interface TeamListResponse {
  teams: Team[];
  totalCount: number;
}

export interface TeamMemberListResponse {
  members: TeamMember[];
  totalCount: number;
}

export interface CreateTeamRequest {
  workspaceId: string;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface UpdateTeamRequest {
  name?: string;
  description?: string;
  color?: string;
  icon?: string;
}

export interface AddTeamMemberRequest {
  userId: string;
  role?: TeamMemberRole;
}

export interface UpdateTeamMemberRoleRequest {
  role: TeamMemberRole;
}

// ============ ROLE HELPERS ============

export const TEAM_ROLE_LABELS: Record<TeamMemberRole, string> = {
  lead: 'Team Lead',
  member: 'Member',
};

export const TEAM_ROLE_DESCRIPTIONS: Record<TeamMemberRole, string> = {
  lead: 'Can manage team settings and members',
  member: 'Standard team member',
};

// ============ COLOR PRESETS ============

export const TEAM_COLOR_PRESETS = [
  '#00D4AA', // Teal (brand color)
  '#6366F1', // Indigo
  '#F59E0B', // Amber
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#10B981', // Emerald
  '#3B82F6', // Blue
  '#EC4899', // Pink
  '#F97316', // Orange
  '#14B8A6', // Cyan
];

// ============ ICON PRESETS ============

export const TEAM_ICON_PRESETS = [
  'users',
  'briefcase',
  'code',
  'chart-bar',
  'cog',
  'megaphone',
  'document',
  'lightning-bolt',
  'star',
  'heart',
];
