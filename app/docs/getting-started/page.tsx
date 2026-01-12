"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/docs/CodeBlock";
import { Callout } from "@/components/docs/Callout";
import {
  ArrowRight,
  Clock,
  Key,
  Send,
  CheckCircle2,
  ExternalLink
} from "lucide-react";

export default function GettingStartedPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            5 min
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          Getting Started
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          Make your first API call and enrich a contact in under 5 minutes.
        </p>
      </div>

      {/* Prerequisites */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Prerequisites</h2>
        <p className="text-[var(--cream)]/70">
          Before you begin, make sure you have:
        </p>
        <ul className="space-y-2 text-[var(--cream)]/70">
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            An ABM.dev account (<Link href="/sign-up" className="text-[var(--turquoise)] hover:underline">sign up free</Link>)
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
            An API key from your dashboard
          </li>
        </ul>
      </section>

      {/* Step 1: Get API Key */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            1
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Get your API key</h2>
        </div>

        <p className="text-[var(--cream)]/70 ml-11">
          Navigate to your API Keys page and create a new key. Keep it secure - you&apos;ll need it for all API requests.
        </p>

        <div className="ml-11">
          <Button
            asChild
            className="bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
          >
            <Link href="/dashboard/api-keys">
              <Key className="w-4 h-4 mr-2" />
              Get API Key
              <ExternalLink className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="ml-11">
          <Callout type="tip" title="Security Tip">
            Store your API key securely. Never commit it to version control or expose it in client-side code.
          </Callout>
        </div>
      </section>

      {/* Step 2: Make your first request */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            2
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Make your first request</h2>
        </div>

        <p className="text-[var(--cream)]/70 ml-11">
          Use the enrichment endpoint to get data about a person or company. Replace{" "}
          <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)] text-sm">
            YOUR_API_KEY
          </code>{" "}
          with your actual key.
        </p>

        <div className="ml-11">
          <CodeBlock
            title="Enrich a contact"
            showCopyToClaude
            examples={{
              curl: `curl -X POST https://api.abm.dev/v1/enrich \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "jane.smith@acme.com"
  }'`,
              javascript: `const response = await fetch('https://api.abm.dev/v1/enrich', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'jane.smith@acme.com'
  }),
});

const data = await response.json();
console.log(data);`,
              python: `import requests

response = requests.post(
    'https://api.abm.dev/v1/enrich',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'email': 'jane.smith@acme.com'
    }
)

data = response.json()
print(data)`,
            }}
          />
        </div>

        <div className="ml-11">
          <Callout type="note" title="Request Fields">
            You can enrich with just an email, or provide additional fields like{" "}
            <code className="text-xs">name</code>, <code className="text-xs">company</code>, or{" "}
            <code className="text-xs">linkedinUrl</code> for better results.
          </Callout>
        </div>
      </section>

      {/* Step 3: Explore the response */}
      <section className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
            3
          </div>
          <h2 className="text-xl font-semibold text-[var(--cream)]">Explore the response</h2>
        </div>

        <p className="text-[var(--cream)]/70 ml-11">
          The API returns enriched data with confidence scores for each field:
        </p>

        <div className="ml-11">
          <div className="bg-[var(--dark-blue)] rounded-lg border border-[var(--turquoise)]/20 p-4 overflow-x-auto">
            <pre className="text-[var(--cream)] text-sm">
              <code>{`{
  "jobId": "enr_abc123",
  "status": "completed",
  "data": {
    "person": {
      "fullName": "Jane Smith",
      "title": "VP of Engineering",
      "email": "jane.smith@acme.com",
      "linkedinUrl": "https://linkedin.com/in/janesmith"
    },
    "company": {
      "name": "Acme Corp",
      "domain": "acme.com",
      "industry": "Technology",
      "employeeCount": "500-1000"
    }
  },
  "confidence": {
    "person.fullName": 0.95,
    "person.title": 0.88,
    "company.name": 0.99,
    "company.industry": 0.75
  },
  "sources": ["linkedin", "clearbit", "hunter"]
}`}</code>
            </pre>
          </div>
        </div>

        <div className="ml-11 space-y-3">
          <h3 className="text-lg font-medium text-[var(--cream)]">Response fields</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">jobId</code>
              <span className="text-[var(--cream)]/70">Unique identifier for this enrichment request</span>
            </div>
            <div className="flex gap-2">
              <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">status</code>
              <span className="text-[var(--cream)]/70">Request status: <code className="text-xs">pending</code>, <code className="text-xs">processing</code>, <code className="text-xs">completed</code>, or <code className="text-xs">failed</code></span>
            </div>
            <div className="flex gap-2">
              <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">data</code>
              <span className="text-[var(--cream)]/70">Enriched person and company information</span>
            </div>
            <div className="flex gap-2">
              <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">confidence</code>
              <span className="text-[var(--cream)]/70">Confidence scores (0-1) for each field</span>
            </div>
            <div className="flex gap-2">
              <code className="px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">sources</code>
              <span className="text-[var(--cream)]/70">Data sources used for enrichment</span>
            </div>
          </div>
        </div>
      </section>

      {/* What's Next */}
      <section className="space-y-4 p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-xl font-semibold text-[var(--cream)]">What&apos;s next?</h2>
        <p className="text-[var(--cream)]/70">
          Now that you&apos;ve made your first enrichment request, explore more features:
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/concepts/enrichment"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <Send className="w-5 h-5 text-[var(--turquoise)]" />
            <div>
              <p className="font-medium text-[var(--cream)]">How Enrichment Works</p>
              <p className="text-sm text-[var(--cream)]/60">Understand confidence scores & sources</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/guides/hubspot"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <CheckCircle2 className="w-5 h-5 text-[var(--turquoise)]" />
            <div>
              <p className="font-medium text-[var(--cream)]">Connect HubSpot</p>
              <p className="text-sm text-[var(--cream)]/60">Sync enriched data to your CRM</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
