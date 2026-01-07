'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Linkedin, Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';

type ConnectionState = 'initializing' | 'waiting' | 'verifying' | 'connected' | 'error';

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

// Browserbase Live URL format when API doesn't return it
const BROWSERBASE_LIVE_URL_BASE = 'https://www.browserbase.com/sessions';

export function ConnectLinkedInModal({
  open,
  onOpenChange,
  onSuccess,
  token,
  orgId,
}: ConnectLinkedInModalProps) {
  const [state, setState] = useState<ConnectionState | null>(null);
  const [sessionUrl, setSessionUrl] = useState<string>('');
  const [sessionId, setSessionId] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const hasInitialized = useRef(false);

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  // Auto-start initialization when modal opens, reset when it closes
  useEffect(() => {
    if (open && !hasInitialized.current) {
      hasInitialized.current = true;
      handleInitialize();
    }
    // Reset everything when modal closes
    if (!open && hasInitialized.current) {
      hasInitialized.current = false;
      setState(null);
      setSessionUrl('');
      setSessionId('');
      setErrorMessage('');
    }
  }, [open]);

  const handleInitialize = async () => {
    setState('initializing');
    setErrorMessage('');

    try {
      const result = await api.post<InitializeResponse>('/v1/linkedin-connection/initialize');

      if (!result.success || !result.data) {
        // Check for session conflict (409)
        const errorDetails = result.error?.details as { canRetryAfter?: number; sessionAge?: number } | undefined;
        if (errorDetails?.canRetryAfter !== undefined) {
          const retryMinutes = errorDetails.canRetryAfter;
          throw new Error(
            retryMinutes > 0
              ? `A session is already in progress. Please wait ${retryMinutes} minute(s) or complete the existing session.`
              : 'A session is already in progress. It will be automatically cleaned up shortly. Please try again.'
          );
        }
        throw new Error(result.error?.message || 'Failed to initialize connection');
      }

      setSessionId(result.data.sessionId);

      // Use API-provided URL or construct Browserbase Live URL from sessionId
      const liveUrl = result.data.sessionUrl || `${BROWSERBASE_LIVE_URL_BASE}/${result.data.sessionId}/live`;
      setSessionUrl(liveUrl);
      setState('waiting');

      // Open Browserbase Live View in new window
      window.open(liveUrl, '_blank', 'noopener,noreferrer');
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
    setState(null);
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
            {(state === null || state === 'initializing') && 'Initializing secure browser session...'}
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
              {(state === null || state === 'initializing') && (
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
