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
  RefreshCw,
  Sparkles,
  Shield,
  BarChart3,
  Brain
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
            12 min read
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          How Enrichment Works
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          ABM.dev uses a sophisticated multi-source enrichment engine that gathers evidence from multiple providers,
          synthesizes insights with AI, and delivers 90 standardized fields with confidence scores.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--turquoise)]" />
          Overview
        </h2>
        <p className="text-[var(--cream)]/70">
          When you submit an enrichment request, ABM.dev runs a sophisticated pipeline: analyzing source availability,
          gathering evidence in parallel from multiple providers, synthesizing insights with AI, and outputting
          90 standardized canonical fields with per-field confidence scores.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Database className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Multi-Source</h3>
            <p className="text-sm text-[var(--cream)]/60">
              4+ providers queried in parallel for comprehensive coverage
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Brain className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">AI Synthesis</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Intelligent merging with narrative generation and persona matching
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Target className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">90 Fields</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Standardized canonical fields with per-field confidence
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <RefreshCw className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">CRM Sync</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Automatic field mapping and writeback to HubSpot, Salesforce
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

        <p className="text-[var(--cream)]/70">
          Every enrichment request flows through a 6-stage pipeline designed for maximum accuracy and efficiency:
        </p>

        <div className="space-y-6">
          {/* Step 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              1
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Input Normalization</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                Your input data (email, name, company, LinkedIn URL) is normalized and validated.
                Domain names are extracted from emails, names are parsed into components, and
                LinkedIn URLs are standardized.
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
              <h3 className="font-medium text-[var(--cream)] mb-2">Source Portfolio Analysis</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                Before querying any sources, we analyze which providers can contribute based on your input.
                This produces a portfolio score predicting enrichment quality.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--turquoise)]/20">
                      <th className="text-left py-2 pr-4 text-[var(--cream)]">Tier</th>
                      <th className="text-left py-2 pr-4 text-[var(--cream)]">Score</th>
                      <th className="text-left py-2 text-[var(--cream)]">Meaning</th>
                    </tr>
                  </thead>
                  <tbody className="text-[var(--cream)]/70">
                    <tr className="border-b border-[var(--turquoise)]/10">
                      <td className="py-2 pr-4">
                        <Badge className="bg-[var(--success-green)]/10 text-[var(--success-green)]">Excellent</Badge>
                      </td>
                      <td className="py-2 pr-4">≥0.85</td>
                      <td className="py-2">All key sources available (LinkedIn + email + company)</td>
                    </tr>
                    <tr className="border-b border-[var(--turquoise)]/10">
                      <td className="py-2 pr-4">
                        <Badge className="bg-[var(--turquoise)]/10 text-[var(--turquoise)]">Very Good</Badge>
                      </td>
                      <td className="py-2 pr-4">≥0.70</td>
                      <td className="py-2">Most sources available, high-quality expected</td>
                    </tr>
                    <tr className="border-b border-[var(--turquoise)]/10">
                      <td className="py-2 pr-4">
                        <Badge className="bg-[var(--warning-yellow)]/10 text-[var(--warning-yellow)]">Moderate</Badge>
                      </td>
                      <td className="py-2 pr-4">≥0.50</td>
                      <td className="py-2">Core sources available, solid enrichment</td>
                    </tr>
                    <tr>
                      <td className="py-2 pr-4">
                        <Badge className="bg-[var(--error-red)]/10 text-[var(--error-red)]">Poor</Badge>
                      </td>
                      <td className="py-2 pr-4">&lt;0.50</td>
                      <td className="py-2">Limited sources, may need more input data</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Parallel Evidence Gathering</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                All available sources are queried simultaneously to minimize latency.
                Each source returns evidence with its own confidence level.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "LinkedIn", color: "#0A66C2" },
                  { name: "Hunter.io", color: "#FF6B00" },
                  { name: "Perplexity", color: "#20B2AA" },
                  { name: "Tavily", color: "#6366F1" },
                ].map((source) => (
                  <Badge
                    key={source.name}
                    variant="secondary"
                    className="border"
                    style={{
                      backgroundColor: `${source.color}20`,
                      color: source.color,
                      borderColor: `${source.color}50`
                    }}
                  >
                    {source.name}
                  </Badge>
                ))}
              </div>
              <p className="text-[var(--cream)]/50 text-xs mt-2">
                See <Link href="/docs/concepts/data-sources" className="text-[var(--turquoise)] hover:underline">Data Sources</Link> for details on each provider.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              4
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">AI Synthesis</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                Evidence from all sources is merged using AI models that resolve conflicts,
                generate narrative fields, and match buyer personas. This stage:
              </p>
              <ul className="space-y-1 text-sm text-[var(--cream)]/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Resolves conflicting data using source reliability and recency
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Generates summaries, highlights, and outreach angles
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Matches against your buyer personas with confidence scoring
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  Calculates ICP fit scores for companies
                </li>
              </ul>
              <Callout type="tip" title="AI Models">
                By default, synthesis uses Claude Sonnet for generation and Claude Haiku for auditing.
                See <Link href="/docs/advanced/enrichment-config" className="text-[var(--turquoise)] hover:underline">Advanced Configuration</Link> to customize models.
              </Callout>
            </div>
          </div>

          {/* Step 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              5
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Projection & Validation</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                Synthesized data is projected into 90 canonical fields. Each field receives:
              </p>
              <ul className="space-y-1 text-sm text-[var(--cream)]/70">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  <strong className="text-[var(--cream)]">Confidence score (0-100)</strong> — how reliable is this value?
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  <strong className="text-[var(--cream)]">Source attribution</strong> — which sources contributed?
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
                  <strong className="text-[var(--cream)]">Freshness timestamp</strong> — when was data last verified?
                </li>
              </ul>
              <p className="text-[var(--cream)]/50 text-xs mt-2">
                See <Link href="/docs/concepts/canonical-fields" className="text-[var(--turquoise)] hover:underline">Canonical Fields</Link> for the complete field reference.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-sm">
              6
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--cream)] mb-2">Field Mapping & Writeback</h3>
              <p className="text-[var(--cream)]/70 text-sm mb-2">
                If CRM integration is enabled, canonical fields are transformed and written to your CRM
                using configurable field mappings. Transformations can format, concat, split, or convert values.
              </p>
              <div className="p-3 rounded bg-[var(--dark-blue)] border border-[var(--turquoise)]/10">
                <code className="text-sm text-[var(--cream)]">
                  canonical: title → hubspot: jobtitle → &quot;VP of Engineering&quot;
                </code>
              </div>
              <p className="text-[var(--cream)]/50 text-xs mt-2">
                See <Link href="/docs/concepts/field-mapping" className="text-[var(--turquoise)] hover:underline">Field Mapping</Link> for transformation options.
              </p>
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
            href="/docs/concepts/canonical-fields"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Canonical Fields</p>
              <p className="text-sm text-[var(--cream)]/60">All 90 enrichment fields reference</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/concepts/confidence-scores"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Confidence Scores</p>
              <p className="text-sm text-[var(--cream)]/60">Understanding data quality metrics</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/concepts/data-sources"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Data Sources</p>
              <p className="text-sm text-[var(--cream)]/60">Where enrichment data comes from</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/advanced/enrichment-config"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Advanced Configuration</p>
              <p className="text-sm text-[var(--cream)]/60">Fine-tune models, sources & thresholds</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
