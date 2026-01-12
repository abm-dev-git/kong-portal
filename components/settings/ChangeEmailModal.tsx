'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import * as Dialog from '@radix-ui/react-dialog';
import { toast } from 'sonner';
import { Loader2, Mail, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface ChangeEmailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = 'enter-email' | 'verify-code' | 'success';

export function ChangeEmailModal({ open, onOpenChange }: ChangeEmailModalProps) {
  const { user } = useUser();
  const [step, setStep] = useState<Step>('enter-email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailAddressId, setEmailAddressId] = useState<string | null>(null);

  const handleClose = () => {
    // Reset state when closing
    setStep('enter-email');
    setEmail('');
    setCode('');
    setEmailAddressId(null);
    onOpenChange(false);
  };

  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !email) return;

    setIsLoading(true);

    try {
      // Create a new email address
      const emailAddress = await user.createEmailAddress({ email });
      setEmailAddressId(emailAddress.id);

      // Send verification code
      await emailAddress.prepareVerification({ strategy: 'email_code' });

      toast.success('Verification code sent to your email');
      setStep('verify-code');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to send verification code';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !emailAddressId || !code) return;

    setIsLoading(true);

    try {
      // Find the email address we created
      const emailAddress = user.emailAddresses.find((ea) => ea.id === emailAddressId);

      if (!emailAddress) {
        throw new Error('Email address not found');
      }

      // Verify the code
      await emailAddress.attemptVerification({ code });

      // Set as primary email
      await user.update({ primaryEmailAddressId: emailAddressId });

      toast.success('Email address updated successfully');
      setStep('success');

      // Close modal after a short delay
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid verification code';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!user || !emailAddressId) return;

    setIsLoading(true);

    try {
      const emailAddress = user.emailAddresses.find((ea) => ea.id === emailAddressId);

      if (!emailAddress) {
        throw new Error('Email address not found');
      }

      await emailAddress.prepareVerification({ strategy: 'email_code' });
      toast.success('Verification code resent');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to resend code';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={handleClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
              <Mail className="w-5 h-5 text-[var(--turquoise)]" />
              Change Email
            </Dialog.Title>
            <button
              onClick={handleClose}
              className="p-2 rounded-lg hover:bg-[var(--turquoise)]/10 text-[var(--cream)]/60 hover:text-[var(--cream)] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <Dialog.Description className="sr-only">
            Change your email address with verification
          </Dialog.Description>

          {/* Step 1: Enter new email */}
          {step === 'enter-email' && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-email" className="text-[var(--cream)]/70">
                  New Email Address
                </Label>
                <Input
                  id="new-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your new email address"
                  className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40"
                  required
                  autoFocus
                />
                <p className="text-xs text-[var(--cream)]/50">
                  We&apos;ll send a verification code to this email address.
                </p>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="flex-1 border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={!email || isLoading}
                  className="flex-1 bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Code
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Step 2: Enter verification code */}
          {step === 'verify-code' && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="bg-[var(--dark-blue)] border border-[var(--turquoise)]/10 rounded-lg p-4 mb-4">
                <p className="text-sm text-[var(--cream)]/70">
                  We sent a verification code to:
                </p>
                <p className="text-sm text-[var(--turquoise)] font-medium mt-1">
                  {email}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="verification-code" className="text-[var(--cream)]/70">
                  Verification Code
                </Label>
                <Input
                  id="verification-code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="Enter 6-digit code"
                  className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 text-center text-lg tracking-widest"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={isLoading}
                className="text-sm text-[var(--turquoise)] hover:underline disabled:opacity-50"
              >
                Didn&apos;t receive the code? Resend
              </button>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep('enter-email')}
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
                    'Verify & Update'
                  )}
                </Button>
              </div>
            </form>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <h3 className="text-lg font-medium text-[var(--cream)] mb-2">
                Email Updated
              </h3>
              <p className="text-sm text-[var(--cream)]/60">
                Your email has been changed to {email}
              </p>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
