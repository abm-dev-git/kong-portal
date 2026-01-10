'use client';

import { useAuth, useOrganization } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { LinkedInSettingsCard } from '@/components/settings/LinkedInSettingsCard';
import { useLinkedInStatus } from '@/lib/hooks/useLinkedInStatus';

export default function LinkedInSettingsPage() {
  const { getToken } = useAuth();
  const { organization } = useOrganization();
  const [token, setToken] = useState<string>();

  useEffect(() => {
    let mounted = true;
    getToken().then((t) => {
      if (mounted && t) setToken(t);
    });
    return () => { mounted = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { data: status } = useLinkedInStatus(token, organization?.id);
  const isConnected = status?.status === 'connected';

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

      {/* Important Login Note - only show when not connected */}
      {!isConnected && (
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
          <h3 className="text-sm font-medium text-amber-400 mb-2">
            Important: Use Email/Password Login
          </h3>
          <p className="text-sm text-[var(--cream)]/70">
            When logging into LinkedIn in the browser above, use your LinkedIn email and
            password directly. <strong className="text-amber-400">Do not use &quot;Sign in with Google&quot;</strong> or
            other OAuth options — these are blocked in embedded browsers for security reasons.
          </p>
        </div>
      )}

      {/* Additional Info */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-medium text-[var(--cream)] mb-4">
          How it works
        </h2>
        <div className="space-y-4 text-sm text-[var(--cream)]/70">
          <p>
            When you connect your LinkedIn account, you log in through the secure
            cloud browser above. Your session cookies are encrypted and stored
            securely. We use these credentials to access LinkedIn data via the
            Voyager API for enriching your contacts and companies.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">What we access:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your connections and their profiles</li>
              <li>Profile data: work history, education, skills, and contact info</li>
              <li>Activity feeds and engagement data</li>
              <li>Company pages and employee information</li>
              <li>Search results for people discovery</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">Security:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Your LinkedIn password never reaches our servers</li>
              <li>Only encrypted session cookies are stored</li>
              <li>Sessions are isolated per organization</li>
              <li>Strict rate limiting to protect your account</li>
              <li>You can disconnect at any time</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
