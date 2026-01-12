'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Loader2, Lock, Eye, EyeOff, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export function PasswordForm() {
  const { user, isLoaded } = useUser();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Password validation
  const passwordMinLength = 8;
  const isPasswordLongEnough = newPassword.length >= passwordMinLength;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const canSubmit = currentPassword && isPasswordLongEnough && passwordsMatch;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !canSubmit) return;

    setIsUpdating(true);

    try {
      await user.updatePassword({
        currentPassword,
        newPassword,
      });

      toast.success('Password updated successfully');

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update password';
      toast.error(message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 bg-[var(--turquoise)]/10 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-[var(--turquoise)]/10 rounded" />
            <div className="h-10 w-full bg-[var(--turquoise)]/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  // Check if user has a password (some users might use OAuth only)
  const hasPassword = user.passwordEnabled;

  return (
    <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-6">
        <Lock className="w-5 h-5 text-[var(--turquoise)]" />
        <h2 className="text-lg font-semibold text-[var(--cream)]">Password</h2>
      </div>

      {!hasPassword ? (
        <div className="text-center py-6">
          <p className="text-[var(--cream)]/70 mb-4">
            You signed up using a social provider and don&apos;t have a password set.
          </p>
          <p className="text-sm text-[var(--cream)]/50">
            Password management is not available for accounts without a password.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Password */}
          <div className="space-y-2">
            <Label htmlFor="current-password" className="text-[var(--cream)]/70">
              Current Password
            </Label>
            <div className="relative">
              <Input
                id="current-password"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter your current password"
                className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 pr-10"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cream)]/50 hover:text-[var(--cream)]"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="space-y-2">
            <Label htmlFor="new-password" className="text-[var(--cream)]/70">
              New Password
            </Label>
            <div className="relative">
              <Input
                id="new-password"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your new password"
                className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 pr-10"
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cream)]/50 hover:text-[var(--cream)]"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {/* Password strength indicator */}
            <div className="flex items-center gap-2 text-xs">
              <div className={cn(
                'flex items-center gap-1',
                isPasswordLongEnough ? 'text-emerald-400' : 'text-[var(--cream)]/50'
              )}>
                {isPasswordLongEnough && <Check className="w-3 h-3" />}
                At least {passwordMinLength} characters
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirm-password" className="text-[var(--cream)]/70">
              Confirm New Password
            </Label>
            <div className="relative">
              <Input
                id="confirm-password"
                type={showConfirm ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your new password"
                className={cn(
                  "bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40 pr-10",
                  confirmPassword && !passwordsMatch && "border-red-500/50"
                )}
                autoComplete="new-password"
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--cream)]/50 hover:text-[var(--cream)]"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p className="text-xs text-red-400">Passwords do not match</p>
            )}
            {passwordsMatch && (
              <p className="text-xs text-emerald-400 flex items-center gap-1">
                <Check className="w-3 h-3" />
                Passwords match
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={!canSubmit || isUpdating}
              className={cn(
                "bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]",
                !canSubmit && "opacity-50 cursor-not-allowed"
              )}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
