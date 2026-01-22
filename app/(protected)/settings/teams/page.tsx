'use client';

import { useState, useEffect } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { Plus, UsersRound, Users, MoreVertical, Pencil, Archive, UserPlus } from 'lucide-react';
import { useDevLoginAuth } from '@/lib/hooks/useDevLoginAuth';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useTeams, useMyTeams, useTeamMutations, useTeamMembers } from '@/lib/hooks/useTeams';
import { useWorkspaces, useDefaultWorkspace } from '@/lib/hooks/useWorkspaces';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import { useMembers } from '@/lib/hooks/useMembers';
import { TEAM_COLOR_PRESETS, TEAM_ROLE_LABELS, type Team, type CreateTeamRequest, type UpdateTeamRequest, type TeamMemberRole } from '@/lib/types/teams';

export default function TeamsSettingsPage() {
  const { token, devLoginKey, orgId, isReady } = useDevLoginAuth();
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [addMemberDialogOpen, setAddMemberDialogOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'my'>('all');

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formColor, setFormColor] = useState(TEAM_COLOR_PRESETS[0]);
  const [formWorkspaceId, setFormWorkspaceId] = useState<string>('');

  // Add member form state
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<TeamMemberRole>('member');

  // Use the effective org ID (from Clerk or DevLogin default)
  const effectiveOrgId = organization?.id || orgId;

  const { data: currentUser, isLoading: userLoading } = useCurrentUser(token || undefined, effectiveOrgId, devLoginKey || undefined);
  const { data: allTeamsData, isLoading: allTeamsLoading, refetch: refetchAllTeams } = useTeams(token || undefined, effectiveOrgId, undefined, devLoginKey || undefined);
  const { data: myTeamsData, isLoading: myTeamsLoading, refetch: refetchMyTeams } = useMyTeams(token || undefined, effectiveOrgId, undefined, devLoginKey || undefined);
  const { data: workspacesData } = useWorkspaces(token || undefined, effectiveOrgId, devLoginKey || undefined);
  const { data: defaultWorkspace } = useDefaultWorkspace(token || undefined, effectiveOrgId, devLoginKey || undefined);
  const { data: membersData } = useMembers(token || undefined, effectiveOrgId, undefined, devLoginKey || undefined);
  const { data: teamMembersData, refetch: refetchTeamMembers } = useTeamMembers(selectedTeam?.id, token || undefined, effectiveOrgId, devLoginKey || undefined);
  const { createTeam, updateTeam, archiveTeam, addMember, isLoading: mutationLoading } = useTeamMutations(token || undefined, effectiveOrgId, devLoginKey || undefined);

  const isAdmin = currentUser?.role === 'admin';
  // Show loading until auth is ready and user data is loaded
  const isLoading = !isReady || userLoading;

  // Set default workspace when loaded
  useEffect(() => {
    if (defaultWorkspace && !formWorkspaceId) {
      setFormWorkspaceId(defaultWorkspace.id);
    }
  }, [defaultWorkspace, formWorkspaceId]);

  const teamsData = viewMode === 'all' ? allTeamsData : myTeamsData;
  const teamsLoading = viewMode === 'all' ? allTeamsLoading : myTeamsLoading;

  const refetch = () => {
    refetchAllTeams();
    refetchMyTeams();
  };

  const handleCreateTeam = async () => {
    if (!formName.trim()) {
      toast({ title: 'Error', description: 'Team name is required', variant: 'destructive' });
      return;
    }
    if (!formWorkspaceId) {
      toast({ title: 'Error', description: 'Please select a workspace', variant: 'destructive' });
      return;
    }

    const request: CreateTeamRequest = {
      workspaceId: formWorkspaceId,
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      color: formColor,
    };

    const result = await createTeam(request);
    if (result) {
      toast({ title: 'Success', description: `Team "${result.name}" created` });
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } else {
      toast({ title: 'Error', description: 'Failed to create team', variant: 'destructive' });
    }
  };

  const handleUpdateTeam = async () => {
    if (!selectedTeam || !formName.trim()) return;

    const request: UpdateTeamRequest = {
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      color: formColor,
    };

    const result = await updateTeam(selectedTeam.id, request);
    if (result) {
      toast({ title: 'Success', description: `Team "${result.name}" updated` });
      setEditDialogOpen(false);
      setSelectedTeam(null);
      resetForm();
      refetch();
    } else {
      toast({ title: 'Error', description: 'Failed to update team', variant: 'destructive' });
    }
  };

  const handleArchiveTeam = async () => {
    if (!selectedTeam) return;

    const success = await archiveTeam(selectedTeam.id);
    if (success) {
      toast({ title: 'Success', description: `Team "${selectedTeam.name}" archived` });
      setArchiveDialogOpen(false);
      setSelectedTeam(null);
      refetch();
    } else {
      toast({ title: 'Error', description: 'Failed to archive team', variant: 'destructive' });
    }
  };

  const openEditDialog = (team: Team) => {
    setSelectedTeam(team);
    setFormName(team.name);
    setFormDescription(team.description || '');
    setFormColor(team.color || TEAM_COLOR_PRESETS[0]);
    setEditDialogOpen(true);
  };

  const openArchiveDialog = (team: Team) => {
    setSelectedTeam(team);
    setArchiveDialogOpen(true);
  };

  const openAddMemberDialog = (team: Team) => {
    setSelectedTeam(team);
    setSelectedUserId('');
    setSelectedRole('member');
    setAddMemberDialogOpen(true);
  };

  const handleAddMember = async () => {
    if (!selectedTeam || !selectedUserId) {
      toast({ title: 'Error', description: 'Please select a member', variant: 'destructive' });
      return;
    }

    const result = await addMember(selectedTeam.id, {
      userId: selectedUserId,
      role: selectedRole,
    });

    if (result) {
      const memberName = membersData?.members.find(m => m.userId === selectedUserId)?.displayName || 'Member';
      toast({ title: 'Success', description: `${memberName} added to ${selectedTeam.name}` });
      setAddMemberDialogOpen(false);
      setSelectedTeam(null);
      refetchTeamMembers();
    } else {
      toast({ title: 'Error', description: 'Failed to add member. They may already be in this team.', variant: 'destructive' });
    }
  };

  // Get members not already in the selected team
  const availableMembers = membersData?.members.filter(
    member => !teamMembersData?.members.some(tm => tm.userId === member.userId)
  ) || [];

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormColor(TEAM_COLOR_PRESETS[0]);
    if (defaultWorkspace) {
      setFormWorkspaceId(defaultWorkspace.id);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
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
            Teams
          </h1>
          <p className="text-[var(--cream)]/70">
            Manage functional teams within your workspaces
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-lg border border-[var(--cream)]/20 p-1">
            <Button
              variant={viewMode === 'all' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('all')}
            >
              All Teams
            </Button>
            <Button
              variant={viewMode === 'my' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('my')}
            >
              My Teams
            </Button>
          </div>
          {isAdmin && (
            <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
              <Plus className="mr-2 h-4 w-4" />
              New Team
            </Button>
          )}
        </div>
      </div>

      {/* Teams Grid */}
      {teamsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      ) : teamsData?.teams.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersRound className="h-12 w-12 text-[var(--cream)]/40 mb-4" />
            <h3 className="text-lg font-medium text-[var(--cream)] mb-2">
              {viewMode === 'all' ? 'No teams yet' : 'You\'re not in any teams'}
            </h3>
            <p className="text-sm text-[var(--cream)]/60 text-center max-w-sm mb-4">
              {viewMode === 'all'
                ? 'Create your first team to organize your members by function.'
                : 'Ask an administrator to add you to a team.'}
            </p>
            {isAdmin && viewMode === 'all' && (
              <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Team
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teamsData?.teams.map((team) => (
            <Card key={team.id} className="relative overflow-hidden">
              {/* Color strip at top */}
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: team.color || TEAM_COLOR_PRESETS[0] }}
              />
              <CardHeader className="pt-4 pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-8 w-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${team.color || TEAM_COLOR_PRESETS[0]}20` }}
                    >
                      <UsersRound
                        className="h-4 w-4"
                        style={{ color: team.color || TEAM_COLOR_PRESETS[0] }}
                      />
                    </div>
                    <CardTitle className="text-lg">{team.name}</CardTitle>
                  </div>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(team)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openAddMemberDialog(team)}>
                          <UserPlus className="h-4 w-4 mr-2" />
                          Add Member
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => openArchiveDialog(team)}
                          className="text-red-500 focus:text-red-500"
                        >
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {team.description && (
                  <CardDescription className="mt-2 line-clamp-2">{team.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-[var(--cream)]/60">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </div>
                  {team.slug && (
                    <Badge variant="outline" className="text-xs">
                      {team.slug}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              Create a new team within a workspace.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="workspace">Workspace</Label>
              <Select value={formWorkspaceId} onValueChange={setFormWorkspaceId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a workspace" />
                </SelectTrigger>
                <SelectContent>
                  {workspacesData?.workspaces.map((ws) => (
                    <SelectItem key={ws.id} value={ws.id}>
                      {ws.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Sales, Engineering, Marketing"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of this team"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Team Color</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-lg transition-all ${
                      formColor === color ? 'ring-2 ring-offset-2 ring-[var(--turquoise)]' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateTeam} disabled={mutationLoading}>
              {mutationLoading ? 'Creating...' : 'Create Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update team details.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description (optional)</Label>
              <Textarea
                id="edit-description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Team Color</Label>
              <div className="flex flex-wrap gap-2">
                {TEAM_COLOR_PRESETS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className={`h-8 w-8 rounded-lg transition-all ${
                      formColor === color ? 'ring-2 ring-offset-2 ring-[var(--turquoise)]' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateTeam} disabled={mutationLoading}>
              {mutationLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Team</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive &ldquo;{selectedTeam?.name}&rdquo;? Team members will no longer have access.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchiveTeam} disabled={mutationLoading}>
              {mutationLoading ? 'Archiving...' : 'Archive Team'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Member Dialog */}
      <Dialog open={addMemberDialogOpen} onOpenChange={setAddMemberDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Member to {selectedTeam?.name}</DialogTitle>
            <DialogDescription>
              Select an organization member to add to this team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="member">Member</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a member" />
                </SelectTrigger>
                <SelectContent>
                  {availableMembers.length === 0 ? (
                    <div className="px-2 py-4 text-sm text-[var(--cream)]/60 text-center">
                      All organization members are already in this team
                    </div>
                  ) : (
                    availableMembers.map((member) => (
                      <SelectItem key={member.userId} value={member.userId}>
                        <div className="flex items-center gap-2">
                          <span>{member.displayName || member.email}</span>
                          {member.displayName && (
                            <span className="text-[var(--cream)]/50 text-sm">({member.email})</span>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={selectedRole} onValueChange={(v) => setSelectedRole(v as TeamMemberRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(TEAM_ROLE_LABELS) as TeamMemberRole[]).map((role) => (
                    <SelectItem key={role} value={role}>
                      {TEAM_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddMemberDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddMember} disabled={mutationLoading || !selectedUserId}>
              {mutationLoading ? 'Adding...' : 'Add Member'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
