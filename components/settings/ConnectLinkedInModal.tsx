'use client';

import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Linkedin, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';

type ConnectionState = 'idle' | 'initializing' | 'waiting' | 'verifying' | 'connected' | 'error';

interface InitializeResponse {
  sessionId: string;
  sessionUrl: string;
  status: string;
  message?: string;
}

interface VerifyResponse {
  success: boolean;
  status: string;
  message?: string;
}

interface ConnectLinkedInModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  token?: string;
  orgId?: string;
}

export function ConnectLinkedInModal({
  open,
  onOpenChange,
  onSuccess,
  token,
  orgId,
}: ConnectLinkedInModalProps) {
  const [state, setState] = useState<ConnectionState>('idle');
  const [sessionUrl, setSessionUrl] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const handleInitialize = async () => {
    setState('initializing');
    setErrorMessage('');

    try {
      const result = await api.post<InitializeResponse>('/v1/linkedin-connection/initialize');

      if (!result.success || !result.data) {
        throw new Error(result.error?.message || 'Failed to initialize connection');
      }

      setSessionId(result.data.sessionId);
      setSessionUrl(result.data.sessionUrl);
      setState('waiting');

      // Open Browserbase Live View in new window
      window.open(result.data.sessionUrl, '_blank', 'noopener,noreferrer');
    } catch (error) {
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleVerify = async () => {
    setState('verifying');
    setErrorMessage('');

    try {
      const result = await api.post<VerifyResponse>('/v1/linkedin-connection/verify', { sessionId });

      if (!result.success || !result.data?.success) {
        throw new Error(result.error?.message || result.data?.message || 'Failed to verify connection');
      }

      setState('connected');
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        resetModal();
      }, 1500);
    } catch (error) {
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'Verification failed');
    }
  };

  const resetModal = () => {
    setState('idle');
    setSessionUrl('');
    setSessionId('');
    setErrorMessage('');
  };

  const handleClose = () => {
    if (state !== 'verifying' && state !== 'initializing') {
      onOpenChange(false);
      resetModal();
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
          <Dialog.Title className="text-xl font-semibold text-[var(--cream)] mb-2 flex items-center gap-2">
            <Linkedin className="size-6 text-[var(--turquoise)]" />
            Connect LinkedIn Account
          </Dialog.Title>

          <Dialog.Description className="text-sm text-[var(--cream)]/70 mb-6">
            {state === 'idle' && 'Connect your LinkedIn account to enable profile data enrichment for your contacts.'}
            {state === 'initializing' && 'Initializing secure browser session...'}
            {state === 'waiting' && 'Please log in to LinkedIn in the new window, then click "I\'m Done" below.'}
            {state === 'verifying' && 'Verifying your LinkedIn connection...'}
            {state === 'connected' && 'Successfully connected your LinkedIn account!'}
            {state === 'error' && 'An error occurred while connecting your account.'}
          </Dialog.Description>

          <div className="space-y-4">
            {state === 'waiting' && sessionUrl && (
              <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20 rounded-md p-4">
                <p className="text-sm text-[var(--cream)]/70 mb-3">
                  A new window has been opened. Please log in to LinkedIn.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(sessionUrl, '_blank', 'noopener,noreferrer')}
                  className="w-full"
                >
                  <ExternalLink className="size-4 mr-2" />
                  Reopen Login Window
                </Button>
              </div>
            )}

            {state === 'error' && errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </div>
            )}

            {state === 'connected' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 flex items-center gap-3">
                <CheckCircle2 className="size-5 text-green-500" />
                <p className="text-sm text-green-500">Connection verified successfully!</p>
              </div>
            )}

            <div className="flex gap-3">
              {state === 'idle' && (
                <>
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleInitialize} className="flex-1">
                    <Linkedin className="size-4 mr-2" />
                    Start Connection
                  </Button>
                </>
              )}

              {state === 'initializing' && (
                <Button disabled className="w-full">
                  <Loader2 className="animate-spin size-4 mr-2" />
                  Initializing...
                </Button>
              )}

              {state === 'waiting' && (
                <>
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleVerify} className="flex-1">
                    I&apos;m Done
                  </Button>
                </>
              )}

              {state === 'verifying' && (
                <Button disabled className="w-full">
                  <Loader2 className="animate-spin size-4 mr-2" />
                  Verifying...
                </Button>
              )}

              {state === 'error' && (
                <>
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleInitialize} className="flex-1">
                    Try Again
                  </Button>
                </>
              )}

              {state === 'connected' && (
                <Button disabled className="w-full">
                  <CheckCircle2 className="size-4 mr-2" />
                  Connected
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
