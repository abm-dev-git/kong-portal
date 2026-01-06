"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Callout } from "@/components/docs/Callout";
import {
  Clock,
  Linkedin,
  CheckCircle2,
  ArrowRight,
  Eye,
  Shield,
  Zap,
  ExternalLink,
  Monitor,
  RefreshCw
} from "lucide-react";

export default function LinkedInGuidePage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            10 min
          </Badge>
          <Badge variant="secondary" className="bg-[#0A66C2]/10 text-[#0A66C2] border-[#0A66C2]/30">
            Integration
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          LinkedIn Integration
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          Connect your LinkedIn account to enrich contacts with real-time profile data
          using secure browser automation.
        </p>
      </div>

      {/* What you&apos;ll learn */}
      <section className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <h2 className="font-medium text-[var(--cream)] mb-3">In this guide</h2>
        <ul className="space-y-2 text-sm text-[var(--cream)]/70">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Understand how LinkedIn enrichment works
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Connect your LinkedIn account via Browserbase
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Configure session settings and rate limits
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Test LinkedIn profile enrichment
          </li>
        </ul>
      </section>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--turquoise)]" />
          How LinkedIn Enrichment Works
        </h2>

        <p className="text-[var(--cream)]/70">
          ABM.dev uses Browserbase to securely access LinkedIn on your behalf. This provides
          real-time profile data that isn&apos;t available through public APIs.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Monitor className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Browserbase</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Cloud browser infrastructure for secure, headless automation
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Shield className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Secure Sessions</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Encrypted cookies, no credentials stored, session isolation
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <RefreshCw className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Rate Limited</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Respects LinkedIn&apos;s usage limits to protect your account
            </p>
          </div>
        </div>

        <Callout type="note" title="Your Credentials">
          ABM.dev never stores your LinkedIn password. You authenticate directly with LinkedIn
          in a secure browser session. Only encrypted session cookies are stored.
        </Callout>
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
            A LinkedIn account (Sales Navigator recommended for best results)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            Two-factor authentication configured on LinkedIn (recommended)
          </li>
        </ul>
      </section>

      {/* Step 1: Navigate to settings */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Open LinkedIn Settings</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            Navigate to your integration settings to begin the LinkedIn connection:
          </p>

          <Button
            asChild
            className="bg-[#0A66C2] text-white hover:bg-[#0A66C2]/90"
          >
            <Link href="/settings/integrations">
              <Linkedin className="w-4 h-4 mr-2" />
              Go to Integrations
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Step 2: Start connection */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Start the connection</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            Click &quot;Connect LinkedIn&quot; to open a secure browser window where you&apos;ll
            log in to your LinkedIn account.
          </p>

          <ol className="space-y-3 text-[var(--cream)]/70">
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">1.</span>
              Click &quot;Connect LinkedIn&quot; in the integrations panel
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">2.</span>
              A new browser window opens with a live view of the session
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">3.</span>
              Log in to LinkedIn as you normally would
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">4.</span>
              Complete any two-factor authentication prompts
            </li>
            <li className="flex gap-2">
              <span className="text-[var(--turquoise)] font-medium">5.</span>
              Once logged in, click &quot;Verify Connection&quot; in ABM.dev
            </li>
          </ol>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20">
            <div className="flex items-center gap-3 mb-3">
              <Eye className="w-5 h-5 text-[var(--turquoise)]" />
              <span className="font-medium text-[var(--cream)]">Live Session View</span>
            </div>
            <p className="text-sm text-[var(--cream)]/70">
              You can watch the browser session in real-time as you authenticate.
              This helps you verify the connection is working and troubleshoot any issues.
            </p>
          </div>

          <Callout type="warning" title="Account Safety">
            Use a LinkedIn account that you own. Avoid connecting accounts that are already
            flagged or restricted by LinkedIn. We recommend Sales Navigator accounts for
            higher rate limits.
          </Callout>
        </div>
      </section>

      {/* Step 3: Configure settings */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Configure rate limits</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            Set appropriate rate limits to protect your LinkedIn account:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--turquoise)]/20">
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">Account Type</th>
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">Recommended Limit</th>
                  <th className="text-left py-3 text-[var(--cream)]">Notes</th>
                </tr>
              </thead>
              <tbody className="text-[var(--cream)]/70">
                <tr className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4">Free LinkedIn</td>
                  <td className="py-3 pr-4">30 profiles/day</td>
                  <td className="py-3">Conservative to avoid restrictions</td>
                </tr>
                <tr className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4">Premium</td>
                  <td className="py-3 pr-4">100 profiles/day</td>
                  <td className="py-3">Higher limits available</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Sales Navigator</td>
                  <td className="py-3 pr-4">300 profiles/day</td>
                  <td className="py-3">Best for high-volume enrichment</td>
                </tr>
              </tbody>
            </table>
          </div>

          <Callout type="tip" title="Best Practice">
            Start with conservative limits and gradually increase them. Monitor your
            LinkedIn account for any warning messages about usage.
          </Callout>
        </div>
      </section>

      {/* Step 4: Test */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            4
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Test the connection</h2>
        </div>

        <div className="ml-11 space-y-4">
          <p className="text-[var(--cream)]/70">
            After connecting, test by enriching a contact with a known LinkedIn URL:
          </p>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20">
            <pre className="text-sm text-[var(--cream)] overflow-x-auto">
              <code>{`{
  "email": "contact@example.com",
  "linkedinUrl": "https://linkedin.com/in/example-profile",
  "enrichSources": ["linkedin"]
}`}</code>
            </pre>
          </div>

          <p className="text-[var(--cream)]/70">
            The enrichment response will include data from the LinkedIn profile, such as:
          </p>

          <ul className="space-y-2 text-sm text-[var(--cream)]/70">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
              Current job title and company
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
              Work history
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
              Education history
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
              Skills and endorsements
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
              Profile photo URL
            </li>
          </ul>
        </div>
      </section>

      {/* Session Management */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Session Management</h2>

        <p className="text-[var(--cream)]/70">
          Your LinkedIn session is managed securely by ABM.dev:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Session Refresh</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Sessions are automatically refreshed. You may need to re-authenticate
              occasionally if LinkedIn invalidates the session.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Disconnect</h3>
            <p className="text-sm text-[var(--cream)]/60">
              You can disconnect your LinkedIn account at any time from Settings.
              This immediately invalidates the stored session.
            </p>
          </div>
        </div>
      </section>

      {/* Troubleshooting */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Troubleshooting</h2>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Session expired</h3>
            <p className="text-sm text-[var(--cream)]/70">
              If you see &quot;Session expired&quot; errors, re-authenticate by clicking
              &quot;Reconnect&quot; in Settings → Integrations.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Rate limit warnings</h3>
            <p className="text-sm text-[var(--cream)]/70">
              If LinkedIn shows warnings about automated activity, reduce your daily
              enrichment limit and spread requests over time.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Verification challenges</h3>
            <p className="text-sm text-[var(--cream)]/70">
              LinkedIn may occasionally require additional verification. Use the live
              view to complete any security challenges during authentication.
            </p>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Next Steps</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/guides/hubspot"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">HubSpot Integration</p>
              <p className="text-sm text-[var(--cream)]/60">Sync data to your CRM</p>
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
