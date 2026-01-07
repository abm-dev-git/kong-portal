import { EndpointCard } from "@/components/api-reference";
import { Building2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "CRM Integrations API - ABM.dev",
  description: "Configure and manage CRM integrations for HubSpot, Salesforce, and more",
};

export default function IntegrationsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
            <Building2 className="w-6 h-6 text-[var(--turquoise)]" />
          </div>
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            CRM Integrations
          </h1>
        </div>
        <p className="text-lg text-[var(--cream)]/70">
          Configure and manage CRM integrations to automatically sync enriched contact data
          with HubSpot, Salesforce, and other platforms.
        </p>
      </div>

      {/* Related Docs */}
      <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <p className="text-sm text-[var(--cream)]/70">
          <strong className="text-[var(--cream)]">Related:</strong>{" "}
          <Link href="/docs/guides/hubspot" className="text-[var(--turquoise)] hover:underline">
            HubSpot Integration Guide
          </Link>
          {" | "}
          <Link href="/docs/concepts/field-mapping" className="text-[var(--turquoise)] hover:underline">
            Field Mapping
          </Link>
        </p>
      </div>

      {/* Supported CRMs */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <h3 className="text-sm font-medium text-[var(--cream)] mb-3">Supported Platforms</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1.5 rounded text-xs bg-[#ff7a59]/20 text-[#ff7a59] border border-[#ff7a59]/30">HubSpot</span>
          <span className="px-3 py-1.5 rounded text-xs bg-[#00a1e0]/20 text-[#00a1e0] border border-[#00a1e0]/30">Salesforce</span>
          <span className="px-3 py-1.5 rounded text-xs bg-gray-500/20 text-gray-400 border border-gray-500/30">More coming soon</span>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Endpoints</h2>

        {/* List Integrations */}
        <EndpointCard
          id="list"
          method="GET"
          path="/v1/crm/config/integrations"
          title="List Integrations"
          description="Retrieve all configured CRM integrations for your organization, including their connection status and sync settings."
          parameters={[]}
          response={{
            description: "List of configured integrations",
            example: {
              success: true,
              data: [
                {
                  id: "int_hubspot_abc123",
                  platform: "hubspot",
                  status: "connected",
                  portal_id: "12345678",
                  connected_at: "2025-12-01T10:00:00Z",
                  last_sync: "2025-12-15T14:30:00Z",
                  sync_settings: {
                    auto_sync: true,
                    sync_frequency: "realtime",
                    create_new_contacts: true,
                    update_existing: true
                  }
                },
                {
                  id: "int_salesforce_def456",
                  platform: "salesforce",
                  status: "disconnected",
                  instance_url: null,
                  connected_at: null,
                  last_sync: null,
                  sync_settings: null
                }
              ]
            }
          }}
        />

        {/* Configure Integration */}
        <EndpointCard
          id="configure"
          method="POST"
          path="/v1/crm/config/integrations"
          title="Configure Integration"
          description="Configure a new CRM integration or update an existing one. Returns an OAuth URL for platforms requiring authorization."
          parameters={[
            { name: "platform", type: "string", required: true, description: "CRM platform: 'hubspot' or 'salesforce'", location: "body" },
            { name: "auto_sync", type: "boolean", description: "Enable automatic sync of enriched data (default: true)", location: "body" },
            { name: "sync_frequency", type: "string", description: "Sync frequency: 'realtime', 'hourly', 'daily' (default: 'realtime')", location: "body" },
            { name: "create_new_contacts", type: "boolean", description: "Create contacts in CRM if they don't exist (default: true)", location: "body" },
            { name: "update_existing", type: "boolean", description: "Update existing contacts with enriched data (default: true)", location: "body" },
            { name: "field_mapping", type: "object", description: "Custom field mapping configuration", location: "body" },
          ]}
          requestBody={{
            description: "Integration configuration",
            example: {
              platform: "hubspot",
              auto_sync: true,
              sync_frequency: "realtime",
              create_new_contacts: true,
              update_existing: true,
              field_mapping: {
                title: "jobtitle",
                company: "company",
                linkedin_url: "linkedin_url"
              }
            }
          }}
          response={{
            description: "Integration created with OAuth URL if required",
            example: {
              success: true,
              data: {
                id: "int_hubspot_xyz789",
                platform: "hubspot",
                status: "pending_auth",
                oauth_url: "https://app.hubspot.com/oauth/authorize?client_id=...",
                message: "Redirect user to oauth_url to complete authorization"
              }
            }
          }}
        />

        {/* Test Connection */}
        <EndpointCard
          id="test"
          method="POST"
          path="/v1/crm/config/integrations/test"
          title="Test Connection"
          description="Test the connection to a configured CRM integration. Verifies credentials and permissions are valid."
          parameters={[
            { name: "platform", type: "string", required: true, description: "CRM platform to test", location: "body" },
          ]}
          requestBody={{
            description: "Platform to test",
            example: {
              platform: "hubspot"
            }
          }}
          response={{
            description: "Connection test results",
            example: {
              success: true,
              data: {
                platform: "hubspot",
                connected: true,
                portal_id: "12345678",
                portal_name: "ACME Corp",
                permissions: {
                  contacts_read: true,
                  contacts_write: true,
                  companies_read: true,
                  companies_write: true
                },
                latency_ms: 145,
                tested_at: "2025-12-15T10:30:00Z"
              }
            }
          }}
        />

        {/* Delete Integration */}
        <EndpointCard
          id="delete"
          method="DELETE"
          path="/v1/crm/config/integrations/{platform}"
          title="Delete Integration"
          description="Remove a CRM integration and revoke OAuth tokens. This does not delete any data that was synced to the CRM."
          parameters={[
            { name: "platform", type: "string", required: true, description: "CRM platform to disconnect", location: "path" },
          ]}
          response={{
            description: "Confirmation of deletion",
            example: {
              success: true,
              message: "HubSpot integration disconnected successfully",
              data: {
                platform: "hubspot",
                deleted_at: "2025-12-15T10:30:00Z"
              }
            }
          }}
        />
      </div>

      {/* Webhooks Info */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Webhooks</h2>
        <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
          <p className="text-sm text-[var(--cream)]/70 mb-3">
            Receive webhook notifications when integration events occur. Configure your webhook URL in
            the integration settings.
          </p>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">EVENT</span>
              <code className="text-[var(--cream)]/60">integration.connected</code>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">EVENT</span>
              <code className="text-[var(--cream)]/60">integration.disconnected</code>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">EVENT</span>
              <code className="text-[var(--cream)]/60">sync.completed</code>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="px-2 py-0.5 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">EVENT</span>
              <code className="text-[var(--cream)]/60">sync.failed</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
