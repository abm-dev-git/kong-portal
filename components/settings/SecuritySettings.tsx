'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Shield, ShieldCheck, ShieldOff, Loader2, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { MFASetupModal } from './MFASetupModal';
import { RecoveryCodesModal } from './RecoveryCodesModal';

export function SecuritySettings() {
  const { user, isLoaded } = useUser();
  const [isDisabling, setIsDisabling] = useState(false);
  const [showMFASetup, setShowMFASetup] = useState(false);
  const [showRecoveryCodes, setShowRecoveryCodes] = useState(false);

  if (!isLoaded || !user) {
    return (
      <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 bg-[var(--turquoise)]/10 rounded" />
          <div className="h-20 bg-[var(--turquoise)]/10 rounded" />
        </div>
      </div>
    );
  }

  const isTOTPEnabled = user.twoFactorEnabled;
  const backupCodesCount = user.backupCodeEnabled ? 'Available' : 'Not set up';

  const handleDisableMFA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    setIsDisabling(true);

    try {
      await user.disableTOTP();
      toast.success('Two-factor authentication disabled');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to disable 2FA';
      toast.error(message);
    } finally {
      setIsDisabling(false);
    }
  };

  return (
    <>
      <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
        <div className="flex items-center gap-2 mb-6">
          <Shield className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-lg font-semibold text-[var(--cream)]">
            Two-Factor Authentication
          </h2>
        </div>

        <div className="space-y-4">
          {/* Status Display */}
          <div className={cn(
            'flex items-center justify-between p-4 rounded-lg border',
            isTOTPEnabled
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-[var(--dark-blue)] border-[var(--turquoise)]/10'
          )}>
            <div className="flex items-center gap-3">
              {isTOTPEnabled ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <ShieldOff className="w-6 h-6 text-[var(--cream)]/50" />
              )}
              <div>
                <p className={cn(
                  'font-medium',
                  isTOTPEnabled ? 'text-emerald-400' : 'text-[var(--cream)]'
                )}>
                  {isTOTPEnabled ? 'Enabled' : 'Disabled'}
                </p>
                <p className="text-sm text-[var(--cream)]/60">
                  {isTOTPEnabled
                    ? 'Your account is protected with 2FA'
                    : 'Add an extra layer of security to your account'}
                </p>
              </div>
            </div>

            {isTOTPEnabled ? (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDisableMFA}
                disabled={isDisabling}
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                {isDisabling ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Disabling...
                  </>
                ) : (
                  'Disable'
                )}
              </Button>
            ) : (
              <Button
                onClick={() => setShowMFASetup(true)}
                className="bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
              >
                Enable 2FA
              </Button>
            )}
          </div>

          {/* Recovery Codes Section (only show when 2FA is enabled) */}
          {isTOTPEnabled && (
            <div className="p-4 bg-[var(--dark-blue)] border border-[var(--turquoise)]/10 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-[var(--cream)]/50" />
                  <div>
                    <p className="text-sm font-medium text-[var(--cream)]">
                      Recovery Codes
                    </p>
                    <p className="text-xs text-[var(--cream)]/60">
                      Use these codes if you lose access to your authenticator app
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowRecoveryCodes(true)}
                  className="border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
                >
                  View Codes
                </Button>
              </div>
            </div>
          )}

          {/* Info Text */}
          <p className="text-xs text-[var(--cream)]/50">
            Two-factor authentication adds an extra layer of security by requiring a code from your authenticator app when signing in.
          </p>
        </div>
      </div>

      {/* Modals */}
      <MFASetupModal
        open={showMFASetup}
        onOpenChange={setShowMFASetup}
        onSuccess={() => {
          setShowMFASetup(false);
          setShowRecoveryCodes(true);
        }}
      />

      <RecoveryCodesModal
        open={showRecoveryCodes}
        onOpenChange={setShowRecoveryCodes}
      />
    </>
  );
}
