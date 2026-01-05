'use client';

import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';

type ConnectionState = 'idle' | 'redirecting' | 'connected' | 'error';

// Salesforce Cloud icon component
export function SalesforceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.006 5.415a4.195 4.195 0 0 1 3.045-1.306c1.56 0 2.954.9 3.69 2.205.63-.3 1.35-.45 2.1-.45 2.85 0 5.159 2.34 5.159 5.22s-2.31 5.22-5.16 5.22c-.45 0-.9-.06-1.32-.165a3.87 3.87 0 0 1-3.41 2.07c-.6 0-1.17-.135-1.68-.39a4.65 4.65 0 0 1-4.05 2.37c-2.25 0-4.14-1.605-4.56-3.75A4.7 4.7 0 0 1 0 12.044c0-2.625 2.1-4.755 4.695-4.8a5.49 5.49 0 0 1 5.311-1.83z"/>
    </svg>
  );
}

interface AuthUrlResponse {
  authUrl: string;
}

interface HealthResponse {
  connected?: boolean;
  is_connected?: boolean;
}

interface ConnectSalesforceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  token?: string;
  orgId?: string;
}

export function ConnectSalesforceModal({
  open,
  onOpenChange,
  onSuccess,
  token,
  orgId,
}: ConnectSalesforceModalProps) {
  const [state, setState] = useState<ConnectionState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const handleConnect = async () => {
    setState('redirecting');
    setErrorMessage('');

    try {
      // Get OAuth authorization URL from backend
      const result = await api.get<AuthUrlResponse>('/v1/salesforce/auth/url');

      if (!result.success || !result.data?.authUrl) {
        throw new Error(result.error?.message || 'Failed to get authorization URL');
      }

      // Open Salesforce OAuth in new window
      const popup = window.open(
        result.data.authUrl,
        'salesforce-oauth',
        'width=600,height=700,left=200,top=100'
      );

      if (!popup) {
        throw new Error('Please allow popups for this site to connect to Salesforce');
      }

      // Poll for popup close (OAuth callback will redirect back)
      const pollTimer = setInterval(() => {
        if (popup.closed) {
          clearInterval(pollTimer);
          // Check connection status after popup closes
          checkConnectionStatus();
        }
      }, 500);

    } catch (error) {
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const checkConnectionStatus = async () => {
    try {
      const result = await api.get<HealthResponse>('/v1/crm/config/platforms/salesforce/health');

      if (result.success && (result.data?.connected || result.data?.is_connected)) {
        setState('connected');
        setTimeout(() => {
          onSuccess();
          onOpenChange(false);
          resetModal();
        }, 1500);
      } else {
        // User may have cancelled OAuth flow
        setState('idle');
      }
    } catch {
      setState('idle');
    }
  };

  const resetModal = () => {
    setState('idle');
    setErrorMessage('');
  };

  const handleClose = () => {
    if (state !== 'redirecting') {
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
            <SalesforceIcon className="size-6 text-[#00A1E0]" />
            Connect Salesforce
          </Dialog.Title>

          <Dialog.Description className="text-sm text-[var(--cream)]/70 mb-6">
            {state === 'idle' && 'Connect your Salesforce account using secure OAuth authentication.'}
            {state === 'redirecting' && 'Redirecting to Salesforce login...'}
            {state === 'connected' && 'Successfully connected to Salesforce!'}
            {state === 'error' && 'An error occurred while connecting your account.'}
          </Dialog.Description>

          <div className="space-y-4">
            {state === 'idle' && (
              <>
                <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4">
                  <h4 className="text-sm font-medium text-[var(--cream)] mb-2">What you'll authorize:</h4>
                  <ul className="text-sm text-[var(--cream)]/70 space-y-1">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-500" />
                      Read contacts and accounts
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-500" />
                      Sync lead and opportunity data
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-green-500" />
                      View organization information
                    </li>
                  </ul>
                </div>

                <p className="text-xs text-[var(--cream)]/50">
                  You'll be redirected to Salesforce to authorize access.{' '}
                  <a
                    href="https://help.salesforce.com/s/articleView?id=sf.connected_app_overview.htm"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--turquoise)] hover:underline inline-flex items-center gap-0.5"
                  >
                    Learn more
                    <ExternalLink className="size-3" />
                  </a>
                </p>
              </>
            )}

            {state === 'redirecting' && (
              <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-6 flex flex-col items-center gap-3">
                <Loader2 className="size-8 animate-spin text-[#00A1E0]" />
                <p className="text-sm text-[var(--cream)]/70 text-center">
                  Complete the login in the popup window.<br />
                  <span className="text-xs text-[var(--cream)]/50">This window will update when complete.</span>
                </p>
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
              {(state === 'idle' || state === 'error') && (
                <>
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleConnect} className="flex-1 bg-[#00A1E0] hover:bg-[#0088c7]">
                    <SalesforceIcon className="size-4 mr-2" />
                    Connect with Salesforce
                  </Button>
                </>
              )}

              {state === 'redirecting' && (
                <Button variant="outline" onClick={handleClose} className="w-full">
                  Cancel
                </Button>
              )}

              {state === 'connected' && (
                <Button disabled className="w-full bg-green-500">
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
