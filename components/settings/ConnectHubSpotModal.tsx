'use client';

import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Eye,
  EyeOff,
  ExternalLink,
  ArrowLeft,
  ArrowRight,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';
import type { ConnectionTestResult, CreateIntegrationResponse } from '@/lib/types/integrations';

type ModalStep = 'instructions' | 'token-entry' | 'testing' | 'success' | 'failure' | 'saving';

// HubSpot logo SVG icon component
export function HubSpotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.164 7.93V5.086a2.198 2.198 0 0 0 1.267-1.978V3.06a2.198 2.198 0 0 0-2.198-2.198h-.048a2.198 2.198 0 0 0-2.198 2.198v.048a2.198 2.198 0 0 0 1.267 1.978V7.93a5.996 5.996 0 0 0-2.77 1.29L6.164 3.71a2.43 2.43 0 1 0-1.358 1.13l7.26 5.418a6.002 6.002 0 0 0 .084 6.53l-2.18 2.18a1.835 1.835 0 1 0 1.13 1.13l2.18-2.18a6.002 6.002 0 0 0 6.53.084 6.002 6.002 0 0 0-1.646-10.072Zm-.979 8.059a3.453 3.453 0 1 1 0-6.905 3.453 3.453 0 0 1 0 6.905Z"/>
    </svg>
  );
}

