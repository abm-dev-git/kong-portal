import { EndpointCard } from "@/components/api-reference";
import { Linkedin } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "LinkedIn Connection API - ABM.dev",
  description: "Manage LinkedIn browser sessions for enhanced profile enrichment",
};

export default function LinkedInPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
            <Linkedin className="w-6 h-6 text-[var(--turquoise)]" />
          </div>
          <h1
            className="text-3xl text-[var(--cream)]"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            LinkedIn Connection
          </h1>
        </div>
        <p className="text-lg text-[var(--cream)]/70">
          Manage LinkedIn browser sessions to enable enhanced profile enrichment. LinkedIn connections
          provide higher quality data including profile photos, recent activity, and verified information.
        </p>
      </div>

      {/* Related Docs */}
      <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <p className="text-sm text-[var(--cream)]/70">
          <strong className="text-[var(--cream)]">Related:</strong>{" "}
          <Link href="/docs/guides/linkedin" className="text-[var(--turquoise)] hover:underline">
            LinkedIn Integration Guide
          </Link>
          {" | "}
          <Link href="/docs/concepts/data-sources" className="text-[var(--turquoise)] hover:underline">
            Data Sources
          </Link>
        </p>
      </div>

      {/* Connection Flow */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <h3 className="text-sm font-medium text-[var(--cream)] mb-3">Connection Flow</h3>
        <div className="flex items-center gap-2 text-sm text-[var(--cream)]/70 flex-wrap">
          <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">1. Initialize</span>
          <span className="text-[var(--cream)]/40">→</span>
          <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">2. User Login</span>
          <span className="text-[var(--cream)]/40">→</span>
          <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">3. Verify</span>
          <span className="text-[var(--cream)]/40">→</span>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">4. Connected</span>
        </div>
      </div>

      {/* Endpoints */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Endpoints</h2>

        {/* Initialize */}
        <EndpointCard
          id="initialize"
          method="POST"
          path="/v1/linkedin-connection/initialize"
          title="Initialize Connection"
          description="Start a new LinkedIn connection session. Returns a browser session URL where the user can log in to their LinkedIn account."
          parameters={[]}
          response={{
            description: "Session initialization with connect URL",
            example: {
              success: true,
              data: {
                session_id: "sess_abc123xyz",
                connect_url: "https://browser.abm.dev/session/sess_abc123xyz",
                expires_at: "2025-12-15T10:45:00Z",
                status: "awaiting_login"
              }
            }
          }}
        />

        {/* Verify */}
        <EndpointCard
          id="verify"
          method="POST"
          path="/v1/linkedin-connection/verify"
          title="Verify Login"
          description="Verify that the user has successfully logged in to LinkedIn. Call this after the user completes the login flow in the browser session."
          parameters={[
            { name: "session_id", type: "string", required: true, description: "Session ID from initialize response", location: "body" },
          ]}
          requestBody={{
            description: "Session to verify",
            example: {
              session_id: "sess_abc123xyz"
            }
          }}
          response={{
            description: "Verification result",
            example: {
              success: true,
              data: {
                verified: true,
                linkedin_profile: {
                  name: "John Doe",
                  headline: "Software Engineer at Example Corp",
                  profile_url: "https://linkedin.com/in/johndoe"
                },
                connection_status: "connected",
                expires_at: "2025-12-22T10:30:00Z"
              }
            }
          }}
        />

        {/* Get Status */}
        <EndpointCard
          id="status"
          method="GET"
          path="/v1/linkedin-connection/status"
          title="Get Connection Status"
          description="Check the current status of your LinkedIn connection, including session health and expiration."
          parameters={[]}
          response={{
            description: "Current connection status",
            example: {
              success: true,
              data: {
                connected: true,
                status: "active",
                linkedin_profile: {
                  name: "John Doe",
                  headline: "Software Engineer at Example Corp",
                  profile_url: "https://linkedin.com/in/johndoe"
                },
                connected_at: "2025-12-15T10:30:00Z",
                expires_at: "2025-12-22T10:30:00Z",
                enrichments_today: 45,
                daily_limit: 100
              }
            }
          }}
        />

        {/* Check Availability */}
        <EndpointCard
          id="availability"
          method="GET"
          path="/v1/linkedin-connection/availability"
          title="Check Availability"
          description="Check if a browser session is available for a new LinkedIn connection. Sessions are limited to prevent rate limiting."
          parameters={[]}
          response={{
            description: "Session availability status",
            example: {
              success: true,
              data: {
                available: true,
                active_sessions: 0,
                max_sessions: 1,
                estimated_wait_time: null
              }
            }
          }}
        />

        {/* Disconnect */}
        <EndpointCard
          id="disconnect"
          method="DELETE"
          path="/v1/linkedin-connection"
          title="Disconnect"
          description="Disconnect your LinkedIn session and clear stored credentials. You will need to re-authenticate to use LinkedIn enrichment."
          parameters={[]}
          response={{
            description: "Confirmation of disconnection",
            example: {
              success: true,
              message: "LinkedIn connection disconnected successfully",
              data: {
                disconnected_at: "2025-12-15T10:30:00Z"
              }
            }
          }}
        />

        {/* Cleanup Sessions (Admin) */}
        <EndpointCard
          id="cleanup"
          method="POST"
          path="/v1/linkedin-connection/sessions/cleanup"
          title="Cleanup Sessions"
          description="Force cleanup of stale browser sessions. Use this if you're getting 'session limit reached' errors. Admin operation."
          parameters={[]}
          response={{
            description: "Cleanup results",
            example: {
              success: true,
              data: {
                cleaned_sessions: 1,
                total_found: 1,
                message: "Successfully cleaned up 1 stale session(s)"
              }
            }
          }}
        />
      </div>

      {/* Rate Limits */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Rate Limits</h2>
        <div className="rounded-lg border border-[var(--turquoise)]/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--dark-blue)]/50 border-b border-[var(--turquoise)]/20">
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Limit Type</th>
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Value</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3 text-[var(--cream)]/70">Concurrent sessions</td>
                <td className="p-3"><code className="text-[var(--turquoise)]">1</code></td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3 text-[var(--cream)]/70">Enrichments per day</td>
                <td className="p-3"><code className="text-[var(--turquoise)]">100</code></td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3 text-[var(--cream)]/70">Session timeout</td>
                <td className="p-3"><code className="text-[var(--turquoise)]">15 minutes</code></td>
              </tr>
              <tr>
                <td className="p-3 text-[var(--cream)]/70">Connection expiry</td>
                <td className="p-3"><code className="text-[var(--turquoise)]">7 days</code></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Troubleshooting */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Troubleshooting</h2>
        <div className="rounded-lg border border-[var(--turquoise)]/20 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[var(--dark-blue)]/50 border-b border-[var(--turquoise)]/20">
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Error</th>
                <th className="text-left p-3 text-[var(--cream)]/60 font-medium">Solution</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-amber-400">SESSION_LIMIT_REACHED</code></td>
                <td className="p-3 text-[var(--cream)]/70">Call /sessions/cleanup endpoint or wait for current session to expire</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-amber-400">SESSION_EXPIRED</code></td>
                <td className="p-3 text-[var(--cream)]/70">Initialize a new session and complete login again</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="p-3"><code className="text-amber-400">VERIFICATION_FAILED</code></td>
                <td className="p-3 text-[var(--cream)]/70">Ensure LinkedIn login was completed successfully in the browser</td>
              </tr>
              <tr>
                <td className="p-3"><code className="text-amber-400">RATE_LIMITED</code></td>
                <td className="p-3 text-[var(--cream)]/70">Daily enrichment limit reached, wait until reset at midnight UTC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
