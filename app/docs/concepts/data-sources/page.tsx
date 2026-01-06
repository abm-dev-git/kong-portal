import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/docs/Callout";
import {
  Clock,
  Database,
  Linkedin,
  Mail,
  Search,
  Globe,
  ArrowRight,
  CheckCircle2,
  Zap
} from "lucide-react";

export const metadata = {
  title: "Data Sources - ABM.dev Docs",
  description: "Learn about the data sources ABM.dev uses for enrichment",
};

const sources = [
  {
    name: "LinkedIn",
    icon: <Linkedin className="w-6 h-6" />,
    color: "#0A66C2",
    method: "Browserbase",
    dataType: "Profile data",
    fields: [
      "Current job title and company",
      "Work history (last 5 positions)",
      "Education history",
      "Skills and endorsements",
      "Profile photo URL",
      "Recent activity and posts"
    ],
    confidence: "90-98",
    freshness: "Real-time",
    requirements: "LinkedIn connection via Browserbase"
  },
  {
    name: "Hunter.io",
    icon: <Mail className="w-6 h-6" />,
    color: "#FF6B00",
    method: "API",
    dataType: "Email intelligence",
    fields: [
      "Email verification",
      "Deliverability status",
      "Email pattern detection",
      "Domain search",
      "Company email format"
    ],
    confidence: "85-95",
    freshness: "Real-time",
    requirements: "Included in all plans"
  },
  {
    name: "Perplexity",
    icon: <Search className="w-6 h-6" />,
    color: "#20B2AA",
    method: "AI Research",
    dataType: "Company intelligence",
    fields: [
      "Company background",
      "Recent news and announcements",
      "Funding and financials",
      "Products and services",
      "Competitive landscape"
    ],
    confidence: "70-85",
    freshness: "Near real-time",
    requirements: "Included in all plans"
  },
  {
    name: "Tavily",
    icon: <Globe className="w-6 h-6" />,
    color: "#6366F1",
    method: "Web Search",
    dataType: "Web presence",
    fields: [
      "Company website data",
      "Social media presence",
      "Press mentions",
      "Industry associations",
      "Public records"
    ],
    confidence: "65-80",
    freshness: "Weekly crawls",
    requirements: "Included in all plans"
  }
];

