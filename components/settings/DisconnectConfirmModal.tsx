'use client';

import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Loader2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DisconnectConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => Promise<void>;
  integrationName: string;
  isDisconnecting: boolean;
}

export function DisconnectConfirmModal({
  open,
  onOpenChange,
  onConfirm,
  integrationName,
  isDisconnecting,
}: DisconnectConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  const handleClose = () => {
    if (!isDisconnecting) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl",
            "w-full max-w-md p-6",
            "focus:outline-none"
          )}
        >
          <div className="flex items-start justify-between mb-4">
            <Dialog.Title className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
              <AlertTriangle className="size-5 text-amber-500" />
              Disconnect {integrationName}?
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
                disabled={isDisconnecting}
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="text-sm text-[var(--cream)]/70 mb-6">
            Are you sure you want to disconnect {integrationName}?
          </Dialog.Description>

          <div className="space-y-4">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-md p-4">
              <p className="text-sm text-amber-200 mb-3">This will:</p>
              <ul className="text-sm text-amber-200/80 space-y-1.5">
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Remove your stored API token
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Stop all sync operations
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  Disable enrichment writeback
                </li>
              </ul>
              <p className="text-sm text-amber-200/70 mt-3">
                Your {integrationName} data will not be affected.
              </p>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={handleClose}
                disabled={isDisconnecting}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={isDisconnecting}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              >
                {isDisconnecting ? (
                  <>
                    <Loader2 className="animate-spin size-4 mr-2" />
                    Disconnecting...
                  </>
                ) : (
                  'Disconnect'
                )}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
