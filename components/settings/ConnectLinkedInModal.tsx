'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Linkedin, Loader2, AlertCircle, CheckCircle2, X, ExternalLink, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';
import { usePollLinkedInLogin } from '@/lib/hooks/useLinkedInStatus';

type ConnectionState = 'initializing' | 'waiting' | 'detecting' | 'connected' | 'error';

interface InitializeResponse {
  sessionId: string;
  sessionUrl: string;
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
const BROWSERBASE_LIVE_URL_BASE = 'https://live.browserbase.io';

// Timeout for the polling (30 seconds)
const POLLING_TIMEOUT_MS = 60000;

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
  const [isTimedOut, setIsTimedOut] = useState(false);
  const hasInitialized = useRef(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  // Use automatic polling hook - only poll when we have a sessionId and are in waiting state
  const shouldPoll = state === 'waiting' && !!sessionId;
  const { data: pollData, isPolling, error: pollError, reset: resetPolling } = usePollLinkedInLogin(
    sessionId,
    token,
    orgId,
    shouldPoll
  );

  // Handle poll result changes
  useEffect(() => {
    if (!pollData) return;

    // Update state based on poll status
    if (pollData.status === 'connected' && pollData.isComplete) {
      setState('connected');
      clearTimeout(timeoutRef.current!);

      // Auto-close after showing success
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        resetModal();
      }, 1500);
    } else if (pollData.status === 'error') {
      setState('error');
      setErrorMessage(pollData.message || 'Failed to detect login');
      clearTimeout(timeoutRef.current!);
    }
  }, [pollData, onSuccess, onOpenChange]);

  // Handle poll errors
  useEffect(() => {
    if (pollError && state === 'waiting') {
      // Don't show error for network issues during polling - just keep trying
      console.error('Poll error:', pollError);
    }
  }, [pollError, state]);

  // Set up timeout when polling starts
  useEffect(() => {
    if (shouldPoll && !isTimedOut) {
      timeoutRef.current = setTimeout(() => {
        setIsTimedOut(true);
      }, POLLING_TIMEOUT_MS);

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }
  }, [shouldPoll, isTimedOut]);

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
      setIsTimedOut(false);
      resetPolling();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  }, [open, resetPolling]);

  const handleInitialize = async () => {
    setState('initializing');
    setErrorMessage('');
    setIsTimedOut(false);

    try {
      const result = await api.post<InitializeResponse>('/v1/linkedin-connection/initialize');

      if (!result.success || !result.data) {
        // Check for session conflict (409) or other errors
        const errorCode = result.error?.code || '';
        const errorDetails = result.error?.details as { canRetryAfter?: number; sessionAge?: number } | undefined;

        if (errorCode.includes('409') || errorCode === 'CONFLICT') {
          if (errorDetails?.canRetryAfter !== undefined) {
            const retryMinutes = errorDetails.canRetryAfter;
            throw new Error(
              retryMinutes > 0
                ? `A session is already in progress. Please wait ${retryMinutes} minute(s) or complete the existing session.`
                : 'A session is already in progress. It will be automatically cleaned up shortly. Please try again.'
            );
          }
          throw new Error('A LinkedIn session is already in progress. Please wait a moment and try again.');
        }
        throw new Error(result.error?.message || 'Failed to initialize connection');
      }

      setSessionId(result.data.sessionId);

      // Use API-provided URL or construct Browserbase Live URL from sessionId
      const liveUrl = result.data.sessionUrl || `${BROWSERBASE_LIVE_URL_BASE}/${result.data.sessionId}`;
      setSessionUrl(liveUrl);
      setState('waiting');
    } catch (error) {
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const resetModal = () => {
    setState(null);
    setSessionUrl('');
    setSessionId('');
    setErrorMessage('');
    setIsTimedOut(false);
    resetPolling();
  };

  const handleClose = () => {
    if (state !== 'initializing') {
      onOpenChange(false);
      resetModal();
    }
  };

  const handleRefresh = () => {
    setIsTimedOut(false);
    resetPolling();
    handleInitialize();
  };

  // Determine if we should show the expanded modal with iframe
  const showIframe = (state === 'waiting' || state === 'detecting') && sessionUrl;

  // Get the current status message to display
  const getStatusMessage = () => {
    if (state === 'initializing') return 'Starting secure browser session...';
    if (state === 'connected') return `Connected as ${pollData?.profileName || 'LinkedIn User'}`;
    if (state === 'error') return errorMessage;
    if (pollData?.message) return pollData.message;
    if (state === 'waiting') return 'Waiting for LinkedIn login...';
    return '';
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl",
            "focus:outline-none flex flex-col",
            showIframe
              ? "w-[95vw] max-w-5xl h-[90vh] p-4"
              : "w-full max-w-md p-6"
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4 shrink-0">
            <Dialog.Title className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
              <Linkedin className="size-6 text-[var(--turquoise)]" />
              Connect LinkedIn Account
            </Dialog.Title>
            {showIframe && (
              <button
                onClick={handleClose}
                className="p-2 rounded-lg hover:bg-[var(--turquoise)]/10 text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
              >
                <X className="size-5" />
              </button>
            )}
          </div>

          <Dialog.Description className="sr-only">
            Connect your LinkedIn account for data enrichment
          </Dialog.Description>

          <div className={cn("flex flex-col", showIframe ? "flex-1 min-h-0" : "space-y-4")}>
            {/* Status Indicator Bar */}
            {(state === 'initializing' || state === 'waiting' || state === 'detecting') && (
              <div className="bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 rounded-lg p-4 mb-4 shrink-0">
                <div className="flex items-center gap-3 mb-2">
                  <Loader2 className="size-5 text-[var(--turquoise)] animate-spin" />
                  <span className="text-[var(--cream)] font-medium">{getStatusMessage()}</span>
                </div>

                {/* Progress bar animation */}
                <div className="h-1 bg-[var(--navy)] rounded-full overflow-hidden mb-3">
                  <div className="h-full bg-[var(--turquoise)] rounded-full animate-pulse w-full origin-left"
                       style={{ animation: 'progressIndeterminate 1.5s ease-in-out infinite' }} />
                </div>

                {state === 'waiting' && (
                  <p className="text-sm text-[var(--cream)]/60">
                    Log in to LinkedIn in the window below. This will auto-detect when you&apos;re done.
                  </p>
                )}

                {/* Timeout warning */}
                {isTimedOut && (
                  <div className="mt-3 flex items-center justify-between bg-amber-500/10 border border-amber-500/30 rounded-md p-3">
                    <p className="text-sm text-amber-400">
                      Taking too long? Try refreshing the session.
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={handleRefresh}
                      className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                    >
                      <RefreshCw className="size-3 mr-1" />
                      Refresh
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Embedded Browserbase iframe */}
            {showIframe && (
              <div className="flex-1 min-h-0 mb-4 rounded-lg overflow-hidden border border-[var(--turquoise)]/20 bg-white">
                <iframe
                  src={sessionUrl}
                  className="w-full h-full"
                  allow="clipboard-read; clipboard-write"
                  title="LinkedIn Login"
                />
              </div>
            )}

            {/* Error State */}
            {state === 'error' && errorMessage && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-red-500 font-medium">Connection failed</p>
                  <p className="text-sm text-red-400 mt-1">{errorMessage}</p>
                </div>
              </div>
            )}

            {/* Success State */}
            {state === 'connected' && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CheckCircle2 className="size-5 text-green-500" />
                  <span className="text-green-500 font-medium">
                    Connected as {pollData?.profileName || 'LinkedIn User'}
                  </span>
                </div>
                {pollData?.profileUrl && (
                  <a
                    href={pollData.profileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--turquoise)] hover:underline flex items-center gap-1"
                  >
                    {pollData.profileUrl.replace('https://', '')}
                    <ExternalLink className="size-3" />
                  </a>
                )}
                <p className="text-sm text-[var(--cream)]/60 mt-2">
                  Credentials stored securely. You won&apos;t need to log in again.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 shrink-0">
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

              {/* Cancel button when iframe is showing */}
              {showIframe && (
                <Button variant="outline" onClick={handleClose} className="w-full">
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>

      {/* CSS for indeterminate progress bar */}
      <style jsx global>{`
        @keyframes progressIndeterminate {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </Dialog.Root>
  );
}
