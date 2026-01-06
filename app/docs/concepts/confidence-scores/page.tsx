"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Calculator,
  Layers
} from "lucide-react";

export default function ConfidenceScoresPage() {
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
          Confidence Scores
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          Every enriched field includes a confidence score (0-100) indicating how reliable
          the data is. Use these scores to automate workflows and prioritize data quality.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[var(--turquoise)]" />
          Understanding Scores
        </h2>

        <div className="space-y-3">
          <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--success-green)]/10 border border-[var(--success-green)]/30">
            <div className="w-20 text-center">
              <span className="text-2xl font-bold text-[var(--success-green)]">90-100</span>
            </div>
            <div>
              <p className="font-medium text-[var(--cream)]">High Confidence</p>
              <p className="text-sm text-[var(--cream)]/60">
                Multiple sources agree. Safe for automated CRM updates and outreach workflows.
                Typically 3+ sources with matching data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--turquoise)]/10 border border-[var(--turquoise)]/30">
            <div className="w-20 text-center">
              <span className="text-2xl font-bold text-[var(--turquoise)]">70-89</span>
            </div>
            <div>
              <p className="font-medium text-[var(--cream)]">Good Confidence</p>
              <p className="text-sm text-[var(--cream)]/60">
                Strong data with some uncertainty. Good for enrichment, consider review for
                critical use cases. Typically 2+ sources with agreement.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--warning-yellow)]/10 border border-[var(--warning-yellow)]/30">
            <div className="w-20 text-center">
              <span className="text-2xl font-bold text-[var(--warning-yellow)]">50-69</span>
            </div>
            <div>
              <p className="font-medium text-[var(--cream)]">Medium Confidence</p>
              <p className="text-sm text-[var(--cream)]/60">
                Limited source agreement or stale data. Recommended for display only,
                with human verification before action.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-lg bg-[var(--error-red)]/10 border border-[var(--error-red)]/30">
            <div className="w-20 text-center">
              <span className="text-2xl font-bold text-[var(--error-red)]">&lt;50</span>
            </div>
            <div>
              <p className="font-medium text-[var(--cream)]">Low Confidence</p>
              <p className="text-sm text-[var(--cream)]/60">
                Single source or conflicting data. Manual verification required.
                May be inferred or AI-generated without corroboration.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Calculated */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Calculator className="w-5 h-5 text-[var(--turquoise)]" />
          How Confidence is Calculated
        </h2>

        <p className="text-[var(--cream)]/70">
          Confidence scores are computed using multiple factors:
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4 text-[var(--turquoise)]" />
              Source Agreement
            </h3>
            <p className="text-sm text-[var(--cream)]/60">
              When multiple sources return the same value for a field, confidence increases.
              3 sources agreeing = ~95 confidence. 1 source = ~60-75 confidence.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[var(--turquoise)]" />
              Source Reliability
            </h3>
            <p className="text-sm text-[var(--cream)]/60">
              Each source has historical accuracy ratings. LinkedIn data for job titles
              scores higher than web-scraped data.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--turquoise)]" />
              Data Freshness
            </h3>
            <p className="text-sm text-[var(--cream)]/60">
              Recently verified data scores higher. Data from 30 days ago = full score.
              6+ months old = reduced confidence.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--turquoise)]" />
              Cross-Validation
            </h3>
            <p className="text-sm text-[var(--cream)]/60">
              Fields that validate each other increase confidence. Email domain matching
              company domain = higher email confidence.
            </p>
          </div>
        </div>
      </section>

      {/* Score Types */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Types of Confidence Scores</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--turquoise)]/20">
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Score Type</th>
                <th className="text-left py-3 pr-4 text-[var(--cream)]">Scope</th>
                <th className="text-left py-3 text-[var(--cream)]">Description</th>
              </tr>
            </thead>
            <tbody className="text-[var(--cream)]/70">
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4 font-medium">
                  <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                    confidence_score
                  </code>
                </td>
                <td className="py-3 pr-4">Overall</td>
                <td className="py-3">Average confidence across all enriched fields</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4 font-medium">
                  <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                    email_confidence
                  </code>
                </td>
                <td className="py-3 pr-4">Field-specific</td>
                <td className="py-3">Confidence in email address accuracy and deliverability</td>
              </tr>
              <tr className="border-b border-[var(--turquoise)]/10">
                <td className="py-3 pr-4 font-medium">
                  <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                    persona_confidence_score
                  </code>
                </td>
                <td className="py-3 pr-4">AI-generated</td>
                <td className="py-3">Confidence in AI persona matching</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium">
                  <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                    icp_fit_score
                  </code>
                </td>
                <td className="py-3 pr-4">AI-generated</td>
                <td className="py-3">How well a company matches your Ideal Customer Profile</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* API Response */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Confidence in API Response</h2>

        <p className="text-[var(--cream)]/70">
          Enrichment responses include confidence data in multiple places:
        </p>

        <CodeBlock
          title="Example response with confidence"
          examples={{
            javascript: `// Enrichment response structure
{
  "data": {
    "person": {
      "full_name": "Jane Smith",
      "title": "VP of Engineering",
      "email": "jane@acme.com"
    }
  },

  // Per-field confidence scores
  "confidence": {
    "person.full_name": 95,
    "person.title": 88,
    "person.email": 92
  },

  // Overall metrics
  "metadata": {
    "confidence_score": 91,    // Average across all fields
    "completeness_score": 85,  // % of fields populated
    "success_rate": 100,       // % of sources that succeeded
    "sources_used": ["linkedin", "hunter", "perplexity"]
  }
}`,
          }}
        />
      </section>

      {/* Using in Automations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Using Confidence in Automations</h2>

        <p className="text-[var(--cream)]/70">
          Set confidence thresholds to control automatic data updates:
        </p>

        <CodeBlock
          title="Conditional CRM update based on confidence"
          examples={{
            javascript: `// Only update CRM if confidence is high enough
const enrichmentResult = await abmdev.enrich({
  email: "jane@acme.com"
});

// Check overall confidence before CRM sync
if (enrichmentResult.metadata.confidence_score >= 85) {
  await hubspot.updateContact(contactId, enrichmentResult.data);
  console.log("Contact updated automatically");
} else {
  // Queue for human review
  await reviewQueue.add({
    contact: enrichmentResult.data,
    confidence: enrichmentResult.metadata.confidence_score,
    reason: "Below confidence threshold"
  });
  console.log("Queued for review");
}`,
            python: `# Only update CRM if confidence is high enough
result = abmdev.enrich(email="jane@acme.com")

# Check overall confidence before CRM sync
if result["metadata"]["confidence_score"] >= 85:
    hubspot.update_contact(contact_id, result["data"])
    print("Contact updated automatically")
else:
    # Queue for human review
    review_queue.add({
        "contact": result["data"],
        "confidence": result["metadata"]["confidence_score"],
        "reason": "Below confidence threshold"
    })
    print("Queued for review")`,
          }}
        />

        <Callout type="tip" title="Recommended Thresholds">
          <ul className="space-y-1 mt-2">
            <li><strong>85+</strong>: Safe for automatic CRM updates</li>
            <li><strong>75+</strong>: Good for enrichment display, review before action</li>
            <li><strong>60+</strong>: Display only, human verification required</li>
          </ul>
        </Callout>
      </section>

      {/* Improving Confidence */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Improving Confidence Scores</h2>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Provide More Input Data</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Include LinkedIn URLs, company domains, or full names in your requests.
              More input = more sources can verify data = higher confidence.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Enable More Sources</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Connect LinkedIn via Browserbase for real-time profile data.
              More sources means more cross-validation opportunities.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Re-enrich Periodically</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Data gets stale. Re-enriching contacts every 3-6 months maintains
              high confidence by catching job changes and updates.
            </p>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Related Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/concepts/data-sources"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Data Sources</p>
              <p className="text-sm text-[var(--cream)]/60">Learn about source reliability</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/advanced/enrichment-config"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Advanced Configuration</p>
              <p className="text-sm text-[var(--cream)]/60">Set confidence thresholds</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
