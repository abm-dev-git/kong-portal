'use client';

import { useState } from 'react';
import { useOrganization } from '@clerk/nextjs';
import { Plus, Building2, Users, MoreVertical, Pencil, Archive, Star } from 'lucide-react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { useWorkspaces, useWorkspaceMutations } from '@/lib/hooks/useWorkspaces';
import { useCurrentUser } from '@/lib/hooks/useCurrentUser';
import type { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest } from '@/lib/types/workspaces';

export default function WorkspacesSettingsPage() {
  const { token, devLoginKey, orgId, isReady } = useDevLoginAuth();
  const { organization } = useOrganization();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);

  // Form state
  const [formName, setFormName] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formIsDefault, setFormIsDefault] = useState(false);

  // Use the effective org ID (from Clerk or DevLogin default)
  const effectiveOrgId = organization?.id || orgId;

  const { data: currentUser, isLoading: userLoading } = useCurrentUser(token || undefined, effectiveOrgId, devLoginKey || undefined);
  const { data: workspacesData, isLoading: workspacesLoading, refetch } = useWorkspaces(token || undefined, effectiveOrgId, devLoginKey || undefined);
  const { createWorkspace, updateWorkspace, archiveWorkspace, isLoading: mutationLoading } = useWorkspaceMutations(token || undefined, effectiveOrgId, devLoginKey || undefined);

  const isAdmin = currentUser?.role === 'admin';
  const isLoading = !isReady || userLoading;

  const handleCreateWorkspace = async () => {
    if (!formName.trim()) {
      toast({ title: 'Error', description: 'Workspace name is required', variant: 'destructive' });
      return;
    }

    const request: CreateWorkspaceRequest = {
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      isDefault: formIsDefault,
    };

    const result = await createWorkspace(request);
    if (result) {
      toast({ title: 'Success', description: `Workspace "${result.name}" created` });
      setCreateDialogOpen(false);
      resetForm();
      refetch();
    } else {
      toast({ title: 'Error', description: 'Failed to create workspace', variant: 'destructive' });
    }
  };

  const handleUpdateWorkspace = async () => {
    if (!selectedWorkspace || !formName.trim()) return;

    const request: UpdateWorkspaceRequest = {
      name: formName.trim(),
      description: formDescription.trim() || undefined,
      isDefault: formIsDefault,
    };

    const result = await updateWorkspace(selectedWorkspace.id, request);
    if (result) {
      toast({ title: 'Success', description: `Workspace "${result.name}" updated` });
      setEditDialogOpen(false);
      setSelectedWorkspace(null);
      resetForm();
      refetch();
    } else {
      toast({ title: 'Error', description: 'Failed to update workspace', variant: 'destructive' });
    }
  };

  const handleArchiveWorkspace = async () => {
    if (!selectedWorkspace) return;

    const success = await archiveWorkspace(selectedWorkspace.id);
    if (success) {
      toast({ title: 'Success', description: `Workspace "${selectedWorkspace.name}" archived` });
      setArchiveDialogOpen(false);
      setSelectedWorkspace(null);
      refetch();
    } else {
      toast({ title: 'Error', description: 'Failed to archive workspace', variant: 'destructive' });
    }
  };

  const openEditDialog = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setFormName(workspace.name);
    setFormDescription(workspace.description || '');
    setFormIsDefault(workspace.isDefault);
    setEditDialogOpen(true);
  };

  const openArchiveDialog = (workspace: Workspace) => {
    setSelectedWorkspace(workspace);
    setArchiveDialogOpen(true);
  };

  const resetForm = () => {
    setFormName('');
    setFormDescription('');
    setFormIsDefault(false);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="space-y-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-72" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
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
            Workspaces
          </h1>
          <p className="text-[var(--cream)]/70">
            Organize your teams and resources into workspaces
          </p>
        </div>
        {isAdmin && (
          <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }}>
            <Plus className="mr-2 h-4 w-4" />
            New Workspace
          </Button>
        )}
      </div>

      {/* Workspace Grid */}
      {workspacesLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      ) : workspacesData?.workspaces.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Building2 className="h-12 w-12 text-[var(--cream)]/40 mb-4" />
            <h3 className="text-lg font-medium text-[var(--cream)] mb-2">No workspaces yet</h3>
            <p className="text-sm text-[var(--cream)]/60 text-center max-w-sm mb-4">
              Create your first workspace to organize your teams and resources.
            </p>
            {isAdmin && (
              <Button onClick={() => { resetForm(); setCreateDialogOpen(true); }} variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Workspace
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workspacesData?.workspaces.map((workspace) => (
            <Card key={workspace.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-[var(--turquoise)]" />
                    <CardTitle className="text-lg">{workspace.name}</CardTitle>
                    {workspace.isDefault && (
                      <Badge variant="secondary" className="ml-2">
                        <Star className="h-3 w-3 mr-1" />
                        Default
                      </Badge>
                    )}
                  </div>
                  {isAdmin && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => openEditDialog(workspace)}>
                          <Pencil className="h-4 w-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        {!workspace.isDefault && (
                          <>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => openArchiveDialog(workspace)}
                              className="text-red-500 focus:text-red-500"
                            >
                              <Archive className="h-4 w-4 mr-2" />
                              Archive
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                {workspace.description && (
                  <CardDescription className="mt-2">{workspace.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-[var(--cream)]/60">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>Members</span>
                  </div>
                  <span className="text-[var(--cream)]/40">
                    Created {new Date(workspace.createdAt).toLocaleDateString()}
                  </span>
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
            <DialogTitle>Create Workspace</DialogTitle>
            <DialogDescription>
              Create a new workspace to organize your teams and resources.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Marketing, Engineering"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea
                id="description"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description of this workspace"
                rows={3}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="isDefault"
                checked={formIsDefault}
                onCheckedChange={setFormIsDefault}
              />
              <Label htmlFor="isDefault">Set as default workspace</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWorkspace} disabled={mutationLoading}>
              {mutationLoading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Workspace</DialogTitle>
            <DialogDescription>
              Update workspace details.
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
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-isDefault"
                checked={formIsDefault}
                onCheckedChange={setFormIsDefault}
              />
              <Label htmlFor="edit-isDefault">Set as default workspace</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateWorkspace} disabled={mutationLoading}>
              {mutationLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Archive Confirmation Dialog */}
      <Dialog open={archiveDialogOpen} onOpenChange={setArchiveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive Workspace</DialogTitle>
            <DialogDescription>
              Are you sure you want to archive &ldquo;{selectedWorkspace?.name}&rdquo;? This action can be undone by an administrator.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setArchiveDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleArchiveWorkspace} disabled={mutationLoading}>
              {mutationLoading ? 'Archiving...' : 'Archive Workspace'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
