'use client';

import React, { useState, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Button } from '@/components/ui/button';
import { Loader2, AlertCircle, CheckCircle2, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';
import { createApiClient } from '@/lib/api-client';

type ConnectionState = 'idle' | 'connecting' | 'connected' | 'error';

// Microsoft Dynamics 365 icon component
export function DynamicsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

interface ConnectResponse {
  id: string;
  integration_type: string;
  is_active: boolean;
  created_at: string;
}

interface ConnectDynamicsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  token?: string;
  orgId?: string;
}

interface FormFields {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  environmentUrl: string;
}

export function ConnectDynamicsModal({
  open,
  onOpenChange,
  onSuccess,
  token,
  orgId,
}: ConnectDynamicsModalProps) {
  const [state, setState] = useState<ConnectionState>('idle');
  const [showSecret, setShowSecret] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [formFields, setFormFields] = useState<FormFields>({
    tenantId: '',
    clientId: '',
    clientSecret: '',
    environmentUrl: '',
  });

  // Create API client with auth context
  const api = useMemo(() => createApiClient(token, orgId), [token, orgId]);

  const validateForm = (): string | null => {
    if (!formFields.tenantId.trim()) {
      return 'Please enter your Azure AD Tenant ID';
    }
    // UUID format validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(formFields.tenantId)) {
      return 'Invalid Tenant ID format. Expected UUID format.';
    }
    if (!formFields.clientId.trim()) {
      return 'Please enter your Application (Client) ID';
    }
    if (!uuidRegex.test(formFields.clientId)) {
      return 'Invalid Client ID format. Expected UUID format.';
    }
    if (!formFields.clientSecret.trim()) {
      return 'Please enter your Client Secret';
    }
    if (!formFields.environmentUrl.trim()) {
      return 'Please enter your Dynamics 365 Environment URL';
    }
    // URL validation
    try {
      const url = new URL(formFields.environmentUrl);
      if (!url.hostname.includes('dynamics.com') && !url.hostname.includes('crm')) {
        return 'Environment URL should be a valid Dynamics 365 URL (e.g., https://org.crm.dynamics.com)';
      }
    } catch {
      return 'Invalid Environment URL format';
    }
    return null;
  };

  const handleConnect = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      setState('error');
      return;
    }

    setState('connecting');
    setErrorMessage('');

    try {
      const result = await api.post<ConnectResponse>('/v1/crm/config/integrations', {
        integration_type: 'dynamics',
        display_name: 'Microsoft Dynamics 365',
        credentials: {
          tenant_id: formFields.tenantId,
          client_id: formFields.clientId,
          client_secret: formFields.clientSecret,
          environment_url: formFields.environmentUrl,
        },
        is_active: true,
      });

      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to connect to Dynamics 365');
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
    setFormFields({
      tenantId: '',
      clientId: '',
      clientSecret: '',
      environmentUrl: '',
    });
    setShowSecret(false);
    setErrorMessage('');
  };

  const handleClose = () => {
    if (state !== 'connecting') {
      onOpenChange(false);
      resetModal();
    }
  };

  const updateField = (field: keyof FormFields, value: string) => {
    setFormFields(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content
          className={cn(
            "fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50",
            "bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl",
            "w-full max-w-md p-6 max-h-[90vh] overflow-y-auto",
            "focus:outline-none"
          )}
        >
          <Dialog.Title className="text-xl font-semibold text-[var(--cream)] mb-2 flex items-center gap-2">
            <DynamicsIcon className="size-6 text-[#002050]" />
            Connect Dynamics 365
          </Dialog.Title>

          <Dialog.Description className="text-sm text-[var(--cream)]/70 mb-6">
            {state === 'idle' && 'Enter your Azure AD application credentials to connect Dynamics 365.'}
            {state === 'connecting' && 'Connecting to Microsoft Dynamics 365...'}
            {state === 'connected' && 'Successfully connected to Dynamics 365!'}
            {state === 'error' && 'Please check your credentials and try again.'}
          </Dialog.Description>

          <div className="space-y-4">
            {(state === 'idle' || state === 'error') && (
              <>
                <div className="space-y-2">
                  <label htmlFor="dynamics-tenant" className="text-sm font-medium text-[var(--cream)]">
                    Tenant ID
                  </label>
                  <input
                    id="dynamics-tenant"
                    type="text"
                    value={formFields.tenantId}
                    onChange={(e) => updateField('tenantId', e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className={cn(
                      "w-full px-3 py-2 rounded-md font-mono text-sm",
                      "bg-[var(--dark-blue)] border border-[var(--turquoise)]/20",
                      "text-[var(--cream)] placeholder:text-[var(--cream)]/40",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]/50"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dynamics-client" className="text-sm font-medium text-[var(--cream)]">
                    Application (Client) ID
                  </label>
                  <input
                    id="dynamics-client"
                    type="text"
                    value={formFields.clientId}
                    onChange={(e) => updateField('clientId', e.target.value)}
                    placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                    className={cn(
                      "w-full px-3 py-2 rounded-md font-mono text-sm",
                      "bg-[var(--dark-blue)] border border-[var(--turquoise)]/20",
                      "text-[var(--cream)] placeholder:text-[var(--cream)]/40",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]/50"
                    )}
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="dynamics-secret" className="text-sm font-medium text-[var(--cream)]">
                    Client Secret
                  </label>
                  <div className="relative">
                    <input
                      id="dynamics-secret"
                      type={showSecret ? 'text' : 'password'}
                      value={formFields.clientSecret}
                      onChange={(e) => updateField('clientSecret', e.target.value)}
                      placeholder="Enter client secret"
                      className={cn(
                        "w-full px-3 py-2 pr-10 rounded-md font-mono text-sm",
                        "bg-[var(--dark-blue)] border border-[var(--turquoise)]/20",
                        "text-[var(--cream)] placeholder:text-[var(--cream)]/40",
                        "focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]/50"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSecret(!showSecret)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--cream)]/60 hover:text-[var(--cream)]"
                    >
                      {showSecret ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="dynamics-url" className="text-sm font-medium text-[var(--cream)]">
                    Environment URL
                  </label>
                  <input
                    id="dynamics-url"
                    type="url"
                    value={formFields.environmentUrl}
                    onChange={(e) => updateField('environmentUrl', e.target.value)}
                    placeholder="https://org.crm.dynamics.com"
                    className={cn(
                      "w-full px-3 py-2 rounded-md text-sm",
                      "bg-[var(--dark-blue)] border border-[var(--turquoise)]/20",
                      "text-[var(--cream)] placeholder:text-[var(--cream)]/40",
                      "focus:outline-none focus:ring-2 focus:ring-[var(--turquoise)]/50"
                    )}
                  />
                  <p className="text-xs text-[var(--cream)]/50">
                    Find this in{' '}
                    <a
                      href="https://admin.powerplatform.microsoft.com/environments"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[var(--turquoise)] hover:underline inline-flex items-center gap-0.5"
                    >
                      Power Platform Admin Center
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
                  <Button onClick={handleConnect} className="flex-1 bg-[#002050] hover:bg-[#001840]">
                    <DynamicsIcon className="size-4 mr-2" />
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
