'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import type { ApiKey } from '@/lib/api-keys';

interface RevokeKeyDialogProps {
  apiKey: ApiKey | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRevoked: () => void;
}

export function RevokeKeyDialog({
  apiKey,
  open,
  onOpenChange,
  onRevoked,
}: RevokeKeyDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRevoke = async () => {
    if (!apiKey) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/api-keys/${apiKey.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to revoke API key');
      }

      onRevoked();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to revoke API key');
    } finally {
      setIsLoading(false);
    }
  };

  if (!apiKey) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[var(--error-red)]">
            <AlertTriangle className="w-5 h-5" />
            Revoke API Key
          </DialogTitle>
          <DialogDescription>
            Are you sure you want to revoke this API key? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="p-4 bg-[var(--error-red)]/10 rounded-lg border border-[var(--error-red)]/30">
            <div className="space-y-2">
              <p className="text-sm text-[var(--cream)]">
                <span className="font-medium">Key Name:</span> {apiKey.name}
              </p>
              <p className="text-sm text-[var(--cream)]">
                <span className="font-medium">Key Prefix:</span>{' '}
                <code className="px-1 py-0.5 bg-[var(--navy)] rounded text-xs font-mono">
                  {apiKey.keyPrefix}...
                </code>
              </p>
            </div>
          </div>

          <p className="mt-4 text-sm text-[var(--cream)]/70">
            Any applications using this key will immediately lose access to the API.
          </p>

          {error && (
            <p className="mt-4 text-sm text-[var(--error-red)]">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleRevoke}
            isLoading={isLoading}
            loadingText="Revoking..."
          >
            Revoke Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
