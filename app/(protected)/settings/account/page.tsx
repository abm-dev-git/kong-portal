'use client';

import { ProfileForm } from '@/components/settings/ProfileForm';
import { PasswordForm } from '@/components/settings/PasswordForm';
import { SecuritySettings } from '@/components/settings/SecuritySettings';
import { SessionsList } from '@/components/settings/SessionsList';
import { DeleteAccountButton } from '@/components/settings/DeleteAccountButton';

export default function AccountSettingsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Account Settings
        </h1>
        <p className="text-[var(--cream)]/70">
          Manage your profile, security, and sessions.
        </p>
      </div>

      {/* Profile Section */}
      <ProfileForm />

      {/* Password Section */}
      <PasswordForm />

      {/* Two-Factor Authentication Section */}
      <SecuritySettings />

      {/* Active Sessions Section */}
      <SessionsList />

      {/* Danger Zone */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-red-500/30">
        <h2 className="text-lg font-medium text-red-400 mb-4">Danger Zone</h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-[var(--cream)]">Delete Account</p>
            <p className="text-sm text-[var(--cream)]/60">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <DeleteAccountButton />
        </div>
      </div>
    </div>
  );
}