export default function DataSourcesPage() {
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
          Data Sources
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          ABM.dev aggregates data from multiple sources to provide comprehensive, accurate
          enrichment. Each source has different strengths and confidence levels.
        </p>
      </div>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--turquoise)]" />
          Multi-Source Enrichment
        </h2>

        <p className="text-[var(--cream)]/70">
          When you submit an enrichment request, ABM.dev queries multiple sources in parallel:
        </p>

        <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
          <ol className="space-y-3 text-[var(--cream)]/70">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-xs">1</span>
              <span><strong className="text-[var(--cream)]">Source Portfolio Analysis</strong> — We evaluate which sources can provide data based on your input (email, domain, LinkedIn URL)</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-xs">2</span>
              <span><strong className="text-[var(--cream)]">Parallel Fetching</strong> — All available sources are queried simultaneously for speed</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-xs">3</span>
              <span><strong className="text-[var(--cream)]">Data Fusion</strong> — Results are merged, with conflicts resolved by source reliability and recency</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[var(--turquoise)] flex items-center justify-center text-[var(--dark-blue)] font-bold text-xs">4</span>
              <span><strong className="text-[var(--cream)]">AI Synthesis</strong> — Our AI generates summaries, insights, and persona matching from the merged evidence</span>
            </li>
          </ol>
        </div>
      </section>

      {/* Source Cards */}
      <section className="space-y-6">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--turquoise)]" />
          Available Sources
        </h2>

        <div className="grid gap-6">
          {sources.map((source) => (
            <div
              key={source.name}
              className="p-6 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20"
            >
              <div className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${source.color}20`, color: source.color }}
                >
                  {source.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-[var(--cream)]">{source.name}</h3>
                    <Badge variant="secondary" className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/20">
                      {source.method}
                    </Badge>
                  </div>
                  <p className="text-sm text-[var(--cream)]/60 mb-4">{source.dataType}</p>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium text-[var(--cream)]/40 uppercase mb-2">Fields Provided</p>
                      <ul className="space-y-1">
                        {source.fields.map((field) => (
                          <li key={field} className="flex items-center gap-2 text-sm text-[var(--cream)]/70">
                            <CheckCircle2 className="w-3 h-3 text-[var(--turquoise)]" />
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-[var(--cream)]/40 uppercase mb-1">Confidence Range</p>
                        <p className="text-sm text-[var(--cream)]">{source.confidence}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--cream)]/40 uppercase mb-1">Data Freshness</p>
                        <p className="text-sm text-[var(--cream)]">{source.freshness}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-[var(--cream)]/40 uppercase mb-1">Requirements</p>
                        <p className="text-sm text-[var(--cream)]/70">{source.requirements}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Source Portfolio Tiers */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Source Portfolio Quality</h2>

        <p className="text-[var(--cream)]/70">
          Before enrichment begins, we analyze what sources can contribute based on your input:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--turquoise)]/20">
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Tier</th>
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Score</th>
                <th className="text-left py-3 text-[var(--cream)]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[var(--cream)]/70">
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">
                  <Badge className="bg-[var(--success-green)]/10 text-[var(--success-green)] border-[var(--success-green)]/30">
                    Excellent
                  </Badge>
                </td>
                <td className="py-3 pr-4">≥0.85</td>
                <td className="py-3">All key sources available (LinkedIn + email + company)</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">
                  <Badge className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/30">
                    Very Good
                  </Badge>
                </td>
                <td className="py-3 pr-4">≥0.70</td>
                <td className="py-3">Most sources available, high-quality enrichment expected</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">
                  <Badge className="bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] border-[var(--electric-blue)]/30">
                    Good
                  </Badge>
                </td>
                <td className="py-3 pr-4">≥0.50</td>
                <td className="py-3">Core sources available, solid enrichment</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4">
                  <Badge className="bg-[var(--warning-yellow)]/10 text-[var(--warning-yellow)] border-[var(--warning-yellow)]/30">
                    Moderate
                  </Badge>
                </td>
                <td className="py-3 pr-4">≥0.30</td>
                <td className="py-3">Limited sources, basic enrichment possible</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <Badge className="bg-[var(--error-red)]/10 text-[var(--error-red)] border-[var(--error-red)]/30">
                    Poor
                  </Badge>
                </td>
                <td className="py-3 pr-4">&lt;0.30</td>
                <td className="py-3">Insufficient data, enrichment may fail or be incomplete</td>
              </tr>
            </tbody>
          </table>
        </div>

        <Callout type="tip" title="Improve Your Portfolio Score">
          Provide more input data to increase your portfolio score:
          <ul className="mt-2 space-y-1">
            <li>• Include LinkedIn profile URLs for person enrichment</li>
            <li>• Provide company domain for company enrichment</li>
            <li>• Connect LinkedIn via Browserbase for real-time access</li>
          </ul>
        </Callout>
      </section>

      {/* Source Selection */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Controlling Source Selection</h2>

        <p className="text-[var(--cream)]/70">
          You can control which sources are used in your enrichment requests:
        </p>

        <div className="p-4 rounded-lg bg-[var(--dark-blue)] border border-[var(--turquoise)]/20">
          <pre className="text-sm text-[var(--cream)] overflow-x-auto">
            <code>{`// Request with specific sources
{
  "email": "jane@acme.com",
  "sources": ["linkedin", "hunter"],  // Only use these sources
  "require_linkedin": true            // Fail if LinkedIn unavailable
}

// Request with all available sources (default)
{
  "email": "jane@acme.com"
  // All enabled sources will be used
}`}</code>
          </pre>
        </div>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Related Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/guides/linkedin"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">LinkedIn Integration</p>
              <p className="text-sm text-[var(--cream)]/60">Connect via Browserbase</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/concepts/confidence-scores"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Confidence Scores</p>
              <p className="text-sm text-[var(--cream)]/60">Understand source reliability</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
