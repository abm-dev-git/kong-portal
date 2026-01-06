import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/docs/Callout";
import { FieldTable } from "@/components/docs/FieldTable";
import {
  Clock,
  Database,
  User,
  Building2,
  ArrowRight,
  Layers
} from "lucide-react";

export const metadata = {
  title: "Canonical Fields - ABM.dev Docs",
  description: "Complete reference of all 90 enrichment fields available in ABM.dev",
};

// Person field categories
const personFieldCategories = [
  {
    name: "Basic Info",
    description: "Core identity fields",
    fields: [
      { name: "first_name", type: "string", description: "Person's first/given name", example: "Jane" },
      { name: "last_name", type: "string", description: "Person's last/family name", example: "Smith" },
      { name: "full_name", type: "string", description: "Complete name", example: "Jane Smith" },
      { name: "title", type: "string", description: "Current job title", example: "VP of Engineering" },
      { name: "normalized_title", type: "string", description: "Standardized job title for comparison", example: "Vice President Engineering" },
    ]
  },
  {
    name: "Contact",
    description: "Communication channels",
    fields: [
      { name: "email", type: "string", description: "Primary email address", example: "jane@acme.com" },
      { name: "email_status", type: "string", description: "Email verification status", example: "verified" },
      { name: "email_confidence", type: "number", description: "Confidence score for email (0-100)", example: "95" },
      { name: "phone_number", type: "string", description: "Primary phone number", example: "+1-555-0123" },
      { name: "professional_profile_url", type: "string", description: "LinkedIn or similar profile URL", example: "linkedin.com/in/janesmith" },
    ]
  },
  {
    name: "Company Context",
    description: "Organizational details",
    fields: [
      { name: "company", type: "string", description: "Current employer name", example: "Acme Corp" },
      { name: "office_location", type: "string", description: "Work location/office", example: "San Francisco, CA" },
      { name: "department", type: "string", description: "Department or team", example: "Engineering" },
      { name: "seniority_level", type: "string", description: "Level in organization", example: "VP" },
    ]
  },
  {
    name: "Data Quality",
    description: "Enrichment metadata",
    fields: [
      { name: "data_sources", type: "array", description: "Sources that provided data", example: '["linkedin", "hunter"]' },
      { name: "source_count", type: "number", description: "Number of sources used", example: "3" },
      { name: "last_verified_date", type: "date", description: "When data was last verified", example: "2024-01-15" },
      { name: "verification_status", type: "string", description: "Overall verification state", example: "verified" },
    ]
  },
  {
    name: "Enriched Content",
    description: "AI-generated insights",
    fields: [
      { name: "person_summary", type: "string", description: "Brief professional summary", example: "Engineering leader with 15 years..." },
      { name: "background_highlights", type: "string", description: "Key career highlights", example: "Led 50-person team, scaled to IPO" },
      { name: "recent_activity", type: "string", description: "Recent professional activity", example: "Speaking at SaaStr 2024" },
      { name: "outreach_angle", type: "string", description: "Suggested outreach approach", example: "Mention their recent talk on..." },
    ]
  },
  {
    name: "AI-Generated",
    description: "Machine learning outputs",
    fields: [
      { name: "matched_persona", type: "string", description: "Matched buyer persona", example: "Technical Decision Maker" },
      { name: "persona_confidence_score", type: "number", description: "Confidence in persona match (0-100)", example: "87" },
      { name: "persona_match_reason", type: "string", description: "Why this persona was matched", example: "Title and department align with..." },
    ]
  },
];