const REQUIRED_SCOPES = [
  'crm.objects.contacts.read',
  'crm.objects.contacts.write',
  'crm.objects.companies.read',
  'crm.objects.companies.write',
  'crm.schemas.contacts.read',
  'crm.schemas.companies.read',
];

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
  const [step, setStep] = useState<ModalStep>('instructions');
  const [accessToken, setAccessToken] = useState('');
  const [displayName, setDisplayName] = useState('My HubSpot Account');
  const [showToken, setShowToken] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const validateToken = (tokenValue: string): boolean => {
    // HubSpot Private App tokens start with 'pat-' followed by region code
    return /^pat-(na1|eu1|ap1)-[a-f0-9-]+$/i.test(tokenValue) || tokenValue.length > 20;
  };

  const handleTestConnection = async () => {
    if (!accessToken.trim()) {
      setErrorMessage('Please enter your HubSpot access token');
      return;
    }

    if (!validateToken(accessToken)) {
      setErrorMessage('Invalid token format. HubSpot Private App tokens start with "pat-"');
      return;
    }

    setStep('testing');
    setErrorMessage('');

    try {
      const result = await api.post<ConnectionTestResult>('/v1/crm/config/integrations/test', {
        integrationType: 'hubspot',
        apiKey: accessToken,
      });

      if (result.success && result.data?.connected) {
        setTestResult(result.data);
        setStep('success');
      } else {
        setErrorMessage(result.data?.error_message || result.error?.message || 'Connection test failed');
        setStep('failure');
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred');
      setStep('failure');
    }
  };

  const handleSaveConnection = async () => {
    setStep('saving');
    setErrorMessage('');

    try {
      const result = await api.post<CreateIntegrationResponse>('/v1/crm/config/integrations', {
        integrationType: 'hubspot',
        displayName: displayName.trim() || 'My HubSpot Account',
        apiKey: accessToken,
        portalId: testResult?.portal_id || undefined,
        isActive: true,
      });

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to save integration');
      }

      // Success - close modal and refresh
      setTimeout(() => {
        onSuccess();
        onOpenChange(false);
        resetModal();
      }, 500);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save integration');
      setStep('failure');
    }
  };

  const resetModal = () => {
    setStep('instructions');
    setAccessToken('');
    setDisplayName('My HubSpot Account');
    setShowToken(false);
    setErrorMessage('');
    setTestResult(null);
  };

  const handleClose = () => {
    if (step !== 'testing' && step !== 'saving') {
      onOpenChange(false);
      resetModal();
    }
  };

  const goBack = () => {
    if (step === 'token-entry') {
      setStep('instructions');
    } else if (step === 'success' || step === 'failure') {
      setStep('token-entry');
      setErrorMessage('');
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
            "w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto",
            "focus:outline-none"
          )}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
              <HubSpotIcon className="size-6 text-[#ff7a59]" />
              Connect HubSpot
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                className="text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
                disabled={step === 'testing' || step === 'saving'}
              >
                <X className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Step 1: Instructions */}
          {step === 'instructions' && (
            <div className="space-y-4">
              <Dialog.Description className="text-sm text-[var(--cream)]/70">
                To connect HubSpot, you'll need a Private App token.
              </Dialog.Description>

              <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4 space-y-3">
                <ol className="text-sm text-[var(--cream)]/80 space-y-2 list-decimal list-inside">
                  <li>Go to HubSpot → Settings → Integrations → Private Apps</li>
                  <li>Click "Create private app"</li>
                  <li>Name it "ABM.dev Integration"</li>
                  <li>Under Scopes, enable the required permissions</li>
                  <li>Click "Create app" and copy the access token</li>
                </ol>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium text-[var(--cream)]">Required scopes:</h4>
                <div className="bg-[var(--dark-blue)]/30 rounded-md p-3 font-mono text-xs text-[var(--cream)]/70 space-y-1">
                  {REQUIRED_SCOPES.map(scope => (
                    <div key={scope}>• {scope}</div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => window.open('https://app.hubspot.com/private-apps', '_blank')}
                  className="flex-1"
                >
                  <ExternalLink className="size-4 mr-2" />
                  Open HubSpot Settings
                </Button>
                <Button
                  onClick={() => setStep('token-entry')}
                  className="flex-1 bg-[#ff7a59] hover:bg-[#e86a4a]"
                >
                  I have my token
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Token Entry */}
          {step === 'token-entry' && (
            <div className="space-y-4">
              <Dialog.Description className="text-sm text-[var(--cream)]/70">
                Enter your HubSpot Private App token
              </Dialog.Description>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="hubspot-token" className="text-sm font-medium text-[var(--cream)]">
                    Private App Token
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
                    Token starts with "pat-na1-", "pat-eu1-", or "pat-ap1-"
                  </p>
                </div>

                <div className="space-y-2">
                  <label htmlFor="display-name" className="text-sm font-medium text-[var(--cream)]">
                    Display Name <span className="text-[var(--cream)]/50">(optional)</span>
                  </label>
                  <input
                    id="display-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="My HubSpot Account"
                    className={cn(
                      "w-full px-3 py-2 rounded-md text-sm",
                      "bg-[var(--dark-blue)] border border-[var(--turquoise)]/20",
                      "text-[var(--cream)] placeholder:text-[var(--cream)]/40",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]/50"
                    )}
                  />
                </div>

                {errorMessage && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-md p-3 flex items-start gap-2">
                    <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-red-400">{errorMessage}</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleTestConnection}
                  className="flex-1 bg-[#ff7a59] hover:bg-[#e86a4a]"
                  disabled={!accessToken.trim()}
                >
                  Test Connection
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Testing */}
          {step === 'testing' && (
            <div className="space-y-4 py-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-12 animate-spin text-[#ff7a59]" />
                <div className="text-center">
                  <p className="text-lg font-medium text-[var(--cream)]">Testing connection...</p>
                  <p className="text-sm text-[var(--cream)]/60 mt-1">Verifying your HubSpot credentials</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 4a: Success */}
          {step === 'success' && testResult && (
            <div className="space-y-4">
              <div className="bg-green-500/10 border border-green-500/30 rounded-md p-4 flex items-center gap-3">
                <CheckCircle2 className="size-6 text-green-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-green-400">Connection Successful!</p>
                  <p className="text-xs text-green-400/70 mt-0.5">Your HubSpot account is ready to connect.</p>
                </div>
              </div>

              <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4 space-y-2">
                {testResult.portal_id && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">Portal ID</span>
                    <span className="text-sm text-[var(--cream)] font-mono">{testResult.portal_id}</span>
                  </div>
                )}
                {testResult.rate_limit && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-[var(--cream)]/60">API Calls Remaining</span>
                    <span className="text-sm text-[var(--cream)]">
                      {testResult.rate_limit.remaining}/{testResult.rate_limit.limit}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSaveConnection}
                  className="flex-1 bg-[#ff7a59] hover:bg-[#e86a4a]"
                >
                  Save & Connect
                </Button>
              </div>
            </div>
          )}

          {/* Step 4b: Failure */}
          {step === 'failure' && (
            <div className="space-y-4">
              <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4 flex items-start gap-3">
                <AlertCircle className="size-6 text-red-500 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-red-400">Connection Failed</p>
                  <p className="text-sm text-red-400/70 mt-1">{errorMessage}</p>
                </div>
              </div>

              <div className="bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 rounded-md p-4">
                <p className="text-sm text-[var(--cream)]/70 mb-2">Please check that:</p>
                <ul className="text-sm text-[var(--cream)]/60 space-y-1.5">
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--turquoise)] mt-0.5">•</span>
                    The token is copied correctly (no extra spaces)
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--turquoise)] mt-0.5">•</span>
                    The Private App has the required scopes
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-[var(--turquoise)] mt-0.5">•</span>
                    The Private App is not deactivated
                  </li>
                </ul>
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={goBack} className="flex-1">
                  <ArrowLeft className="size-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleTestConnection}
                  className="flex-1 bg-[#ff7a59] hover:bg-[#e86a4a]"
                >
                  Try Again
                </Button>
              </div>
            </div>
          )}

          {/* Saving state */}
          {step === 'saving' && (
            <div className="space-y-4 py-8">
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-12 animate-spin text-[#ff7a59]" />
                <div className="text-center">
                  <p className="text-lg font-medium text-[var(--cream)]">Saving connection...</p>
                  <p className="text-sm text-[var(--cream)]/60 mt-1">Setting up your HubSpot integration</p>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
