'use client';

import { useAuth, useOrganization } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { LinkedInSettingsCard } from '@/components/settings/LinkedInSettingsCard';

export default function LinkedInSettingsPage() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    getToken().then((t) => t && setToken(t));
  }, [getToken]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          LinkedIn Integration
        </h1>
        <p className="text-[var(--cream)]/70">
          Connect your LinkedIn account for profile enrichment and lead insights.
        </p>
      </div>

      {/* LinkedIn Settings Card */}
      <LinkedInSettingsCard token={token} orgId={organization?.id} />

      {/* Additional Info */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-medium text-[var(--cream)] mb-4">
          How it works
        </h2>
        <div className="space-y-4 text-sm text-[var(--cream)]/70">
          <p>
            When you connect your LinkedIn account, we use Browserbase to securely
            authenticate your session. This allows us to enrich your contacts with
            real-time LinkedIn profile data.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">What we access:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Public profile information</li>
              <li>Work history and education</li>
              <li>Skills and endorsements</li>
              <li>Company associations</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">What we never do:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Send messages on your behalf</li>
              <li>Make connection requests</li>
              <li>Access your direct messages</li>
              <li>Store your LinkedIn password</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
