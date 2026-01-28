'use client';

import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { UserPlus } from 'lucide-react';
import { useDevLoginAuth } from '@/lib/hooks/useDevLoginAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { MembersTable } from '@/components/settings/MembersTable';
import { InvitesTable } from '@/components/settings/InvitesTable';
import { InviteDialog } from '@/components/settings/InviteDialog';
import { useMembers } from '@/lib/hooks/useMembers';
import { useInvites } from '@/lib/hooks/useInvites';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';

export default function TeamSettingsPage() {
  const { token, devLoginKey, orgId, isReady } = useDevLoginAuth();
  const { organization } = useOrganization();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Use the effective org ID (from Clerk or DevLogin default)
  const effectiveOrgId = organization?.id || orgId;

  const { data: currentUser, isLoading: userLoading } = useCurrentUser(token || undefined, effectiveOrgId, devLoginKey || undefined);
  const { data: membersData, isLoading: membersLoading, refetch: refetchMembers } = useMembers(token || undefined, effectiveOrgId, undefined, devLoginKey || undefined);
  const { data: invitesData, isLoading: invitesLoading, refetch: refetchInvites } = useInvites(token || undefined, effectiveOrgId, 'pending', devLoginKey || undefined);

  const isAdmin = currentUser?.role?.toLowerCase() === 'admin';
  const isLoading = !isReady || userLoading;

  const handleInviteSuccess = () => {
    refetchInvites();
  };

  const handleMemberChange = () => {
    refetchMembers();
  };

  const handleInviteChange = () => {
    refetchInvites();
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Members
          </h1>
          <p className="text-[var(--cream)]/70">
            Manage organization members and invitations
          </p>
        </div>
        <Button
          onClick={() => setInviteDialogOpen(true)}
          disabled={!isAdmin}
          title={!isAdmin ? 'Only admins can invite members' : undefined}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Member
        </Button>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">
            Members {membersData?.totalCount !== undefined && `(${membersData.totalCount})`}
          </TabsTrigger>
          <TabsTrigger value="invites">
            Pending Invites {invitesData?.totalCount !== undefined && `(${invitesData.totalCount})`}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <MembersTable
            members={membersData?.members || []}
            currentUserId={currentUser?.userId}
            isAdmin={isAdmin}
            isLoading={membersLoading}
            token={token || undefined}
            orgId={effectiveOrgId}
            onMemberChange={handleMemberChange}
            devLoginKey={devLoginKey || undefined}
          />
        </TabsContent>

        <TabsContent value="invites">
          <InvitesTable
            invites={invitesData?.invites || []}
            isAdmin={isAdmin}
            isLoading={invitesLoading}
            token={token || undefined}
            orgId={effectiveOrgId}
            onInviteChange={handleInviteChange}
            devLoginKey={devLoginKey || undefined}
          />
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        token={token || undefined}
        orgId={effectiveOrgId}
        onSuccess={handleInviteSuccess}
        devLoginKey={devLoginKey || undefined}
      />
    </div>
  );
}
