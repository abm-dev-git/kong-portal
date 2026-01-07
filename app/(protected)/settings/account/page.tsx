import { currentUser } from '@clerk/nextjs/server'
import { UserButton } from '@clerk/nextjs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DeleteAccountButton } from '@/components/settings/DeleteAccountButton'
import { Mail, Calendar, Shield, ExternalLink } from 'lucide-react'

export default async function AccountSettingsPage() {
  const user = await currentUser()

  if (!user) {
    return null
  }

  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Unknown'

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
          Manage your profile and account preferences.
        </p>
      </div>

      {/* Profile Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-medium text-[var(--cream)] mb-6">Profile</h2>

        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-20 h-20',
                },
              }}
            />
          </div>

          {/* User Info */}
          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-xl text-[var(--cream)] font-medium">
                {user.firstName} {user.lastName}
              </h3>
              <p className="text-[var(--cream)]/60">
                @{user.username || user.id.slice(0, 8)}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-[var(--cream)]/70">
                <Mail className="w-4 h-4" />
                <span>{user.emailAddresses[0]?.emailAddress || 'No email'}</span>
                {user.emailAddresses[0]?.verification?.status === 'verified' && (
                  <Badge variant="success">Verified</Badge>
                )}
              </div>
              <div className="flex items-center gap-2 text-[var(--cream)]/70">
                <Calendar className="w-4 h-4" />
                <span>Joined {createdAt}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Manage Profile Link */}
        <div className="mt-6 pt-6 border-t border-[var(--turquoise)]/10">
          <a
            href="https://accounts.clerk.dev/user"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-[var(--turquoise)] hover:text-[var(--turquoise)]/80 transition-colors"
          >
            <span>Manage profile in Clerk</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Security Card */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-lg font-medium text-[var(--cream)]">Security</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--cream)]">Two-factor authentication</p>
              <p className="text-sm text-[var(--cream)]/60">
                Add an extra layer of security to your account
              </p>
            </div>
            <Badge variant={user.twoFactorEnabled ? 'success' : 'warning'}>
              {user.twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-[var(--cream)]">Password</p>
              <p className="text-sm text-[var(--cream)]/60">
                Change your password or enable passwordless login
              </p>
            </div>
            <a
              href="https://accounts.clerk.dev/user/security"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </a>
          </div>
        </div>
      </div>

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
  )
}
