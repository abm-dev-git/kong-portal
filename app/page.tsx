import { Navigation } from "@/components/shared/Navigation";
import { Hero } from "@/components/landing/Hero";
import { EnrichmentFeature } from "@/components/landing/EnrichmentFeature";
import {
  FeatureShowcase,
  CanonicalFieldsVisual,
  BatchEnrichmentVisual,
  LinkedInRoutingVisual,
  ConfigurablePromptsVisual,
  LogStreamingVisual,
} from "@/components/landing/FeatureShowcase";
import { QuickStart } from "@/components/landing/QuickStart";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Main Content */}
      <main id="main-content">
        <Hero />
        <EnrichmentFeature />

        {/* Canonical Fields - Visual Left */}
        <FeatureShowcase
          badge="90 standardized fields"
          title="One schema to rule them all"
          description="Every enrichment returns the same 90 canonical fields—43 for people, 47 for companies. No schema drift, no surprises, no mapping headaches."
          bullets={[
            "Consistent output across all data sources",
            "Full TypeScript types for every field",
            "Confidence scores on each field",
            "Source attribution for auditing",
          ]}
          footnote="Fields are normalized from LinkedIn, Hunter, Perplexity, and Tavily into one clean schema."
          visual={<CanonicalFieldsVisual />}
        />

        {/* Batch Enrichment - Visual Right */}
        <FeatureShowcase
          badge="Bulk processing"
          title="Enrich thousands at once"
          description="Upload a CSV or send an array via API. We'll process them in parallel with progress tracking, webhooks, and automatic retries."
          bullets={[
            "Process up to 10,000 contacts per batch",
            "Real-time progress updates via webhooks",
            "Automatic retry on transient failures",
            "Priority queue for time-sensitive jobs",
          ]}
          footnote="Off-peak processing available at 30% discount for non-urgent enrichments."
          visual={<BatchEnrichmentVisual />}
          reversed
        />

        {/* Team LinkedIn Routing - Visual Left */}
        <FeatureShowcase
          badge="Connection intelligence"
          title="Your team's network, unified"
          description="Connect your team's LinkedIn accounts. We automatically route each enrichment through the closest connection for deeper profile access."
          bullets={[
            "1st-degree connections see full profiles",
            "Automatic best-connection routing",
            "Connection sync every 15-30 days",
            "Privacy-first: credentials never stored",
          ]}
          footnote="When multiple team members have connections, we can cross-reference for richer data."
          visual={<LinkedInRoutingVisual />}
        />

        {/* Configurable Prompts - Visual Right */}
        <FeatureShowcase
          badge="AI customization"
          title="Prompts tuned to your ICP"
          description="Customize how our AI synthesizes data. Define your personas, adjust outreach tone, and specify which signals matter most for your business."
          bullets={[
            "Custom persona matching rules",
            "Brand voice for outreach angles",
            "ICP scoring weight configuration",
            "Per-org prompt templates",
          ]}
          footnote="Changes apply to all future enrichments. Test in the playground before deploying."
          visual={<ConfigurablePromptsVisual />}
          reversed
        />

        {/* Log Streaming - Visual Left */}
        <FeatureShowcase
          badge="Real-time visibility"
          title="Watch enrichment happen live"
          description="Our SSE streaming endpoint shows every step as it happens. See which sources returned data, timing breakdowns, and field-level attribution."
          bullets={[
            "Server-Sent Events for real-time updates",
            "Per-source timing and status",
            "Field-level source attribution",
            "Debug mode for troubleshooting",
          ]}
          footnote="Perfect for building responsive UIs that show enrichment progress to your users."
          visual={<LogStreamingVisual />}
        />

        <QuickStart />
        <PricingTeaser />
        <CtaBand />
        <Footer />
      </main>
    </div>
  );
}
