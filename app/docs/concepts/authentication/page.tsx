"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import {
  Clock,
  Key,
  Shield,
  Building2,
  ArrowRight,
  Lock,
  User,
  Globe
} from "lucide-react";

export default function AuthenticationPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            5 min read
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          Authentication
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          Learn about API keys, JWT tokens, and how to securely access the ABM.dev API.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Shield className="w-5 h-5 text-[var(--turquoise)]" />
          Authentication Methods
        </h2>
        <p className="text-[var(--cream)]/70">
          ABM.dev supports two authentication methods depending on your use case:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Key className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">API Keys</h3>
            <p className="text-sm text-[var(--cream)]/60 mb-2">
              Best for server-to-server integrations and backend services.
            </p>
            <Badge variant="secondary" className="bg-[var(--success-green)]/10 text-[var(--success-green)] border-[var(--success-green)]/30">
              Recommended
            </Badge>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <User className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">JWT Tokens</h3>
            <p className="text-sm text-[var(--cream)]/60 mb-2">
              For user-authenticated sessions via the portal dashboard.
            </p>
            <Badge variant="secondary" className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/30">
              Portal Only
            </Badge>
          </div>
        </div>
      </section>

      {/* API Keys */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Key className="w-5 h-5 text-[var(--turquoise)]" />
          API Keys
        </h2>

        <p className="text-[var(--cream)]/70">
          API keys are the primary way to authenticate with the ABM.dev API. They are scoped
          to your organization and can be managed from your dashboard.
        </p>

        <h3 className="text-lg font-medium text-[var(--cream)]">Creating an API Key</h3>
        <ol className="space-y-2 text-[var(--cream)]/70 list-decimal list-inside">
          <li>Go to your <Link href="/api-keys" className="text-[var(--turquoise)] hover:underline">API Keys page</Link></li>
          <li>Click &quot;Create New Key&quot;</li>
          <li>Give your key a descriptive name (e.g., &quot;Production Server&quot;)</li>
          <li>Copy and securely store the key - it won&apos;t be shown again</li>
        </ol>

        <h3 className="text-lg font-medium text-[var(--cream)] mt-6">Using API Keys</h3>
        <p className="text-[var(--cream)]/70 mb-4">
          Include your API key in the <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)] text-sm">Authorization</code> header:
        </p>

        <CodeBlock
          title="Bearer Token Authentication"
          examples={{
            curl: `curl https://api.abm.dev/v1/enrich \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test@example.com"}'`,
            javascript: `const response = await fetch('https://api.abm.dev/v1/enrich', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email: 'test@example.com' }),
});`,
            python: `import requests

response = requests.post(
    'https://api.abm.dev/v1/enrich',
    headers={'Authorization': 'Bearer YOUR_API_KEY'},
    json={'email': 'test@example.com'}
)`,
          }}
        />

        <Callout type="warning" title="Security">
          Never expose your API key in client-side code, public repositories, or logs.
          Use environment variables and server-side requests only.
        </Callout>

        <h3 className="text-lg font-medium text-[var(--cream)] mt-6">Alternative: X-API-Key Header</h3>
        <p className="text-[var(--cream)]/70 mb-4">
          You can also use the <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)] text-sm">x-api-key</code> header:
        </p>

        <CodeBlock
          title="X-API-Key Header"
          examples={{
            curl: `curl https://api.abm.dev/v1/enrich \\
  -H "x-api-key: YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"email": "test@example.com"}'`,
          }}
        />
      </section>

      {/* Organization Context */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[var(--turquoise)]" />
          Organization Context
        </h2>

        <p className="text-[var(--cream)]/70">
          All API requests are scoped to your organization. Your API key is linked to your
          organization, so all enrichment data and usage is tracked at the organization level.
        </p>

        <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
          <h3 className="font-medium text-[var(--cream)] mb-2">What&apos;s tracked per organization:</h3>
          <ul className="space-y-2 text-[var(--cream)]/70 text-sm">
            <li className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[var(--turquoise)]" />
              API usage and rate limits
            </li>
            <li className="flex items-center gap-2">
              <Key className="w-4 h-4 text-[var(--turquoise)]" />
              API keys and permissions
            </li>
            <li className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[var(--turquoise)]" />
              CRM integrations (HubSpot, etc.)
            </li>
            <li className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--turquoise)]" />
              Encrypted credentials for integrations
            </li>
          </ul>
        </div>
      </section>

      {/* Rate Limits */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Rate Limits</h2>

        <p className="text-[var(--cream)]/70">
          API requests are rate-limited based on your subscription plan:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--turquoise)]/20">
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Plan</th>
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Requests/Min</th>
                <th className="text-left py-3 text-[var(--cream)]">Monthly Limit</th>
              </tr>
            </thead>
            <tbody className="text-[var(--cream)]/70">
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">Free</td>
                <td className="py-3 pr-4">10</td>
                <td className="py-3">100 enrichments</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">Starter</td>
                <td className="py-3 pr-4">60</td>
                <td className="py-3">1,000 enrichments</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">Pro</td>
                <td className="py-3 pr-4">300</td>
                <td className="py-3">10,000 enrichments</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Enterprise</td>
                <td className="py-3 pr-4">Custom</td>
                <td className="py-3">Unlimited</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="note" title="Rate Limit Headers">
          Check the <code className="text-xs">X-RateLimit-Remaining</code> and{" "}
          <code className="text-xs">X-RateLimit-Reset</code> response headers to monitor your usage.
        </Callout>
      </section>

      {/* Error Handling */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Authentication Errors</h2>

        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-[var(--error-red)]/10 border border-[var(--error-red)]/30">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm font-mono text-[var(--error-red)]">401 Unauthorized</code>
            </div>
            <p className="text-sm text-[var(--cream)]/60">
              Missing or invalid API key. Check that your key is correctly formatted.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--error-red)]/10 border border-[var(--error-red)]/30">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm font-mono text-[var(--error-red)]">403 Forbidden</code>
            </div>
            <p className="text-sm text-[var(--cream)]/60">
              Your API key doesn&apos;t have permission for this resource or your plan doesn&apos;t include this feature.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[var(--warning-yellow)]/10 border border-[var(--warning-yellow)]/30">
            <div className="flex items-center gap-2 mb-1">
              <code className="text-sm font-mono text-[var(--warning-yellow)]">429 Too Many Requests</code>
            </div>
            <p className="text-sm text-[var(--cream)]/60">
              Rate limit exceeded. Wait for the reset time indicated in the response headers.
            </p>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Continue Learning</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/getting-started"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Getting Started</p>
              <p className="text-sm text-[var(--cream)]/60">Make your first API call</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/api-keys"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Manage API Keys</p>
              <p className="text-sm text-[var(--cream)]/60">Create and manage your keys</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
