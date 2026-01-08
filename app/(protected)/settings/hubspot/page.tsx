'use client';

import { useAuth, useOrganization } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { HubSpotSettingsCard } from '@/components/settings/HubSpotSettingsCard';

export default function HubSpotSettingsPage() {
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          HubSpot Integration
        </h1>
        <p className="text-[var(--cream)]/70">
          Connect your HubSpot CRM for seamless data synchronization.
        </p>
      </div>

      {/* HubSpot Settings Card */}
      <HubSpotSettingsCard token={token} orgId={organization?.id} />

      {/* Additional Info */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-medium text-[var(--cream)] mb-4">
          Setting up HubSpot
        </h2>
        <div className="space-y-4 text-sm text-[var(--cream)]/70">
          <p>
            To connect HubSpot, you need to create a Private App in your HubSpot
            account. This gives you a secure access token that we use to sync data.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">Required scopes:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>crm.objects.contacts.read</li>
              <li>crm.objects.contacts.write</li>
              <li>crm.objects.companies.read</li>
              <li>crm.objects.companies.write</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">What we sync:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Contact information (name, email, phone)</li>
              <li>Company data (name, domain, industry)</li>
              <li>Enriched profile data from LinkedIn</li>
              <li>Custom properties for ABM scoring</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
