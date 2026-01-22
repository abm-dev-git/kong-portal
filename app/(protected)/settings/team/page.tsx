'use client';

import { useState, useEffect } from 'react';
import { useAuth, useOrganization } from '@clerk/nextjs';
import { UserPlus } from 'lucide-react';
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
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const [token, setToken] = useState<string>();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  // Get auth token
  useEffect(() => {
    let mounted = true;
    getToken().then((t) => {
      if (mounted && t) setToken(t);
    });
    return () => { mounted = false; };
  }, [getToken]);

  const { data: currentUser, isLoading: userLoading } = useCurrentUser(token, organization?.id);
  const { data: membersData, isLoading: membersLoading, refetch: refetchMembers } = useMembers(token, organization?.id);
  const { data: invitesData, isLoading: invitesLoading, refetch: refetchInvites } = useInvites(token, organization?.id, 'pending');

  const isAdmin = currentUser?.role === 'admin';
  const isLoading = userLoading || !token;

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
            token={token}
            orgId={organization?.id}
            onMemberChange={handleMemberChange}
          />
        </TabsContent>

        <TabsContent value="invites">
          <InvitesTable
            invites={invitesData?.invites || []}
            isAdmin={isAdmin}
            isLoading={invitesLoading}
            token={token}
            orgId={organization?.id}
            onInviteChange={handleInviteChange}
          />
        </TabsContent>
      </Tabs>

      {/* Invite Dialog */}
      <InviteDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        token={token}
        orgId={organization?.id}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
}
