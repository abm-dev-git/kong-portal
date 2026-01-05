'use client';

import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

// HubSpot logo SVG icon component
export function HubSpotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.164 7.93V5.086a2.198 2.198 0 0 0 1.267-1.978V3.06a2.198 2.198 0 0 0-2.198-2.198h-.048a2.198 2.198 0 0 0-2.198 2.198v.048a2.198 2.198 0 0 0 1.267 1.978V7.93a5.996 5.996 0 0 0-2.77 1.29L6.164 3.71a2.43 2.43 0 1 0-1.358 1.13l7.26 5.418a6.002 6.002 0 0 0 .084 6.53l-2.18 2.18a1.835 1.835 0 1 0 1.13 1.13l2.18-2.18a6.002 6.002 0 0 0 6.53.084 6.002 6.002 0 0 0-1.646-10.072Zm-.979 8.059a3.453 3.453 0 1 1 0-6.905 3.453 3.453 0 0 1 0 6.905Z"/>
    </svg>
  );
}

interface ConnectResponse {
  id: string;
  integration_type: string;
  is_active: boolean;
  created_at: string;
}

interface ConnectHubSpotModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  token?: string;
  orgId?: string;
}

export function ConnectHubSpotModal({
  open,
  onOpenChange,
  onSuccess,
  token,
  orgId,
}: ConnectHubSpotModalProps) {
  const [state, setState] = useState<ConnectionState>('idle');
  const [accessToken, setAccessToken] = useState('');
  const [showToken, setShowToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const validateToken = (tokenValue: string): boolean => {
    // HubSpot Private App tokens start with 'pat-' followed by region code
    // e.g., pat-na1-xxx or pat-eu1-xxx
    return /^pat-(na1|eu1|ap1)-[a-f0-9-]+$/i.test(tokenValue) || tokenValue.length > 20;
  };

  const handleConnect = async () => {
    if (!accessToken.trim()) {
      setErrorMessage('Please enter your HubSpot access token');
      return;
    }

    if (!validateToken(accessToken)) {
      setErrorMessage('Invalid token format. HubSpot Private App tokens usually start with "pat-"');
      return;
    }

    setState('connecting');
    setErrorMessage('');

    try {
      const result = await api.post<ConnectResponse>('/v1/crm/config/integrations', {
        integration_type: 'hubspot',
        display_name: 'HubSpot',
        api_key: accessToken,
        is_active: true,
      });

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to connect to HubSpot');
      }

      setState('connected');
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        resetModal();
      }, 1500);
    } catch (error) {
      setState('error');
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const resetModal = () => {
    setState('idle');
    setAccessToken('');
    setShowToken(false);
    setErrorMessage('');
  };

  const handleClose = () => {
    if (state !== 'connecting') {
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
            <HubSpotIcon className="size-6 text-[#ff7a59]" />
            Connect HubSpot Account
          </Dialog.Title>

          <Dialog.Description className="text-sm text-[var(--cream)]/70 mb-6">
            {state === 'idle' && 'Enter your HubSpot Private App access token to connect your account.'}
            {state === 'connecting' && 'Connecting to HubSpot...'}
            {state === 'connected' && 'Successfully connected your HubSpot account!'}
            {state === 'error' && 'An error occurred while connecting your account.'}
          </Dialog.Description>

          <div className="space-y-4">
            {(state === 'idle' || state === 'error') && (
              <>
                <div className="space-y-2">
                  <label htmlFor="hubspot-token" className="text-sm font-medium text-[var(--cream)]">
                    Access Token
                  </label>
                  <div className="relative">
                    <input
                      id="hubspot-token"
                      type={showToken ? 'text' : 'password'}
                      value={accessToken}
                      onChange={(e) => setAccessToken(e.target.value)}
                      placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      className={cn(
                        "w-full px-3 py-2 pr-10 rounded-md font-mono text-sm",
                        "bg-[var(--dark-blue)] border border-[var(--turquoise)]/20",
                        "text-[var(--cream)] placeholder:text-[var(--cream)]/40",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]/50"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowToken(!showToken)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--cream)]/60 hover:text-[var(--cream)]"
                    >
                      {showToken ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-[var(--cream)]/50">
                    Get your access token from{' '}
                    <a
                      href="https://developers.hubspot.com/docs/api/private-apps"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--turquoise)] hover:underline inline-flex items-center gap-0.5"
                    >
                      HubSpot Private Apps
                      <ExternalLink className="size-3" />
                    </a>
                  </p>
                </div>

                {state === 'error' && errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start gap-3">
                    <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-500">{errorMessage}</p>
                  </div>
                )}
              </>
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
                  <Button onClick={handleConnect} className="flex-1 bg-[#ff7a59] hover:bg-[#e86a4a]">
                    <HubSpotIcon className="size-4 mr-2" />
                    Connect
                  </Button>
                </>
              )}

              {state === 'connecting' && (
                <Button disabled className="w-full">
                  <Loader2 className="animate-spin size-4 mr-2" />
                  Connecting...
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
