"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import {
  Clock,
  Building2,
  CheckCircle2,
  ArrowRight,
  Settings,
  RefreshCw,
  Database,
  Zap,
  ExternalLink
} from "lucide-react";

export default function HubSpotGuidePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            10 min
          </Badge>
          <Badge variant="secondary" className="bg-[#FF7A59]/10 text-[#FF7A59] border-[#FF7A59]/30">
            Integration
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          HubSpot Integration
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          Connect your HubSpot CRM to automatically sync enriched contact and company data.
        </p>
      </div>

      {/* What you&apos;ll learn */}
      <section className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <h2 className="font-medium text-[var(--cream)] mb-3">In this guide</h2>
        <ul className="space-y-2 text-sm text-[var(--cream)]/70">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Connect your HubSpot account via OAuth
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Configure field mapping between ABM.dev and HubSpot
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Set up automatic enrichment sync
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Test the integration with a sample contact
          </li>
        </ul>
      </section>

      {/* Prerequisites */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Prerequisites</h2>
        <ul className="space-y-2 text-[var(--cream)]/70">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            An ABM.dev account with an active subscription
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            A HubSpot account with admin or super admin access
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            HubSpot Marketing Hub or Sales Hub (Professional or Enterprise recommended)
          </li>
        </ul>
      </section>

      {/* Step 1: Connect HubSpot */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Connect your HubSpot account</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            Navigate to your ABM.dev settings and initiate the HubSpot connection:
          </p>

          <ol className="space-y-3 text-[var(--cream)]/70">
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">1.</span>
              Go to <Link href="/settings/integrations" className="text-[var(--turquoise)] hover:underline">Settings → Integrations</Link>
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">2.</span>
              Click &quot;Connect HubSpot&quot;
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">3.</span>
              Sign in to HubSpot and authorize ABM.dev
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">4.</span>
              Select the HubSpot portal you want to connect
            </li>
          </ol>

          <Button
            asChild
            className="bg-[#FF7A59] text-white hover:bg-[#FF7A59]/90"
          >
            <Link href="/settings/integrations">
              <Building2 className="w-4 h-4 mr-2" />
              Go to Integrations
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>

          <Callout type="note" title="OAuth Permissions">
            ABM.dev requests read and write access to Contacts and Companies.
            This is required to sync enriched data back to your CRM.
          </Callout>
        </div>
      </section>

      {/* Step 2: Configure Field Mapping */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Configure field mapping</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            After connecting, map ABM.dev enrichment fields to your HubSpot properties.
            We automatically suggest mappings for standard fields.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--turquoise)]/20">
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">ABM.dev Field</th>
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">HubSpot Property</th>
                  <th className="text-left py-3 text-[var(--cream)]">Type</th>
                </tr>
              </thead>
              <tbody className="text-[var(--cream)]/70">
                <tr className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4"><code className="text-xs">person.fullName</code></td>
                  <td className="py-3 pr-4">firstname + lastname</td>
                  <td className="py-3">Contact</td>
                </tr>
                <tr className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4"><code className="text-xs">person.title</code></td>
                  <td className="py-3 pr-4">jobtitle</td>
                  <td className="py-3">Contact</td>
                </tr>
                <tr className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4"><code className="text-xs">person.linkedinUrl</code></td>
                  <td className="py-3 pr-4">linkedinbio</td>
                  <td className="py-3">Contact</td>
                </tr>
                <tr className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4"><code className="text-xs">company.name</code></td>
                  <td className="py-3 pr-4">company</td>
                  <td className="py-3">Contact/Company</td>
                </tr>
                <tr className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4"><code className="text-xs">company.industry</code></td>
                  <td className="py-3 pr-4">industry</td>
                  <td className="py-3">Company</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4"><code className="text-xs">company.employeeCount</code></td>
                  <td className="py-3 pr-4">numberofemployees</td>
                  <td className="py-3">Company</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="tip" title="Custom Properties">
            You can create custom HubSpot properties for ABM.dev-specific fields like
            confidence scores and enrichment timestamps.
          </Callout>
        </div>
      </section>

      {/* Step 3: Set up sync options */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Configure sync settings</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            Choose how enriched data should be synced to HubSpot:
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
              <RefreshCw className="w-5 h-5 text-[var(--turquoise)] mb-2" />
              <h3 className="font-medium text-[var(--cream)] mb-1">Auto-Sync</h3>
              <p className="text-sm text-[var(--cream)]/60">
                Automatically write enriched data to HubSpot after each enrichment.
                Best for real-time data freshness.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
              <Settings className="w-5 h-5 text-[var(--turquoise)] mb-2" />
              <h3 className="font-medium text-[var(--cream)] mb-1">Manual Approval</h3>
              <p className="text-sm text-[var(--cream)]/60">
                Review enriched data before syncing. Best when data quality review is required.
              </p>
            </div>
          </div>

          <h3 className="text-lg font-medium text-[var(--cream)]">Confidence Threshold</h3>
          <p className="text-[var(--cream)]/70">
            Set a minimum confidence score for automatic updates. We recommend 0.85 for
            automated workflows to ensure high data quality.
          </p>
        </div>
      </section>

      {/* Step 4: Test the integration */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Test the integration</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            Run a test enrichment and verify the data syncs correctly:
          </p>

          <CodeBlock
            title="Test enrichment with HubSpot sync"
            examples={{
              curl: `curl -X POST https://api.abm.dev/v1/enrich \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "test@yourcompany.com",
    "syncTo": {
      "hubspot": {
        "enabled": true,
        "createIfMissing": true
      }
    }
  }'`,
              javascript: `const response = await fetch('https://api.abm.dev/v1/enrich', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@yourcompany.com',
    syncTo: {
      hubspot: {
        enabled: true,
        createIfMissing: true
      }
    }
  }),
});`,
              python: `import requests

response = requests.post(
    'https://api.abm.dev/v1/enrich',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={
        'email': 'test@yourcompany.com',
        'syncTo': {
            'hubspot': {
                'enabled': True,
                'createIfMissing': True
            }
        }
    }
)`,
            }}
          />

          <p className="text-[var(--cream)]/70">
            Check your HubSpot portal to verify the contact was created or updated with
            the enriched data.
          </p>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Troubleshooting</h2>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Data not syncing</h3>
            <ul className="text-sm text-[var(--cream)]/70 space-y-1">
              <li>• Check that your HubSpot connection is still active in Settings</li>
              <li>• Verify the confidence score meets your threshold</li>
              <li>• Ensure the contact email exists or createIfMissing is enabled</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Permission errors</h3>
            <ul className="text-sm text-[var(--cream)]/70 space-y-1">
              <li>• Re-authorize the HubSpot connection with an admin account</li>
              <li>• Check that ABM.dev has the required scopes</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Next Steps</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/guides/linkedin"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">LinkedIn Integration</p>
              <p className="text-sm text-[var(--cream)]/60">Set up profile enrichment</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/concepts/enrichment"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">How Enrichment Works</p>
              <p className="text-sm text-[var(--cream)]/60">Understanding confidence scores</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
