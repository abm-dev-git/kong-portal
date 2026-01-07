'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useClerk } from '@clerk/nextjs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface DeleteAccountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteAccountModal({ open, onOpenChange }: DeleteAccountModalProps) {
  const { user } = useClerk();
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    try {
      await user?.delete();
      toast.success('Account deleted successfully');
      // User will be redirected by Clerk
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete account');
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[var(--navy)] border-red-500/30">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-red-500/10">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <DialogTitle className="text-red-400">Delete Account</DialogTitle>
          </div>
          <DialogDescription className="text-[var(--cream)]/70">
            This action is permanent and cannot be undone. All your data, API keys, and integrations will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">
              <strong>Warning:</strong> This will immediately:
            </p>
            <ul className="mt-2 text-sm text-red-400/80 list-disc list-inside space-y-1">
              <li>Delete all your API keys</li>
              <li>Disconnect all integrations</li>
              <li>Remove all enrichment data</li>
              <li>Cancel your subscription</li>
            </ul>
          </div>

          <div>
            <label className="block text-sm text-[var(--cream)]/70 mb-2">
              Type <span className="font-mono text-red-400">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              className="w-full px-3 py-2 rounded-md bg-[var(--dark-blue)] border border-red-500/30 text-[var(--cream)] placeholder:text-[var(--cream)]/30 focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={confirmText !== 'DELETE' || isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white border-0"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