// Company field categories
const companyFieldCategories = [
  {
    name: "Identity",
    description: "Core company info",
    fields: [
      { name: "firm_name", type: "string", description: "Official company name", example: "Acme Corporation" },
      { name: "website_url", type: "string", description: "Primary website", example: "https://acme.com" },
      { name: "linkedin_company_page", type: "string", description: "LinkedIn company page URL", example: "linkedin.com/company/acme" },
      { name: "logo_url", type: "string", description: "Company logo image URL", example: "https://acme.com/logo.png" },
    ]
  },
  {
    name: "Scale",
    description: "Size and growth metrics",
    fields: [
      { name: "employees", type: "string", description: "Employee count or range", example: "500-1000" },
      { name: "number_of_offices", type: "number", description: "Global office count", example: "12" },
      { name: "number_of_clients", type: "string", description: "Customer base size", example: "500+" },
      { name: "revenue", type: "string", description: "Annual revenue estimate", example: "$50M-$100M" },
      { name: "founded_year", type: "number", description: "Year company was founded", example: "2015" },
    ]
  },
  {
    name: "Context",
    description: "Industry and location",
    fields: [
      { name: "industry", type: "string", description: "Primary industry", example: "Enterprise Software" },
      { name: "city", type: "string", description: "Headquarters city", example: "San Francisco" },
      { name: "country_region", type: "string", description: "Country or region", example: "United States" },
      { name: "description", type: "string", description: "Company description", example: "Leading provider of..." },
    ]
  },
  {
    name: "Finance",
    description: "Financial and ownership",
    fields: [
      { name: "is_public", type: "boolean", description: "Whether publicly traded", example: "false" },
      { name: "pe_backer", type: "string", description: "Private equity investor", example: "Sequoia Capital" },
      { name: "pe_confidence", type: "number", description: "Confidence in PE data (0-100)", example: "85" },
      { name: "parent_company", type: "string", description: "Parent organization if subsidiary", example: "Alphabet Inc" },
      { name: "acquisitions", type: "array", description: "Companies acquired", example: '["StartupX", "TechY"]' },
    ]
  },
  {
    name: "Content",
    description: "Company intelligence",
    fields: [
      { name: "services", type: "array", description: "Products and services offered", example: '["CRM", "Analytics"]' },
      { name: "notable_highlights", type: "string", description: "Key achievements or news", example: "Recent Series C funding" },
      { name: "recent_news", type: "string", description: "Latest company news", example: "Launched new AI feature" },
      { name: "expansion_signals", type: "string", description: "Growth indicators", example: "Hiring 50+ engineers" },
    ]
  },
  {
    name: "AI-Generated",
    description: "Machine learning outputs",
    fields: [
      { name: "icp_fit_score", type: "number", description: "Ideal Customer Profile fit (0-100)", example: "92" },
      { name: "priority_tier", type: "string", description: "Account priority classification", example: "Tier 1" },
      { name: "confidence_score", type: "number", description: "Overall data confidence (0-100)", example: "88" },
    ]
  },
];

export default function CanonicalFieldsPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            10 min read
          </Badge>
          <Badge variant="secondary" className="bg-[var(--electric-blue)]/10 text-[var(--electric-blue)] border-[var(--electric-blue)]/30">
            Reference
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          Canonical Fields
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          ABM.dev normalizes all enrichment data into a standard set of canonical fields.
          This ensures consistency regardless of which data sources are used.
        </p>
      </div>

      {/* Overview */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--turquoise)]" />
          What are Canonical Fields?
        </h2>
        <p className="text-[var(--cream)]/70">
          Canonical fields are the standardized output format for all enrichment. When you enrich
          a person or company, the data from multiple sources (LinkedIn, Hunter, Perplexity, etc.)
          is normalized into these consistent field names.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <User className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">43 Person Fields</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Contact info, job details, professional background, AI insights
            </p>
          </div>
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <Building2 className="w-6 h-6 text-[var(--turquoise)] mb-2" />
            <h3 className="font-medium text-[var(--cream)] mb-1">47 Company Fields</h3>
            <p className="text-sm text-[var(--cream)]/60">
              Company details, financials, growth signals, ICP scoring
            </p>
          </div>
        </div>

        <Callout type="tip" title="CRM Integration">
          Canonical fields map directly to your CRM properties. See the{" "}
          <Link href="/docs/concepts/field-mapping" className="text-[var(--turquoise)] hover:underline">
            Field Mapping
          </Link>{" "}
          guide for details on how these sync to HubSpot, Salesforce, and other platforms.
        </Callout>
      </section>

      {/* Person Fields */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <User className="w-5 h-5 text-[var(--turquoise)]" />
          Person Fields
        </h2>
        <p className="text-[var(--cream)]/70">
          Fields available when enriching a person/contact:
        </p>
        <FieldTable categories={personFieldCategories} entityType="person" />
      </section>

      {/* Company Fields */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Building2 className="w-5 h-5 text-[var(--turquoise)]" />
          Company Fields
        </h2>
        <p className="text-[var(--cream)]/70">
          Fields available when enriching a company/organization:
        </p>
        <FieldTable categories={companyFieldCategories} entityType="company" />
      </section>

      {/* Field Categories */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Field Categories</h2>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Standard Fields</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Core data like names, emails, and company info. These fields are populated
              directly from source data with minimal transformation.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Data Quality Fields</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Metadata about the enrichment itself: which sources were used, when data
              was verified, and confidence levels.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">AI-Generated Fields</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Synthesized insights created by our AI models: summaries, persona matching,
              ICP fit scores, and outreach suggestions. These require AI synthesis to be enabled.
            </p>
          </div>
        </div>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Related Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/concepts/field-mapping"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Field Mapping</p>
              <p className="text-sm text-[var(--cream)]/60">Map fields to your CRM</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/concepts/confidence-scores"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Confidence Scores</p>
              <p className="text-sm text-[var(--cream)]/60">Understand data quality</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
