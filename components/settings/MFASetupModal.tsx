'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import QRCode from 'qrcode';
import { Loader2, Shield, X, Copy, Check, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface MFASetupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type Step = 'loading' | 'scan' | 'verify' | 'success';

export function MFASetupModal({ open, onOpenChange, onSuccess }: MFASetupModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState<Step>('loading');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Initialize TOTP when modal opens
  useEffect(() => {
    if (open && user) {
      initializeTOTP();
    }

    // Cleanup when modal closes
    if (!open) {
      setStep('loading');
      setQrCodeUrl('');
      setSecret('');
      setCode('');
    }
  }, [open, user]);

  const initializeTOTP = async () => {
    if (!user) return;

    setStep('loading');

    try {
      // Create TOTP - this returns the secret and URI
      const totp = await user.createTOTP();

      if (totp.uri) {
        // Generate QR code from the URI
        const qrDataUrl = await QRCode.toDataURL(totp.uri, {
          width: 200,
          margin: 2,
          color: {
            dark: '#0A1F3D',
            light: '#FFFFFF',
          },
        });

        setQrCodeUrl(qrDataUrl);
        setSecret(totp.secret || '');
        setStep('scan');
      } else {
        throw new Error('Failed to generate TOTP');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to set up 2FA';
      toast.error(message);
      onOpenChange(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !code) return;

    setIsLoading(true);

    try {
      // Verify the TOTP code
      await user.verifyTOTP({ code });

      toast.success('Two-factor authentication enabled!');
      setStep('success');

      // Call success callback after a short delay
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid verification code';
      toast.error(message);
      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopySecret = async () => {
    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success('Secret copied to clipboard');
    } catch {
      toast.error('Failed to copy secret');
    }
  };

  const handleClose = () => {
    if (step !== 'loading' && step !== 'success') {
      // Warn user if they're in the middle of setup
      if (!confirm('Are you sure you want to cancel 2FA setup?')) {
        return;
      }
    }
    onOpenChange(false);
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--turquoise)]" />
              Set Up 2FA
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-[var(--turquoise)]/10 text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Dialog.Description className="sr-only">
            Set up two-factor authentication for your account
          </Dialog.Description>

          {/* Loading State */}
          {step === 'loading' && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-[var(--turquoise)] animate-spin mb-4" />
              <p className="text-[var(--cream)]/70">Setting up two-factor authentication...</p>
            </div>
          )}

          {/* Scan QR Code Step */}
          {step === 'scan' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--turquoise)]/10 rounded-full mb-4">
                  <Smartphone className="w-4 h-4 text-[var(--turquoise)]" />
                  <span className="text-sm text-[var(--turquoise)]">Step 1 of 2</span>
                </div>
                <p className="text-[var(--cream)]/70 text-sm">
                  Scan this QR code with your authenticator app (Google Authenticator, Authy, 1Password, etc.)
                </p>
              </div>

              {/* QR Code */}
              <div className="flex justify-center">
                <div className="bg-white p-3 rounded-lg">
                  {qrCodeUrl && (
                    <img src={qrCodeUrl} alt="2FA QR Code" className="w-48 h-48" />
                  )}
                </div>
              </div>

              {/* Manual Entry Option */}
              <div className="space-y-2">
                <p className="text-xs text-[var(--cream)]/50 text-center">
                  Can&apos;t scan? Enter this code manually:
                </p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 px-3 py-2 bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 rounded text-xs text-[var(--turquoise)] font-mono break-all">
                    {secret}
                  </code>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopySecret}
                    className="border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                onClick={() => setStep('verify')}
                className="w-full bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Verify Code Step */}
          {step === 'verify' && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[var(--turquoise)]/10 rounded-full mb-4">
                  <Shield className="w-4 h-4 text-[var(--turquoise)]" />
                  <span className="text-sm text-[var(--turquoise)]">Step 2 of 2</span>
                </div>
                <p className="text-[var(--cream)]/70 text-sm">
                  Enter the 6-digit code from your authenticator app to verify setup
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="totp-code" className="text-[var(--cream)]/70">
                  Verification Code
                </Label>
                <Input
                  id="totp-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 text-center text-2xl tracking-[0.5em] font-mono"
                  maxLength={6}
                  required
                  autoFocus
                  autoComplete="one-time-code"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('scan')}
                  className="flex-1 border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={code.length !== 6 || isLoading}
                  className="flex-1 bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Enable 2FA'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Success State */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-[var(--cream)] mb-2">
                2FA Enabled!
              </h3>
              <p className="text-sm text-[var(--cream)]/60">
                Your account is now protected with two-factor authentication.
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
