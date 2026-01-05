'use client';

import { useAuth, useOrganization } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { DynamicsSettingsCard } from '@/components/settings/DynamicsSettingsCard';

export default function DynamicsSettingsPage() {
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
          Dynamics 365 Integration
        </h1>
        <p className="text-[var(--cream)]/70">
          Connect your Microsoft Dynamics 365 CRM for seamless data synchronization.
        </p>
      </div>

      {/* Dynamics Settings Card */}
      <DynamicsSettingsCard token={token} orgId={organization?.id} />

      {/* Additional Info */}
      <div className="p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-medium text-[var(--cream)] mb-4">
          Setting up Dynamics 365
        </h2>
        <div className="space-y-4 text-sm text-[var(--cream)]/70">
          <p>
            To connect Dynamics 365, you need to register an application in Azure Active
            Directory. This creates a service principal that we use to access your CRM data.
          </p>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">Azure AD setup:</h3>
            <ol className="list-decimal list-inside space-y-1 ml-2">
              <li>Register an application in Azure Portal</li>
              <li>Add Dynamics 365 API permissions</li>
              <li>Generate a client secret</li>
              <li>Grant admin consent for the permissions</li>
            </ol>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">Required API permissions:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Dynamics CRM user_impersonation</li>
              <li>Microsoft Graph User.Read</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-[var(--cream)]">What we sync:</h3>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Contact information (name, email, phone)</li>
              <li>Account data (name, website, industry)</li>
              <li>Lead records and status</li>
              <li>Enriched profile data from LinkedIn</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
