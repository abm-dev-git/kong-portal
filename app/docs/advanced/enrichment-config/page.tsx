"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
  Clock,
  Settings,
  Cpu,
  Database,
  ArrowRight,
  Sliders,
  Sparkles,
  Shield,
  Gauge
} from "lucide-react";

const configOptions = [
  {
    name: "sources",
    type: "string[]",
    default: '["linkedin", "hunter", "perplexity", "tavily"]',
    description: "Which data sources to query during enrichment",
  },
  {
    name: "require_linkedin",
    type: "boolean",
    default: "false",
    description: "Fail enrichment if LinkedIn data is unavailable",
  },
  {
    name: "enable_auditor",
    type: "boolean",
    default: "true",
    description: "Enable AI auditor to verify enrichment quality",
  },
  {
    name: "min_confidence_to_proceed",
    type: "number",
    default: "0.5",
    description: "Minimum confidence score (0-1) to continue enrichment",
  },
  {
    name: "auto_proceed",
    type: "boolean",
    default: "true",
    description: "Automatically proceed with CRM writeback after enrichment",
  },
  {
    name: "preflight_only",
    type: "boolean",
    default: "false",
    description: "Only run preflight checks, don't execute enrichment",
  },
  {
    name: "enable_hubspot_writeback",
    type: "boolean",
    default: "true",
    description: "Write enriched data back to HubSpot automatically",
  },
];

const modelOptions = [
  {
    name: "Claude Sonnet 4",
    id: "claude-sonnet-4-20250514",
    role: "Writer (default)",
    description: "Fast, high-quality synthesis for generating narrative fields and summaries",
    cost: "$$",
  },
  {
    name: "Claude Opus 4",
    id: "claude-opus-4-20250514",
    role: "Writer (premium)",
    description: "Highest quality output for complex synthesis tasks",
    cost: "$$$",
  },
  {
    name: "Claude Haiku 3.5",
    id: "claude-3-5-haiku-20241022",
    role: "Auditor (default)",
    description: "Fast, efficient verification and quality checks",
    cost: "$",
  },
];

