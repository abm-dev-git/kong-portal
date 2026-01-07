import { EndpointCard } from "@/components/api-reference";
import { Settings } from "lucide-react";

export const metadata = {
  title: "Configuration API - ABM.dev",
  description: "Organization settings and health check endpoints",
};

export default function ConfigurationPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
            <Settings className="w-6 h-6 text-[var(--turquoise)]" />
          </div>
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Configuration
          </h1>
        </div>
        <p className="text-lg text-[var(--cream)]/70">
          Organization settings, API status, and health check endpoints for monitoring
          your ABM.dev integration.
        </p>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Endpoints</h2>

        {/* Get Organization */}
        <EndpointCard
          id="organization"
          method="GET"
          path="/v1/organization"
          title="Get Organization"
          description="Retrieve details about your organization including plan, usage limits, and feature flags."
          parameters={[]}
          response={{
            description: "Organization details and settings",
            example: {
              success: true,
              data: {
                id: "org_abc123xyz",
                name: "ACME Corporation",
                slug: "acme-corp",
                plan: "pro",
                created_at: "2025-01-15T10:00:00Z",
                limits: {
                  enrichments_per_month: 10000,
                  api_requests_per_minute: 1000,
                  team_members: 10,
                  integrations: 5
                },
                usage: {
                  enrichments_this_month: 2456,
                  api_requests_today: 1892,
                  team_members: 4,
                  active_integrations: 2
                },
                features: {
                  batch_enrichment: true,
                  linkedin_enrichment: true,
                  crm_integrations: true,
                  webhooks: true,
                  custom_fields: true,
                  api_access: true
                },
                settings: {
                  default_enrichment_fields: ["email", "name", "title", "company", "linkedin"],
                  auto_enrich_new_contacts: false,
                  webhook_url: "https://yourapp.com/webhooks/abmdev"
                }
              }
            }
          }}
        />

        {/* Health Check */}
        <EndpointCard
          id="status"
          method="GET"
          path="/v1/status"
          title="Health Check"
          description="Check the API status and health of all services. Use for monitoring and uptime checks."
          parameters={[]}
          response={{
            description: "Service health status",
            example: {
              success: true,
              status: "healthy",
              version: "1.2.3",
              timestamp: "2025-12-15T10:30:00Z",
              services: {
                api: "healthy",
                database: "healthy",
                enrichment: "healthy",
                browser_pool: "healthy",
                integrations: "healthy"
              },
              latency: {
                api_ms: 12,
                database_ms: 3,
                enrichment_ms: 145
              }
            }
          }}
        />

        {/* Update Organization Settings */}
        <EndpointCard
          id="update-settings"
          method="PATCH"
          path="/v1/organization/settings"
          title="Update Settings"
          description="Update organization settings like default enrichment fields, auto-enrichment, and webhook configuration."
          parameters={[
            { name: "default_enrichment_fields", type: "array", description: "Default fields to enrich for all contacts", location: "body" },
            { name: "auto_enrich_new_contacts", type: "boolean", description: "Automatically enrich new contacts from CRM", location: "body" },
            { name: "webhook_url", type: "string", description: "URL to receive webhook notifications", location: "body" },
            { name: "webhook_events", type: "array", description: "Events to send webhooks for", location: "body" },
          ]}
          requestBody={{
            description: "Settings to update",
            example: {
              default_enrichment_fields: ["email", "name", "title", "company", "linkedin", "phone"],
              auto_enrich_new_contacts: true,
              webhook_url: "https://yourapp.com/webhooks/abmdev",
              webhook_events: ["enrichment.completed", "job.completed", "integration.sync"]
            }
          }}
          response={{
            description: "Updated settings",
            example: {
              success: true,
              message: "Organization settings updated successfully",
              data: {
                default_enrichment_fields: ["email", "name", "title", "company", "linkedin", "phone"],
                auto_enrich_new_contacts: true,
                webhook_url: "https://yourapp.com/webhooks/abmdev",
                webhook_events: ["enrichment.completed", "job.completed", "integration.sync"],
                updated_at: "2025-12-15T10:30:00Z"
              }
            }
          }}
        />
      </div>

      {/* API Keys Info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">API Key Management</h2>
        <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
          <p className="text-sm text-[var(--cream)]/70 mb-3">
            API keys are managed through the developer portal dashboard, not via API.
            This ensures proper audit logging and security controls.
          </p>
          <div className="flex gap-4 text-sm">
            <a href="/api-keys" className="text-[var(--turquoise)] hover:underline">
              Manage API Keys →
            </a>
          </div>
        </div>
      </div>

      {/* Webhooks */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Webhook Events</h2>
        <div className="rounded-lg border border-[var(--turquoise)]/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--dark-blue)]/50 border-b border-[var(--turquoise)]/20">
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Event</th>
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-[var(--turquoise)]">enrichment.completed</code></td>
                <td className="p-3 text-[var(--cream)]/70">Single contact enrichment completed</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-[var(--turquoise)]">job.completed</code></td>
                <td className="p-3 text-[var(--cream)]/70">Batch enrichment job completed</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-[var(--turquoise)]">job.failed</code></td>
                <td className="p-3 text-[var(--cream)]/70">Batch enrichment job failed</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-[var(--turquoise)]">integration.connected</code></td>
                <td className="p-3 text-[var(--cream)]/70">CRM integration connected</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-[var(--turquoise)]">integration.disconnected</code></td>
                <td className="p-3 text-[var(--cream)]/70">CRM integration disconnected</td>
              </tr>
              <tr>
                <td className="p-3"><code className="text-[var(--turquoise)]">integration.sync</code></td>
                <td className="p-3 text-[var(--cream)]/70">CRM sync completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhook Payload */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Webhook Payload Format</h2>
        <div className="rounded-lg overflow-hidden border border-[var(--turquoise)]/20 bg-[var(--navy)]">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--turquoise)]/10 bg-[var(--dark-blue)]/50">
            <span className="text-xs font-medium text-[var(--cream)]/60">Example Webhook Payload</span>
          </div>
          <pre className="p-4 overflow-x-auto text-sm">
            <code className="text-[var(--cream)]/80 font-mono">{`{
  "event": "enrichment.completed",
  "timestamp": "2025-12-15T10:30:00Z",
  "organization_id": "org_abc123xyz",
  "data": {
    "contact_email": "john@example.com",
    "enrichment_id": "enr_xyz789",
    "fields_enriched": ["title", "company", "linkedin"],
    "confidence_score": 0.94
  },
  "signature": "sha256=..."
}`}</code>
          </pre>
        </div>
        <p className="text-sm text-[var(--cream)]/60">
          Verify webhook authenticity by checking the <code className="text-[var(--turquoise)]">X-ABM-Signature</code> header
          against the payload using your webhook secret.
        </p>
      </div>
    </div>
  );
}
