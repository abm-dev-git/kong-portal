import Link from "next/link";
import { MethodBadge } from "@/components/api-reference";
import { Zap, Briefcase, Building2, Linkedin, Settings, Key, ArrowRight } from "lucide-react";

export const metadata = {
  title: "API Reference - ABM.dev Developer Portal",
  description: "Complete API documentation for ABM.dev enrichment and integration APIs",
};

const apiCategories = [
  {
    title: "Enrichment",
    description: "Enrich contact and company data with comprehensive information from multiple sources.",
    href: "/api-reference/enrichment",
    icon: Zap,
    endpoints: [
      { method: "POST" as const, path: "/v1/enrich", title: "Single enrichment" },
      { method: "POST" as const, path: "/v1/enrich/batch", title: "Batch enrichment" },
    ],
  },
  {
    title: "Jobs",
    description: "Monitor and manage asynchronous enrichment jobs.",
    href: "/api-reference/jobs",
    icon: Briefcase,
    endpoints: [
      { method: "GET" as const, path: "/v1/jobs", title: "List jobs" },
      { method: "GET" as const, path: "/v1/jobs/{id}", title: "Get job details" },
      { method: "GET" as const, path: "/v1/jobs/{id}/results", title: "Get results" },
    ],
  },
  {
    title: "CRM Integrations",
    description: "Configure and manage CRM integrations for HubSpot, Salesforce, and more.",
    href: "/api-reference/integrations",
    icon: Building2,
    endpoints: [
      { method: "GET" as const, path: "/v1/crm/config/integrations", title: "List integrations" },
      { method: "POST" as const, path: "/v1/crm/config/integrations", title: "Configure" },
      { method: "POST" as const, path: "/v1/crm/config/integrations/test", title: "Test connection" },
    ],
  },
  {
    title: "LinkedIn Connection",
    description: "Manage LinkedIn browser sessions for enhanced profile enrichment.",
    href: "/api-reference/linkedin",
    icon: Linkedin,
    endpoints: [
      { method: "POST" as const, path: "/v1/linkedin-connection/initialize", title: "Initialize" },
      { method: "POST" as const, path: "/v1/linkedin-connection/verify", title: "Verify login" },
      { method: "GET" as const, path: "/v1/linkedin-connection/status", title: "Get status" },
    ],
  },
  {
    title: "Configuration",
    description: "Organization settings and health check endpoints.",
    href: "/api-reference/configuration",
    icon: Settings,
    endpoints: [
      { method: "GET" as const, path: "/v1/organization", title: "Get organization" },
      { method: "GET" as const, path: "/v1/status", title: "Health check" },
    ],
  },
];

export default function ApiReferencePage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <h1
          className="text-3xl text-[var(--cream)]"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          API Reference
        </h1>
        <p className="text-lg text-[var(--cream)]/70">
          Complete documentation for the ABM.dev REST API. All endpoints require authentication via API key.
        </p>
      </div>

      {/* Base URL */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <h2 className="text-sm font-medium text-[var(--cream)]/60 mb-2">Base URL</h2>
        <code className="text-[var(--turquoise)] font-mono">https://api.abm.dev</code>
      </div>

      {/* Authentication */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-sm font-medium text-[var(--cream)] mb-2 flex items-center gap-2">
              <Key className="w-4 h-4 text-[var(--turquoise)]" />
              Authentication
            </h2>
            <p className="text-sm text-[var(--cream)]/60 mb-3">
              Include your API key in the <code className="text-[var(--turquoise)]">X-API-Key</code> header with all requests.
            </p>
            <pre className="p-3 rounded bg-[var(--navy)] text-sm font-mono text-[var(--cream)]/80">
              X-API-Key: your_api_key_here
            </pre>
          </div>
          <Link
            href="/dashboard/api-keys"
            className="text-sm text-[var(--turquoise)] hover:underline flex items-center gap-1"
          >
            Get API Key
            <ArrowRight className="w-3 h-3" />
          </Link>
        </div>
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Endpoints</h2>
        <div className="grid gap-4">
          {apiCategories.map((category) => (
            <Link
              key={category.title}
              href={category.href}
              className="group p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
                    <category.icon className="w-5 h-5 text-[var(--turquoise)]" />
                  </div>
                  <div>
                    <h3 className="font-medium text-[var(--cream)] group-hover:text-[var(--turquoise)] transition-colors">
                      {category.title}
                    </h3>
                    <p className="text-sm text-[var(--cream)]/60">{category.description}</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-[var(--cream)]/40 group-hover:text-[var(--turquoise)] group-hover:translate-x-1 transition-all" />
              </div>
              <div className="flex flex-wrap gap-2">
                {category.endpoints.map((endpoint) => (
                  <div
                    key={`${endpoint.method}-${endpoint.path}`}
                    className="flex items-center gap-2 px-2 py-1 rounded bg-[var(--navy)] text-xs"
                  >
                    <MethodBadge method={endpoint.method} className="text-[10px] px-1" />
                    <code className="text-[var(--cream)]/60 font-mono">{endpoint.path}</code>
                  </div>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Rate Limits */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <h2 className="text-sm font-medium text-[var(--cream)] mb-2">Rate Limits</h2>
        <p className="text-sm text-[var(--cream)]/60">
          API requests are rate limited based on your plan. Free tier: 100 requests/minute.
          Pro tier: 1,000 requests/minute. Enterprise: Custom limits.
        </p>
      </div>
    </div>
  );
}
