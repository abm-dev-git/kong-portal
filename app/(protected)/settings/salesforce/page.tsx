'use client';

import { useAuth, useOrganization } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { SalesforceSettingsCard } from '@/components/settings/SalesforceSettingsCard';

export default function SalesforceSettingsPage() {
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
          Salesforce Integration
        </h1>
        <p className="text-[var(--cream)]/70">
          Connect your Salesforce CRM for seamless data synchronization.
        </p>
      </div>

      {/* Salesforce Settings Card */}
      <SalesforceSettingsCard token={token} orgId={organization?.id} />

      {/* Additional Info */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-medium text-[var(--cream)] mb-4">
          Setting up Salesforce
        </h2>
        <div className="space-y-4 text-sm text-[var(--cream)]/70">
          <p>
            When you click Connect, you'll be redirected to Salesforce to authorize access.
            This uses OAuth 2.0 for secure authentication without sharing your password.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">What we request access to:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Access and manage your data (api)</li>
              <li>Perform requests at any time (refresh_token)</li>
              <li>Access your basic identity info (id)</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">What we sync:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Contact information (name, email, phone, title)</li>
              <li>Account data (name, website, industry, employees)</li>
              <li>Lead records and conversion status</li>
              <li>Opportunity data for pipeline insights</li>
              <li>Enriched profile data from LinkedIn</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">API usage:</h3>
            <p className="ml-2">
              We monitor your Salesforce API usage and display it on this page.
              Sync operations are optimized to minimize API calls.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
