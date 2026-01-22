'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUserManagement } from '@/lib/hooks/useUserManagement';
import type { OrganizationInvite, InviteStatus, MemberRole } from '@/lib/types/user-management';
import { formatDate } from '@/lib/utils';

interface InvitesTableProps {
  invites: OrganizationInvite[];
  isAdmin: boolean;
  isLoading: boolean;
  token?: string;
  orgId?: string;
  onInviteChange?: () => void;
  devLoginKey?: string;
}

const statusBadgeStyles: Record<InviteStatus, string> = {
  pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  accepted: 'bg-green-500/20 text-green-400 border-green-500/30',
  expired: 'bg-red-500/20 text-red-400 border-red-500/30',
  revoked: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

const roleBadgeStyles: Record<MemberRole, string> = {
  admin: 'bg-red-500/20 text-red-400 border-red-500/30',
  editor: 'bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30',
  viewer: 'bg-[var(--cream)]/10 text-[var(--cream)]/70 border-[var(--cream)]/20',
};

export function InvitesTable({
  invites,
  isAdmin,
  isLoading,
  token,
  orgId,
  onInviteChange,
  devLoginKey,
}: InvitesTableProps) {
  const { revokeInvite } = useUserManagement(token, orgId, devLoginKey);
  const [loadingRevoke, setLoadingRevoke] = useState<Record<string, boolean>>({});

  const handleRevoke = async (inviteId: string, email: string) => {
    if (!confirm(`Are you sure you want to revoke the invitation for ${email}?`)) {
      return;
    }

    setLoadingRevoke((prev) => ({ ...prev, [inviteId]: true }));
    try {
      await revokeInvite(inviteId);
      toast.success('Invitation revoked');
      onInviteChange?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to revoke invitation');
    } finally {
      setLoadingRevoke((prev) => ({ ...prev, [inviteId]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-4 p-4">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (invites.length === 0) {
    return (
      <div className="text-center py-12 text-[var(--cream)]/60">
        No pending invitations.
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[var(--turquoise)]/20 bg-[var(--navy)]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Invited By</TableHead>
            <TableHead>Expires</TableHead>
            {isAdmin && <TableHead className="w-[100px]" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {invites.map((invite) => {
            const isExpired = new Date(invite.expiresAt) < new Date();
            const isRevoking = loadingRevoke[invite.id];

            return (
              <TableRow key={invite.id}>
                <TableCell className="font-medium text-[var(--cream)]">
                  {invite.email}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={roleBadgeStyles[invite.role]}>
                    {invite.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={statusBadgeStyles[isExpired ? 'expired' : invite.status]}
                  >
                    {isExpired ? 'expired' : invite.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-[var(--cream)]/60 text-sm">
                  {invite.invitedByName || 'Unknown'}
                </TableCell>
                <TableCell className="text-[var(--cream)]/60 text-sm">
                  {formatDate(invite.expiresAt)}
                </TableCell>
                {isAdmin && (
                  <TableCell>
                    {invite.status === 'pending' && !isExpired && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                        onClick={() => handleRevoke(invite.id, invite.email)}
                        disabled={isRevoking}
                      >
                        <XCircle className="mr-1 h-4 w-4" />
                        Revoke
                      </Button>
                    )}
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
