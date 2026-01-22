'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { MoreHorizontal, Shield, Edit, Eye, Linkedin, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUserManagement } from '@/lib/hooks/useUserManagement';
import type { OrganizationMember, MemberRole } from '@/lib/types/user-management';
import { formatDate } from '@/lib/utils';

interface MembersTableProps {
  members: OrganizationMember[];
  currentUserId?: string;
  isAdmin: boolean;
  isLoading: boolean;
  token?: string;
  orgId?: string;
  onMemberChange?: () => void;
  devLoginKey?: string;
}

const roleIcons: Record<MemberRole, typeof Shield> = {
  admin: Shield,
  editor: Edit,
  viewer: Eye,
};

const roleBadgeStyles: Record<MemberRole, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  editor: 'bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30',
  viewer: 'bg-[var(--cream)]/10 text-[var(--cream)]/70 border-[var(--cream)]/20',
};

export function MembersTable({
  members,
  currentUserId,
  isAdmin,
  isLoading,
  token,
  orgId,
  onMemberChange,
  devLoginKey,
}: MembersTableProps) {
  const { updateMemberRole, removeMember } = useUserManagement(token, orgId, devLoginKey);
  const [loadingActions, setLoadingActions] = useState<Record<string, boolean>>({});

  const handleRoleChange = async (userId: string, newRole: MemberRole) => {
    setLoadingActions((prev) => ({ ...prev, [userId]: true }));
    try {
      await updateMemberRole(userId, newRole);
      toast.success(`Role updated to ${newRole}`);
      onMemberChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update role');
    } finally {
      setLoadingActions((prev) => ({ ...prev, [userId]: false }));
    }
  };

  const handleRemove = async (userId: string, memberName: string) => {
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }

    setLoadingActions((prev) => ({ ...prev, [userId]: true }));
    try {
      await removeMember(userId);
      toast.success('Member removed');
      onMemberChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to remove member');
    } finally {
      setLoadingActions((prev) => ({ ...prev, [userId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-48" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--cream)]/60">
        No team members found.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--turquoise)]/20 bg-[var(--navy)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Member</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>LinkedIn</TableHead>
            <TableHead>Last Active</TableHead>
            {isAdmin && <TableHead className="w-[50px]" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {members.map((member) => {
            const RoleIcon = roleIcons[member.role];
            const isCurrentUser = member.userId === currentUserId;
            const isActionLoading = loadingActions[member.userId];

            return (
              <TableRow key={member.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={member.avatarUrl || undefined} />
                      <AvatarFallback>
                        {member.displayName?.charAt(0) || member.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-[var(--cream)]">
                        {member.displayName || 'Unnamed'}
                        {isCurrentUser && (
                          <span className="text-[var(--cream)]/50 ml-2">(you)</span>
                        )}
                      </div>
                      <div className="text-sm text-[var(--cream)]/60">{member.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={roleBadgeStyles[member.role]}
                  >
                    <RoleIcon className="mr-1 h-3 w-3" />
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {member.hasLinkedInConnection ? (
                    <Badge variant="outline" className="text-[#0A66C2] border-[#0A66C2]/30 bg-[#0A66C2]/10">
                      <Linkedin className="mr-1 h-3 w-3" />
                      Connected
                    </Badge>
                  ) : (
                    <span className="text-[var(--cream)]/50 text-sm">Not connected</span>
                  )}
                </TableCell>
                <TableCell className="text-[var(--cream)]/60 text-sm">
                  {member.lastActiveAt ? formatDate(member.lastActiveAt) : 'Never'}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          disabled={isCurrentUser || isActionLoading}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleRoleChange(member.userId, 'admin')}>
                          <Shield className="mr-2 h-4 w-4" />
                          Make Admin
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(member.userId, 'editor')}>
                          <Edit className="mr-2 h-4 w-4" />
                          Make Editor
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleRoleChange(member.userId, 'viewer')}>
                          <Eye className="mr-2 h-4 w-4" />
                          Make Viewer
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-400 focus:text-red-400"
                          onClick={() => handleRemove(member.userId, member.displayName || member.email)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
