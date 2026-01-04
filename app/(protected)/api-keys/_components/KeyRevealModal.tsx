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
import { Copy, Check, AlertTriangle, Eye, EyeOff } from 'lucide-react';

interface KeyRevealModalProps {
  apiKey: string;
  keyName: string;
  open: boolean;
  onClose: () => void;
}

export function KeyRevealModal({ apiKey, keyName, open, onClose }: KeyRevealModalProps) {
  const [copied, setCopied] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const maskedKey = showKey ? apiKey : apiKey.replace(/./g, '*');

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[var(--warning-yellow)]" />
            Save Your API Key
          </DialogTitle>
          <DialogDescription>
            This is the only time you&apos;ll see this key. Make sure to copy and store it securely.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-[var(--cream)]/70">
              Key Name: <span className="text-[var(--cream)] font-medium">{keyName}</span>
            </p>
          </div>

          <div className="relative">
            <div className="flex items-center gap-2 p-4 bg-[var(--dark-blue)] rounded-lg border border-[var(--turquoise)]/20">
              <code className="flex-1 text-sm font-mono text-[var(--turquoise)] break-all">
                {maskedKey}
              </code>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowKey(!showKey)}
                title={showKey ? 'Hide key' : 'Show key'}
              >
                {showKey ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCopy}
                title="Copy to clipboard"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-[var(--success-green)]" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            {copied && (
              <p className="absolute -bottom-6 right-0 text-xs text-[var(--success-green)]">
                Copied to clipboard!
              </p>
            )}
          </div>

          <div className="p-4 bg-[var(--warning-yellow)]/10 rounded-lg border border-[var(--warning-yellow)]/30">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[var(--warning-yellow)] mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-[var(--warning-yellow)]">Important</p>
                <p className="text-[var(--cream)]/70 mt-1">
                  You won&apos;t be able to see this key again after closing this dialog.
                  Store it in a secure location like a password manager.
                </p>
              </div>
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={confirmed}
              onChange={(e) => setConfirmed(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--turquoise)]/30 bg-[var(--turquoise)]/5 text-[var(--turquoise)] focus:ring-[var(--turquoise)]/50"
            />
            <span className="text-sm text-[var(--cream)]">
              I have saved my API key in a secure location
            </span>
          </label>
        </div>

        <DialogFooter>
          <Button onClick={onClose} disabled={!confirmed}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
