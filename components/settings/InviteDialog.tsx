'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { useUserManagement } from '@/lib/hooks/useUserManagement';
import type { MemberRole, CreateInviteRequest } from '@/lib/types/user-management';

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  token?: string;
  orgId?: string;
  onSuccess?: () => void;
}

const roleDescriptions: Record<MemberRole, string> = {
  viewer: 'Can view data and dashboards',
  editor: 'Can run enrichments and manage content',
  admin: 'Full access including team management',
};

export function InviteDialog({
  open,
  onOpenChange,
  token,
  orgId,
  onSuccess,
}: InviteDialogProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<MemberRole>('viewer');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { createInvite } = useUserManagement(token, orgId);

  const resetForm = () => {
    setEmail('');
    setRole('viewer');
    setMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error('Please enter an email address');
      return;
    }

    setIsSubmitting(true);
    try {
      const invite: CreateInviteRequest = {
        email: email.trim(),
        role,
        message: message.trim() || undefined,
      };

      await createInvite(invite);
      toast.success(`Invitation sent to ${email}`);
      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: unknown) {
      const err = error as Error & { code?: string };
      if (err.code === 'INVITE_EXISTS') {
        toast.error('A pending invite already exists for this email');
      } else if (err.code === 'MEMBER_EXISTS') {
        toast.error('This user is already a team member');
      } else {
        toast.error(err.message || 'Failed to send invitation');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-[var(--navy)] border-[var(--turquoise)]/20">
        <DialogHeader>
          <DialogTitle className="text-[var(--cream)]">Invite Team Member</DialogTitle>
          <DialogDescription className="text-[var(--cream)]/60">
            Send an invitation to join your organization. The invite expires in 7 days.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[var(--cream)]">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)]"
              />
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-[var(--cream)]">
                Role
              </Label>
              <Select value={role} onValueChange={(v) => setRole(v as MemberRole)}>
                <SelectTrigger className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="viewer">
                    <div className="flex flex-col items-start">
                      <span>Viewer</span>
                      <span className="text-xs text-[var(--cream)]/50">
                        {roleDescriptions.viewer}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="editor">
                    <div className="flex flex-col items-start">
                      <span>Editor</span>
                      <span className="text-xs text-[var(--cream)]/50">
                        {roleDescriptions.editor}
                      </span>
                    </div>
                  </SelectItem>
                  <SelectItem value="admin">
                    <div className="flex flex-col items-start">
                      <span>Admin</span>
                      <span className="text-xs text-[var(--cream)]/50">
                        {roleDescriptions.admin}
                      </span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-[var(--cream)]">
                Personal Message (optional)
              </Label>
              <Textarea
                id="message"
                placeholder="Hey! Join our team on ABM.dev..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={500}
                className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)]"
              />
              <p className="text-xs text-[var(--cream)]/50">
                {message.length}/500 characters
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[var(--turquoise)]/20"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Send Invite
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
