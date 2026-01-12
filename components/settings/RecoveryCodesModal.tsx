'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Loader2, Key, X, Copy, Check, Download, RefreshCw, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface RecoveryCodesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecoveryCodesModal({ open, onOpenChange }: RecoveryCodesModalProps) {
  const { user } = useUser();
  const [codes, setCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRegenerateConfirm, setShowRegenerateConfirm] = useState(false);

  // Load recovery codes when modal opens
  useEffect(() => {
    if (open && user) {
      loadRecoveryCodes();
    }

    if (!open) {
      setCodes([]);
      setShowRegenerateConfirm(false);
    }
  }, [open, user]);

  const loadRecoveryCodes = async () => {
    if (!user) return;

    setIsLoading(true);

    try {
      // Create new backup codes (this also returns them)
      // Note: In Clerk, you need to call createBackupCode to generate/view codes
      const result = await user.createBackupCode();
      setCodes(result.codes || []);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load recovery codes';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    if (!user) return;

    setIsRegenerating(true);

    try {
      const result = await user.createBackupCode();
      setCodes(result.codes || []);
      toast.success('Recovery codes regenerated');
      setShowRegenerateConfirm(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to regenerate codes';
      toast.error(message);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleCopyAll = async () => {
    try {
      const text = codes.join('\n');
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Recovery codes copied to clipboard');
    } catch {
      toast.error('Failed to copy codes');
    }
  };

  const handleDownload = () => {
    const text = [
      'ABM.dev Recovery Codes',
      '========================',
      '',
      'Keep these codes in a safe place. Each code can only be used once.',
      '',
      ...codes,
      '',
      `Generated: ${new Date().toISOString()}`,
    ].join('\n');

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'abm-dev-recovery-codes.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast.success('Recovery codes downloaded');
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
              <Key className="w-5 h-5 text-[var(--turquoise)]" />
              Recovery Codes
            </Dialog.Title>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 rounded-lg hover:bg-[var(--turquoise)]/10 text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Dialog.Description className="sr-only">
            View and manage your two-factor authentication recovery codes
          </Dialog.Description>

          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[var(--turquoise)] animate-spin mb-4" />
              <p className="text-[var(--cream)]/70">Loading recovery codes...</p>
            </div>
          )}

          {/* Codes Display */}
          {!isLoading && !showRegenerateConfirm && (
            <div className="space-y-4">
              {/* Warning */}
              <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-400">
                  Each code can only be used once. Store them securely and don&apos;t share them.
                </p>
              </div>

              {/* Codes Grid */}
              <div className="grid grid-cols-2 gap-2 p-4 bg-[var(--dark-blue)] border border-[var(--turquoise)]/10 rounded-lg">
                {codes.map((code, index) => (
                  <code
                    key={index}
                    className="px-3 py-2 bg-[var(--navy)] rounded text-sm font-mono text-[var(--cream)] text-center"
                  >
                    {code}
                  </code>
                ))}
                {codes.length === 0 && (
                  <p className="col-span-2 text-center text-[var(--cream)]/50 py-4">
                    No recovery codes available
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyAll}
                  disabled={codes.length === 0}
                  className="flex-1 border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 mr-2 text-emerald-400" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy All
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleDownload}
                  disabled={codes.length === 0}
                  className="flex-1 border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>

              {/* Regenerate Button */}
              <Button
                variant="outline"
                onClick={() => setShowRegenerateConfirm(true)}
                className="w-full border-amber-500/30 text-amber-400 hover:bg-amber-500/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Regenerate Codes
              </Button>

              <p className="text-xs text-[var(--cream)]/50 text-center">
                Regenerating will invalidate all existing codes.
              </p>
            </div>
          )}

          {/* Regenerate Confirmation */}
          {!isLoading && showRegenerateConfirm && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-400 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-red-400 mb-1">
                    Regenerate Recovery Codes?
                  </h3>
                  <p className="text-sm text-[var(--cream)]/70">
                    This will permanently invalidate your current recovery codes. Make sure to save your new codes after regenerating.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={() => setShowRegenerateConfirm(false)}
                  className="flex-1 border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRegenerate}
                  disabled={isRegenerating}
                  className="flex-1 bg-red-500 text-white hover:bg-red-600"
                >
                  {isRegenerating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Regenerating...
                    </>
                  ) : (
                    'Regenerate'
                  )}
                </Button>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
