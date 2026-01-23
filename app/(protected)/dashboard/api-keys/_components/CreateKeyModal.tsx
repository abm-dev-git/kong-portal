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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { KeyRevealModal } from './KeyRevealModal';
import type { CreateApiKeyResponse } from '@/lib/api-keys';

interface CreateKeyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKeyCreated: () => void;
}

type Step = 'form' | 'reveal';

export function CreateKeyModal({ open, onOpenChange, onKeyCreated }: CreateKeyModalProps) {
  const [step, setStep] = useState<Step>('form');
  const [keyName, setKeyName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<CreateApiKeyResponse | null>(null);

  const resetForm = () => {
    setStep('form');
    setKeyName('');
    setError(null);
    setCreatedKey(null);
  };

  const handleClose = () => {
    resetForm();
    onOpenChange(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!keyName.trim()) {
      setError('Please enter a name for your API key');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: keyName.trim() }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create API key');
      }

      const data: CreateApiKeyResponse = await response.json();
      setCreatedKey(data);
      setStep('reveal');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create API key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyRevealClose = () => {
    onKeyCreated();
    handleClose();
  };

  if (step === 'reveal' && createdKey) {
    return (
      <KeyRevealModal
        apiKey={createdKey.key}
        keyName={createdKey.name}
        open={true}
        onClose={handleKeyRevealClose}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create API Key</DialogTitle>
          <DialogDescription>
            Give your API key a name to help you identify it later.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production Key, Development Key"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
                maxLength={50}
                autoFocus
              />
              <p className="text-xs text-[var(--cream)]/50">
                {keyName.length}/50 characters
              </p>
              {!keyName && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {['Development Key', 'Production Key', 'Testing Key'].map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setKeyName(suggestion)}
                      className="px-3 py-1 text-xs rounded-full bg-[var(--turquoise)]/10 text-[var(--turquoise)] border border-[var(--turquoise)]/20 hover:bg-[var(--turquoise)]/20"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <p className="text-sm text-[var(--error-red)]">{error}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading} loadingText="Creating...">
              Create Key
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
