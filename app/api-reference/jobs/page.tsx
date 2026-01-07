import { EndpointCard } from "@/components/api-reference";
import { Briefcase } from "lucide-react";

export const metadata = {
  title: "Jobs API - ABM.dev",
  description: "Monitor and manage asynchronous enrichment jobs",
};

export default function JobsPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
            <Briefcase className="w-6 h-6 text-[var(--turquoise)]" />
          </div>
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Jobs
          </h1>
        </div>
        <p className="text-lg text-[var(--cream)]/70">
          Monitor and manage asynchronous enrichment jobs. Jobs are created when using batch enrichment
          and can be polled for status and results.
        </p>
      </div>

      {/* Job Statuses */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <h3 className="text-sm font-medium text-[var(--cream)] mb-3">Job Statuses</h3>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-1 rounded text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30">queued</span>
          <span className="px-2 py-1 rounded text-xs bg-amber-500/20 text-amber-400 border border-amber-500/30">processing</span>
          <span className="px-2 py-1 rounded text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">completed</span>
          <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400 border border-red-500/30">failed</span>
          <span className="px-2 py-1 rounded text-xs bg-purple-500/20 text-purple-400 border border-purple-500/30">partial</span>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Endpoints</h2>

        {/* List Jobs */}
        <EndpointCard
          id="list"
          method="GET"
          path="/v1/jobs"
          title="List Jobs"
          description="Retrieve a list of enrichment jobs for your organization. Supports pagination and filtering by status."
          parameters={[
            { name: "status", type: "string", description: "Filter by job status (queued, processing, completed, failed)", location: "query" },
            { name: "limit", type: "number", description: "Number of jobs to return (default: 20, max: 100)", location: "query" },
            { name: "offset", type: "number", description: "Number of jobs to skip for pagination", location: "query" },
          ]}
          response={{
            description: "List of jobs with pagination info",
            example: {
              success: true,
              data: [
                {
                  id: "job_abc123xyz",
                  status: "completed",
                  contacts_count: 50,
                  enriched_count: 48,
                  failed_count: 2,
                  created_at: "2025-12-15T10:30:00Z",
                  completed_at: "2025-12-15T10:32:15Z"
                },
                {
                  id: "job_def456uvw",
                  status: "processing",
                  contacts_count: 100,
                  enriched_count: 45,
                  failed_count: 0,
                  created_at: "2025-12-15T10:35:00Z",
                  completed_at: null
                }
              ],
              pagination: {
                total: 156,
                limit: 20,
                offset: 0,
                has_more: true
              }
            }
          }}
        />

        {/* Get Job */}
        <EndpointCard
          id="get"
          method="GET"
          path="/v1/jobs/{id}"
          title="Get Job Details"
          description="Retrieve detailed information about a specific enrichment job, including progress and any errors."
          parameters={[
            { name: "id", type: "string", required: true, description: "Job ID returned from batch enrichment", location: "path" },
          ]}
          response={{
            description: "Detailed job information",
            example: {
              success: true,
              data: {
                id: "job_abc123xyz",
                status: "completed",
                contacts_count: 50,
                enriched_count: 48,
                failed_count: 2,
                progress_percentage: 100,
                created_at: "2025-12-15T10:30:00Z",
                started_at: "2025-12-15T10:30:05Z",
                completed_at: "2025-12-15T10:32:15Z",
                duration_seconds: 130,
                errors: [
                  { contact_index: 12, email: "invalid@", error: "Invalid email format" },
                  { contact_index: 37, email: "notfound@example.com", error: "No data found" }
                ]
              }
            }
          }}
        />

        {/* Get Job Results */}
        <EndpointCard
          id="results"
          method="GET"
          path="/v1/jobs/{id}/results"
          title="Get Job Results"
          description="Retrieve the enriched contact data from a completed job. Only available for jobs with status 'completed' or 'partial'."
          parameters={[
            { name: "id", type: "string", required: true, description: "Job ID", location: "path" },
            { name: "format", type: "string", description: "Response format: 'json' (default) or 'csv'", location: "query" },
            { name: "include_failed", type: "boolean", description: "Include failed contacts in results (default: false)", location: "query" },
          ]}
          response={{
            description: "Array of enriched contacts",
            example: {
              success: true,
              job_id: "job_abc123xyz",
              data: [
                {
                  original: { email: "john@example.com" },
                  enriched: {
                    email: "john@example.com",
                    full_name: "John Smith",
                    title: "Product Manager",
                    company: "Example Corp",
                    confidence_scores: { email: 1.0, title: 0.92 }
                  },
                  status: "success"
                },
                {
                  original: { email: "jane@acme.com" },
                  enriched: {
                    email: "jane@acme.com",
                    full_name: "Jane Doe",
                    title: "CTO",
                    company: "ACME Inc"
                  },
                  status: "success"
                }
              ],
              total: 48
            }
          }}
        />
      </div>
    </div>
  );
}
