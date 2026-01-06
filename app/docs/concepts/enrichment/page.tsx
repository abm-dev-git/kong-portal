import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/docs/Callout";
import {
  Clock,
  Zap,
  Database,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Layers,
  Target,
  RefreshCw
} from "lucide-react";

export const metadata = {
  title: "How Enrichment Works - ABM.dev Docs",
  description: "Understanding ABM.dev's multi-source enrichment engine, confidence scores, and data freshness",
};

export default function EnrichmentConceptPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            8 min read
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          How Enrichment Works
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          ABM.dev uses a multi-source enrichment engine that aggregates data from multiple providers to deliver accurate, confidence-scored results.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--turquoise)]" />
          Overview
        </h2>
        <p className="text-[var(--cream)]/70">
          When you submit an enrichment request, ABM.dev queries multiple data sources simultaneously,
          normalizes the results, and returns a unified response with confidence scores indicating
          how reliable each piece of data is.
        </p>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Database className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Multi-Source</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Data from 5+ providers for comprehensive coverage
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Target className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Confidence Scores</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Every field includes a 0-1 confidence rating
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <RefreshCw className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Fresh Data</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Real-time fetching with freshness indicators
            </p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--turquoise)]" />
          The Enrichment Pipeline
        </h2>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Input Normalization</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                Your input data (email, name, company) is normalized and validated.
                Domain names are extracted from emails, and names are parsed into components.
              </p>
              <div className="p-3 rounded bg-[var(--dark-blue)] border border-[var(--turquoise)]/10">
                <code className="text-sm text-[var(--cream)]">
                  jane.smith@acme.com → domain: acme.com, likely name: Jane Smith
                </code>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              2
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Parallel Data Fetching</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                Multiple data sources are queried simultaneously to minimize latency.
                Sources include LinkedIn, company databases, email verification services, and more.
              </p>
              <div className="flex flex-wrap gap-2">
                {["LinkedIn", "Hunter.io", "Clearbit", "Apollo", "Custom Sources"].map((source) => (
                  <Badge
                    key={source}
                    variant="secondary"
                    className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/30"
                  >
                    {source}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Data Fusion</h3>
              <p className="text-[var(--cream)]/70 text-sm">
                Results from all sources are merged using intelligent conflict resolution.
                When sources disagree, we use historical accuracy, recency, and cross-validation
                to determine the most likely correct value.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Confidence Scoring</h3>
              <p className="text-[var(--cream)]/70 text-sm">
                Each field receives a confidence score from 0 to 1, calculated based on:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-[var(--cream)]/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Number of sources that agree
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Historical accuracy of each source
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Recency of the data
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Cross-field validation
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Confidence Scores */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--turquoise)]" />
          Understanding Confidence Scores
        </h2>

        <p className="text-[var(--cream)]/70">
          Confidence scores help you decide how to use enriched data in your workflows.
        </p>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--success-green)]/10 border border-[var(--success-green)]/30">
            <div className="w-16 text-center">
              <span className="text-lg font-bold text-[var(--success-green)]">0.9+</span>
            </div>
            <div>
              <p className="font-medium text-[var(--cream)]">High Confidence</p>
              <p className="text-sm text-[var(--cream)]/60">
                Multiple sources agree. Safe for automated workflows.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--warning-yellow)]/10 border border-[var(--warning-yellow)]/30">
            <div className="w-16 text-center">
              <span className="text-lg font-bold text-[var(--warning-yellow)]">0.7-0.9</span>
            </div>
            <div>
              <p className="font-medium text-[var(--cream)]">Medium Confidence</p>
              <p className="text-sm text-[var(--cream)]/60">
                Good for enrichment, consider human review for critical use cases.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-lg bg-[var(--error-red)]/10 border border-[var(--error-red)]/30">
            <div className="w-16 text-center">
              <span className="text-lg font-bold text-[var(--error-red)]">&lt;0.7</span>
            </div>
            <div>
              <p className="font-medium text-[var(--cream)]">Low Confidence</p>
              <p className="text-sm text-[var(--cream)]/60">
                Limited source agreement. Recommend manual verification.
              </p>
            </div>
          </div>
        </div>

        <Callout type="tip" title="Best Practice">
          Set confidence thresholds in your integration logic. For example, only auto-update CRM
          fields when confidence is above 0.85.
        </Callout>
      </section>

      {/* Data Sources */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--turquoise)]" />
          Data Sources
        </h2>

        <p className="text-[var(--cream)]/70">
          ABM.dev aggregates data from multiple providers, each with different strengths:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--turquoise)]/20">
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Source Type</th>
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Best For</th>
                <th className="text-left py-3 text-[var(--cream)]">Data Freshness</th>
              </tr>
            </thead>
            <tbody className="text-[var(--cream)]/70">
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">Social Networks</td>
                <td className="py-3 pr-4">Current job title, profile photo, connections</td>
                <td className="py-3">Real-time</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">Company Databases</td>
                <td className="py-3 pr-4">Company size, funding, industry</td>
                <td className="py-3">Weekly updates</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">Email Verification</td>
                <td className="py-3 pr-4">Email validity, deliverability</td>
                <td className="py-3">Real-time</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">Technographics</td>
                <td className="py-3 pr-4">Tech stack, tools used</td>
                <td className="py-3">Monthly scans</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Continue Learning</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/concepts/authentication"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Authentication</p>
              <p className="text-sm text-[var(--cream)]/60">Learn about API keys & JWT tokens</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/api-reference"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">API Reference</p>
              <p className="text-sm text-[var(--cream)]/60">Full API documentation</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
