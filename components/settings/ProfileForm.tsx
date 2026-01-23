'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'sonner';
import { Loader2, Check, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserAvatar } from '@/components/ui/user-avatar';
import { cn } from '@/lib/utils';

interface ProfileFormProps {
  onEmailChangeClick?: () => void;
}

export function ProfileForm({ onEmailChangeClick }: ProfileFormProps) {
  const { user, isLoaded } = useUser();
  const [isUpdating, setIsUpdating] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [username, setUsername] = useState(user?.username || '');
  const [linkedInUrl, setLinkedInUrl] = useState(
    (user?.unsafeMetadata?.linkedInUrl as string) || ''
  );

  // Track if values have changed
  const hasChanges =
    firstName !== (user?.firstName || '') ||
    lastName !== (user?.lastName || '') ||
    username !== (user?.username || '') ||
    linkedInUrl !== ((user?.unsafeMetadata?.linkedInUrl as string) || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !hasChanges) return;

    setIsUpdating(true);

    try {
      await user.update({
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        username: username || undefined,
        unsafeMetadata: {
          ...user.unsafeMetadata,
          linkedInUrl: linkedInUrl || undefined,
        },
      });

      toast.success('Profile updated successfully');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to update profile';
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
          <div className="h-20 w-20 bg-[var(--turquoise)]/10 rounded-full" />
          <div className="space-y-2">
            <div className="h-4 w-24 bg-[var(--turquoise)]/10 rounded" />
            <div className="h-10 w-full bg-[var(--turquoise)]/10 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const primaryEmail = user.primaryEmailAddress;
  const isEmailVerified = primaryEmail?.verification?.status === 'verified';

  return (
    <div className="bg-[var(--navy)] border border-[var(--turquoise)]/20 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-[var(--cream)] mb-6">Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar Section */}
        <div className="flex items-start gap-4">
          <UserAvatar
            email={primaryEmail?.emailAddress}
            name={`${user.firstName || ''} ${user.lastName || ''}`.trim()}
            size="xl"
          />
          <div className="flex-1 pt-2">
            <p className="text-sm text-[var(--cream)]">
              Your avatar is linked to your email via Gravatar
            </p>
            <a
              href="https://gravatar.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[var(--turquoise)] hover:underline inline-flex items-center gap-1 mt-1"
            >
              Change avatar at gravatar.com
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Name Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-[var(--cream)]/70">
              First Name
            </Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-[var(--cream)]/70">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40"
            />
          </div>
        </div>

        {/* Username Field */}
        <div className="space-y-2">
          <Label htmlFor="username" className="text-[var(--cream)]/70">
            Username
          </Label>
          <Input
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter a username"
            className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40"
          />
          <p className="text-xs text-[var(--cream)]/50">
            This will be your unique identifier. Leave blank to use your user ID.
          </p>
        </div>

        {/* LinkedIn URL Field */}
        <div className="space-y-2">
          <Label htmlFor="linkedInUrl" className="text-[var(--cream)]/70">
            LinkedIn Profile URL
          </Label>
          <Input
            id="linkedInUrl"
            value={linkedInUrl}
            onChange={(e) => setLinkedInUrl(e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
            className="bg-[var(--dark-blue)] border-[var(--turquoise)]/20 text-[var(--cream)] placeholder:text-[var(--cream)]/40"
          />
          <p className="text-xs text-[var(--cream)]/50">
            Optional. Used for LinkedIn data enrichment features.
          </p>
        </div>

        {/* Email Section (Read-only with change button) */}
        <div className="space-y-2">
          <Label className="text-[var(--cream)]/70">Email Address</Label>
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[var(--dark-blue)] border border-[var(--turquoise)]/20 rounded-md">
              <Mail className="w-4 h-4 text-[var(--cream)]/50" />
              <span className="text-[var(--cream)]">{primaryEmail?.emailAddress}</span>
              {isEmailVerified && (
                <span className="ml-auto flex items-center gap-1 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              )}
            </div>
            {onEmailChangeClick && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onEmailChangeClick}
                className="border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/10"
              >
                Change
              </Button>
            )}
          </div>
        </div>

        {/* Account Info */}
        <div className="pt-4 border-t border-[var(--turquoise)]/10">
          <p className="text-xs text-[var(--cream)]/50">
            Account created:{' '}
            <span className="text-[var(--cream)]/70">
              {user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }) : 'Unknown'}
            </span>
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!hasChanges || isUpdating}
            className={cn(
              "bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]",
              !hasChanges && "opacity-50 cursor-not-allowed"
            )}
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Check className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