export default function EnrichmentConfigPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            12 min read
          </Badge>
          <Badge variant="secondary" className="bg-[var(--warning-yellow)]/10 text-[var(--warning-yellow)] border-[var(--warning-yellow)]/30">
            Advanced
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          Enrichment Configuration
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          Fine-tune every aspect of the enrichment pipeline. Configure data sources,
          AI models, confidence thresholds, and processing behavior.
        </p>
      </div>

      {/* Configuration Options */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[var(--turquoise)]" />
          Configuration Options
        </h2>

        <p className="text-[var(--cream)]/70">
          Pass these options in your enrichment request to customize behavior:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--turquoise)]/20">
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Option</th>
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Type</th>
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Default</th>
                <th className="text-left py-3 text-[var(--cream)]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[var(--cream)]/70">
              {configOptions.map((option) => (
                <tr key={option.name} className="border-b border-[var(--turquoise)]/10">
                  <td className="py-3 pr-4">
                    <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                      {option.name}
                    </code>
                  </td>
                  <td className="py-3 pr-4 text-[var(--cream)]/50 font-mono text-xs">
                    {option.type}
                  </td>
                  <td className="py-3 pr-4 font-mono text-xs">{option.default}</td>
                  <td className="py-3">{option.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Full Config Example */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Settings className="w-5 h-5 text-[var(--turquoise)]" />
          Full Configuration Example
        </h2>

        <CodeBlock
          title="Complete enrichment configuration"
          examples={{
            javascript: `// Full configuration for enrichment request
const result = await abmdev.enrich({
  // Input data
  email: "jane@acme.com",
  linkedin_url: "linkedin.com/in/janesmith",

  // Source configuration
  sources: ["linkedin", "hunter", "perplexity"],
  require_linkedin: true,

  // AI configuration
  enable_auditor: true,
  models: {
    writer: {
      provider: "anthropic",
      model: "claude-sonnet-4-20250514"
    },
    auditor: {
      provider: "anthropic",
      model: "claude-3-5-haiku-20241022"
    }
  },

  // Custom prompts (optional)
  person_system_prompt: \`You are enriching a B2B contact.
Focus on professional background, decision-making authority,
and technology interests. Be concise.\`,

  // Quality controls
  min_confidence_to_proceed: 0.7,
  auto_proceed: false,        // Review before CRM writeback

  // CRM integration
  enable_hubspot_writeback: true,
  hubspot_contact_id: "12345" // Optional: update specific contact
});`,
            python: `# Full configuration for enrichment request
result = abmdev.enrich(
    # Input data
    email="jane@acme.com",
    linkedin_url="linkedin.com/in/janesmith",

    # Source configuration
    sources=["linkedin", "hunter", "perplexity"],
    require_linkedin=True,

    # AI configuration
    enable_auditor=True,
    models={
        "writer": {
            "provider": "anthropic",
            "model": "claude-sonnet-4-20250514"
        },
        "auditor": {
            "provider": "anthropic",
            "model": "claude-3-5-haiku-20241022"
        }
    },

    # Custom prompts (optional)
    person_system_prompt="""You are enriching a B2B contact.
Focus on professional background, decision-making authority,
and technology interests. Be concise.""",

    # Quality controls
    min_confidence_to_proceed=0.7,
    auto_proceed=False,  # Review before CRM writeback

    # CRM integration
    enable_hubspot_writeback=True,
    hubspot_contact_id="12345"  # Optional: update specific contact
)`,
          }}
        />
      </section>

      {/* AI Model Configuration */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Cpu className="w-5 h-5 text-[var(--turquoise)]" />
          AI Model Configuration
        </h2>

        <p className="text-[var(--cream)]/70">
          ABM.dev uses AI models for two key tasks during enrichment:
        </p>

        <div className="grid gap-4 sm:grid-cols-2 mb-6">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Sparkles className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Writer Model</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Synthesizes evidence from multiple sources into narrative fields like
              summaries, highlights, and outreach angles.
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Shield className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">Auditor Model</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Reviews synthesized output for accuracy, consistency, and quality.
              Catches hallucinations and improves reliability.
            </p>
          </div>
        </div>

        <h3 className="text-lg font-medium text-[var(--cream)]">Available Models</h3>

        <div className="space-y-3">
          {modelOptions.map((model) => (
            <div
              key={model.id}
              className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20"
            >
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h4 className="font-medium text-[var(--cream)]">{model.name}</h4>
                  <code className="text-xs text-[var(--cream)]/50">{model.id}</code>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border-[var(--turquoise)]/20"
                  >
                    {model.role}
                  </Badge>
                  <span className="text-sm text-[var(--warning-yellow)]">{model.cost}</span>
                </div>
              </div>
              <p className="text-sm text-[var(--cream)]/60">{model.description}</p>
            </div>
          ))}
        </div>

        <Callout type="tip" title="Model Selection Guidance">
          <ul className="space-y-1 mt-2">
            <li><strong>High volume:</strong> Sonnet writer + Haiku auditor (default)</li>
            <li><strong>Premium quality:</strong> Opus writer + Sonnet auditor</li>
            <li><strong>Cost optimization:</strong> Haiku writer + no auditor</li>
          </ul>
        </Callout>
      </section>

      {/* Source Configuration */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Database className="w-5 h-5 text-[var(--turquoise)]" />
          Source Configuration
        </h2>

        <p className="text-[var(--cream)]/70">
          Control which data sources are queried during enrichment:
        </p>

        <CodeBlock
          title="Source selection examples"
          examples={{
            javascript: `// Use only specific sources
const result = await abmdev.enrich({
  email: "jane@acme.com",
  sources: ["linkedin", "hunter"]  // Skip Perplexity and Tavily
});

// Require LinkedIn (fail if unavailable)
const result = await abmdev.enrich({
  email: "jane@acme.com",
  require_linkedin: true  // Returns error if LinkedIn fails
});

// Company enrichment with web sources only
const result = await abmdev.enrich({
  domain: "acme.com",
  entity_type: "company",
  sources: ["perplexity", "tavily"]  // Skip LinkedIn for companies
});`,
          }}
        />

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--turquoise)]/20">
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Source</th>
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Best For</th>
                <th className="text-left py-3 text-[var(--cream)]">Notes</th>
              </tr>
            </thead>
            <tbody className="text-[var(--cream)]/70">
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4 font-medium text-[var(--cream)]">linkedin</td>
                <td className="py-3 pr-4">Person enrichment</td>
                <td className="py-3">Highest accuracy for job titles, history. Requires Browserbase.</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4 font-medium text-[var(--cream)]">hunter</td>
                <td className="py-3 pr-4">Email verification</td>
                <td className="py-3">Email deliverability, domain patterns. Included in all plans.</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4 font-medium text-[var(--cream)]">perplexity</td>
                <td className="py-3 pr-4">Company research</td>
                <td className="py-3">AI-powered research for company intel, news, funding.</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-[var(--cream)]">tavily</td>
                <td className="py-3 pr-4">Web presence</td>
                <td className="py-3">Web search aggregation, social profiles, press mentions.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Confidence Thresholds */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Gauge className="w-5 h-5 text-[var(--turquoise)]" />
          Confidence Thresholds
        </h2>

        <p className="text-[var(--cream)]/70">
          Use confidence thresholds to control enrichment quality gates:
        </p>

        <CodeBlock
          title="Confidence-based automation"
          examples={{
            javascript: `// Conservative: high confidence required
const result = await abmdev.enrich({
  email: "jane@acme.com",
  min_confidence_to_proceed: 0.85,  // Only proceed if 85%+ confident
  auto_proceed: true                 // Auto-write to CRM
});

// Review workflow: medium threshold, manual approval
const result = await abmdev.enrich({
  email: "jane@acme.com",
  min_confidence_to_proceed: 0.5,   // Accept moderate confidence
  auto_proceed: false               // Require manual review
});

// Check result confidence
if (result.metadata.confidence_score >= 0.9) {
  console.log("High confidence - safe for automation");
} else if (result.metadata.confidence_score >= 0.7) {
  console.log("Good confidence - review recommended");
} else {
  console.log("Low confidence - manual verification needed");
}`,
          }}
        />

        <Callout type="warning" title="Threshold Recommendations">
          <ul className="space-y-1 mt-2">
            <li><strong>0.85+</strong>: Safe for automated CRM updates</li>
            <li><strong>0.70+</strong>: Good for enrichment, consider review for critical fields</li>
            <li><strong>0.50+</strong>: Display only, human verification required</li>
            <li><strong>&lt;0.50</strong>: May indicate insufficient data sources</li>
          </ul>
        </Callout>
      </section>

      {/* Custom System Prompts */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Custom System Prompts</h2>

        <p className="text-[var(--cream)]/70">
          Customize the AI synthesis behavior with custom system prompts:
        </p>

        <CodeBlock
          title="Custom prompts for different use cases"
          examples={{
            javascript: `// Sales-focused enrichment
const salesResult = await abmdev.enrich({
  email: "jane@acme.com",
  person_system_prompt: \`You are enriching a B2B prospect for sales outreach.
Focus on:
- Buying signals and authority level
- Technology stack and current solutions
- Pain points relevant to our product
- Recent company changes or initiatives
Keep summaries action-oriented for sales reps.\`
});

// Marketing-focused enrichment
const marketingResult = await abmdev.enrich({
  domain: "acme.com",
  entity_type: "company",
  company_system_prompt: \`You are researching a company for marketing segmentation.
Focus on:
- Industry vertical and company size
- Growth trajectory and funding status
- Content topics and channels they engage with
- Competitive landscape position
Output should support personalized campaign targeting.\`
});`,
          }}
        />

        <Callout type="note" title="Prompt Best Practices">
          <ul className="space-y-1 mt-2">
            <li>Be specific about the use case and audience</li>
            <li>List the key attributes you want emphasized</li>
            <li>Specify output format preferences (concise, detailed, bullet points)</li>
            <li>Include any domain-specific terminology to use or avoid</li>
          </ul>
        </Callout>
      </section>

      {/* Preflight Mode */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Preflight Mode</h2>

        <p className="text-[var(--cream)]/70">
          Test enrichment configuration without consuming credits:
        </p>

        <CodeBlock
          title="Preflight check"
          examples={{
            javascript: `// Run preflight checks only
const preflight = await abmdev.enrich({
  email: "jane@acme.com",
  preflight_only: true  // Don't execute, just validate
});

// Preflight returns:
// - Source availability (which sources can provide data)
// - Portfolio score (predicted enrichment quality)
// - Estimated fields (what data will be populated)
// - Configuration validation (any issues with your config)

console.log(preflight.preflight);
// {
//   portfolio_score: 0.85,
//   available_sources: ["linkedin", "hunter", "perplexity"],
//   estimated_fields: 34,
//   warnings: [],
//   ready: true
// }

// If ready, proceed with actual enrichment
if (preflight.preflight.ready) {
  const result = await abmdev.enrich({
    email: "jane@acme.com",
    preflight_only: false
  });
}`,
          }}
        />
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Related Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/concepts/confidence-scores"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Confidence Scores</p>
              <p className="text-sm text-[var(--cream)]/60">Understand quality metrics</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/concepts/data-sources"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Data Sources</p>
              <p className="text-sm text-[var(--cream)]/60">Source capabilities</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
