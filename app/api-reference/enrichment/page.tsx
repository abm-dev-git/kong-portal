import { EndpointCard } from "@/components/api-reference";
import { Zap } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Enrichment API - ABM.dev",
  description: "Enrich contact and company data with comprehensive information from multiple sources",
};

export default function EnrichmentPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
            <Zap className="w-6 h-6 text-[var(--turquoise)]" />
          </div>
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Enrichment
          </h1>
        </div>
        <p className="text-lg text-[var(--cream)]/70">
          Enrich contact and company data with comprehensive information from multiple data sources.
          Supports both synchronous single-record and asynchronous batch enrichment.
        </p>
      </div>

      {/* Related Docs */}
      <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <p className="text-sm text-[var(--cream)]/70">
          <strong className="text-[var(--cream)]">Related:</strong>{" "}
          <Link href="/docs/concepts/enrichment" className="text-[var(--turquoise)] hover:underline">
            Enrichment Concepts
          </Link>
          {" | "}
          <Link href="/docs/concepts/canonical-fields" className="text-[var(--turquoise)] hover:underline">
            Canonical Fields
          </Link>
          {" | "}
          <Link href="/docs/concepts/confidence-scores" className="text-[var(--turquoise)] hover:underline">
            Confidence Scores
          </Link>
        </p>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Endpoints</h2>

        {/* Enrich Contact */}
        <EndpointCard
          id="enrich"
          method="POST"
          path="/v1/enrich"
          title="Enrich Contact"
          description="Enrich a single contact with data from multiple sources. Returns enriched data synchronously for quick lookups. For bulk operations, use the batch endpoint."
          parameters={[
            { name: "email", type: "string", required: true, description: "Contact's email address", location: "body" },
            { name: "linkedin_url", type: "string", description: "LinkedIn profile URL for enhanced enrichment", location: "body" },
            { name: "first_name", type: "string", description: "First name to improve matching accuracy", location: "body" },
            { name: "last_name", type: "string", description: "Last name to improve matching accuracy", location: "body" },
            { name: "company", type: "string", description: "Company name for company enrichment", location: "body" },
          ]}
          requestBody={{
            description: "Contact information to enrich",
            example: {
              email: "john.doe@example.com",
              linkedin_url: "https://linkedin.com/in/johndoe",
              first_name: "John",
              last_name: "Doe",
              company: "Example Corp"
            }
          }}
          response={{
            description: "Enriched contact data with confidence scores",
            example: {
              success: true,
              data: {
                email: "john.doe@example.com",
                first_name: "John",
                last_name: "Doe",
                full_name: "John Doe",
                title: "Senior Software Engineer",
                company: "Example Corp",
                company_domain: "example.com",
                linkedin_url: "https://linkedin.com/in/johndoe",
                location: "San Francisco, CA",
                industry: "Technology",
                confidence_scores: {
                  email: 1.0,
                  title: 0.95,
                  company: 0.98,
                  location: 0.85
                },
                sources: ["linkedin", "clearbit", "hunter"],
                enriched_at: "2025-12-15T10:30:00Z"
              }
            }
          }}
        />

        {/* Batch Enrich */}
        <EndpointCard
          id="batch"
          method="POST"
          path="/v1/enrich/batch"
          title="Batch Enrich"
          description="Submit multiple contacts for asynchronous enrichment. Returns a job ID that can be polled for results. Supports up to 100 contacts per batch."
          parameters={[
            { name: "contacts", type: "array", required: true, description: "Array of contact objects to enrich (max 100)", location: "body" },
            { name: "webhook_url", type: "string", description: "URL to receive webhook notification when job completes", location: "body" },
            { name: "priority", type: "string", description: "Job priority: 'normal' (default) or 'high'", location: "body" },
          ]}
          requestBody={{
            description: "Array of contacts to enrich",
            example: {
              contacts: [
                { email: "john@example.com", first_name: "John" },
                { email: "jane@example.com", linkedin_url: "https://linkedin.com/in/jane" },
                { email: "bob@acme.com", company: "ACME Inc" }
              ],
              webhook_url: "https://yourapp.com/webhooks/enrichment",
              priority: "normal"
            }
          }}
          response={{
            description: "Job ID for tracking the batch enrichment",
            example: {
              success: true,
              job_id: "job_abc123xyz",
              status: "queued",
              contacts_count: 3,
              estimated_completion: "2025-12-15T10:35:00Z",
              message: "Batch enrichment job created. Poll /v1/jobs/job_abc123xyz for status."
            }
          }}
        />
      </div>

      {/* Error Codes */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Error Codes</h2>
        <div className="rounded-lg border border-[var(--turquoise)]/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--dark-blue)]/50 border-b border-[var(--turquoise)]/20">
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Code</th>
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Description</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-amber-400">400</code></td>
                <td className="p-3 text-[var(--cream)]/70">Invalid request body or missing required fields</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-amber-400">401</code></td>
                <td className="p-3 text-[var(--cream)]/70">Invalid or missing API key</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-amber-400">422</code></td>
                <td className="p-3 text-[var(--cream)]/70">Invalid email format or LinkedIn URL</td>
              </tr>
              <tr>
                <td className="p-3"><code className="text-amber-400">429</code></td>
                <td className="p-3 text-[var(--cream)]/70">Rate limit exceeded</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
