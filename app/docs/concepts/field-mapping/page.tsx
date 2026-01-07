import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Callout } from "@/components/docs/Callout";
import { CodeBlock } from "@/components/docs/CodeBlock";
import {
  Clock,
  ArrowLeftRight,
  Database,
  RefreshCw,
  ArrowRight,
  Settings2,
  Layers,
  Zap
} from "lucide-react";

export const metadata = {
  title: "Field Mapping - ABM.dev Docs",
  description: "Learn how ABM.dev maps enriched data to your CRM fields",
};

const transformationTypes = [
  {
    name: "DateFormat",
    description: "Parse and format dates between systems",
    example: "2024-01-15 → Jan 15, 2024",
  },
  {
    name: "Concat",
    description: "Combine multiple fields into one",
    example: "first_name + last_name → full_name",
  },
  {
    name: "Split",
    description: "Decompose a field into multiple values",
    example: "San Francisco, CA → city: San Francisco, state: CA",
  },
  {
    name: "Format",
    description: "Pattern-based string formatting",
    example: "+1-555-0123 → (555) 012-3123",
  },
  {
    name: "Uppercase/Lowercase",
    description: "Case conversion for consistency",
    example: "engineering → ENGINEERING",
  },
  {
    name: "Trim",
    description: "Remove leading/trailing whitespace",
    example: "  Jane Smith  → Jane Smith",
  },
];

const defaultMappings = {
  person: [
    { canonical: "email", hubspot: "email", salesforce: "Email" },
    { canonical: "first_name", hubspot: "firstname", salesforce: "FirstName" },
    { canonical: "last_name", hubspot: "lastname", salesforce: "LastName" },
    { canonical: "title", hubspot: "jobtitle", salesforce: "Title" },
    { canonical: "company", hubspot: "company", salesforce: "Company" },
    { canonical: "phone_number", hubspot: "phone", salesforce: "Phone" },
    { canonical: "professional_profile_url", hubspot: "linkedin_url", salesforce: "LinkedIn_URL__c" },
    { canonical: "office_location", hubspot: "city", salesforce: "MailingCity" },
  ],
  company: [
    { canonical: "firm_name", hubspot: "name", salesforce: "Name" },
    { canonical: "website_url", hubspot: "website", salesforce: "Website" },
    { canonical: "industry", hubspot: "industry", salesforce: "Industry" },
    { canonical: "employees", hubspot: "numberofemployees", salesforce: "NumberOfEmployees" },
    { canonical: "city", hubspot: "city", salesforce: "BillingCity" },
    { canonical: "country_region", hubspot: "country", salesforce: "BillingCountry" },
    { canonical: "description", hubspot: "description", salesforce: "Description" },
    { canonical: "revenue", hubspot: "annualrevenue", salesforce: "AnnualRevenue" },
  ],
};

export default function FieldMappingPage() {
  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30">
            <Clock className="w-3 h-3 mr-1" />
            10 min read
          </Badge>
        </div>
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          Field Mapping
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          ABM.dev maps enriched data from canonical fields to your CRM&apos;s native properties.
          Customize mappings and transformations to match your data model.
        </p>
      </div>

      {/* How it works */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <ArrowLeftRight className="w-5 h-5 text-[var(--turquoise)]" />
          How Field Mapping Works
        </h2>

        <p className="text-[var(--cream)]/70">
          When enrichment completes, ABM.dev translates the standardized canonical fields into
          your CRM&apos;s property format:
        </p>

        <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            <div className="p-3 rounded-lg bg-[var(--turquoise)]/10 border border-[var(--turquoise)]/30">
              <Database className="w-6 h-6 text-[var(--turquoise)] mx-auto mb-1" />
              <span className="text-sm text-[var(--cream)]">Canonical Fields</span>
              <p className="text-xs text-[var(--cream)]/50">90 standardized fields</p>
            </div>
            <ArrowRight className="w-6 h-6 text-[var(--turquoise)] rotate-90 sm:rotate-0" />
            <div className="p-3 rounded-lg bg-[var(--electric-blue)]/10 border border-[var(--electric-blue)]/30">
              <Settings2 className="w-6 h-6 text-[var(--electric-blue)] mx-auto mb-1" />
              <span className="text-sm text-[var(--cream)]">Transformations</span>
              <p className="text-xs text-[var(--cream)]/50">Format, concat, split</p>
            </div>
            <ArrowRight className="w-6 h-6 text-[var(--turquoise)] rotate-90 sm:rotate-0" />
            <div className="p-3 rounded-lg bg-[var(--success-green)]/10 border border-[var(--success-green)]/30">
              <RefreshCw className="w-6 h-6 text-[var(--success-green)] mx-auto mb-1" />
              <span className="text-sm text-[var(--cream)]">CRM Properties</span>
              <p className="text-xs text-[var(--cream)]/50">HubSpot, Salesforce, etc.</p>
            </div>
          </div>
        </div>

        <Callout type="tip" title="Bidirectional Sync">
          Field mappings work in both directions. When you enrich from a CRM contact,
          we read existing data using the same mappings to provide context for enrichment.
        </Callout>
      </section>

      {/* Default Mappings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Layers className="w-5 h-5 text-[var(--turquoise)]" />
          Default Mappings
        </h2>

        <p className="text-[var(--cream)]/70">
          ABM.dev includes sensible defaults for common CRM platforms. These work out of the box
          with no configuration required.
        </p>

        {/* Person Mappings Table */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-[var(--cream)]">Person/Contact Fields</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--turquoise)]/20">
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">Canonical Field</th>
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">HubSpot</th>
                  <th className="text-left py-3 text-[var(--cream)]">Salesforce</th>
                </tr>
              </thead>
              <tbody className="text-[var(--cream)]/70">
                {defaultMappings.person.map((mapping) => (
                  <tr key={mapping.canonical} className="border-b border-[var(--turquoise)]/10">
                    <td className="py-2 pr-4">
                      <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                        {mapping.canonical}
                      </code>
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs">{mapping.hubspot}</td>
                    <td className="py-2 font-mono text-xs">{mapping.salesforce}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Company Mappings Table */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-[var(--cream)]">Company/Account Fields</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--turquoise)]/20">
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">Canonical Field</th>
                  <th className="text-left py-3 pr-4 text-[var(--cream)]">HubSpot</th>
                  <th className="text-left py-3 text-[var(--cream)]">Salesforce</th>
                </tr>
              </thead>
              <tbody className="text-[var(--cream)]/70">
                {defaultMappings.company.map((mapping) => (
                  <tr key={mapping.canonical} className="border-b border-[var(--turquoise)]/10">
                    <td className="py-2 pr-4">
                      <code className="text-xs px-1.5 py-0.5 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                        {mapping.canonical}
                      </code>
                    </td>
                    <td className="py-2 pr-4 font-mono text-xs">{mapping.hubspot}</td>
                    <td className="py-2 font-mono text-xs">{mapping.salesforce}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Transformations */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)] flex items-center gap-2">
          <Zap className="w-5 h-5 text-[var(--turquoise)]" />
          Transformations
        </h2>

        <p className="text-[var(--cream)]/70">
          When canonical field values need to be modified before writing to your CRM,
          transformations handle the conversion:
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          {transformationTypes.map((transform) => (
            <div
              key={transform.name}
              className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20"
            >
              <h3 className="font-medium text-[var(--cream)] mb-1">{transform.name}</h3>
              <p className="text-sm text-[var(--cream)]/60 mb-2">{transform.description}</p>
              <code className="text-xs px-2 py-1 rounded bg-[var(--turquoise)]/10 text-[var(--turquoise)]">
                {transform.example}
              </code>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Mappings */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Custom Field Mappings</h2>

        <p className="text-[var(--cream)]/70">
          Override default mappings or add custom fields via the API:
        </p>

        <CodeBlock
          title="Setting custom field mappings"
          examples={{
            javascript: `// Configure custom mappings for your organization
const mappings = await abmdev.fieldMappings.create({
  integration_type: "hubspot",
  entity_type: "person",
  mappings: [
    {
      internal_field: "matched_persona",    // Canonical field
      external_field: "abm_persona",        // Your HubSpot property
      direction: "write",                   // write, read, or bidirectional
      transformation: null                  // Optional transformation
    },
    {
      internal_field: "confidence_score",
      external_field: "abm_confidence",
      direction: "write",
      transformation: {
        type: "format",
        pattern: "{value}%"                 // 85 → "85%"
      }
    },
    {
      internal_field: "full_name",
      external_field: "contact_name",
      direction: "bidirectional",
      transformation: {
        type: "uppercase"                   // Jane Smith → JANE SMITH
      }
    }
  ]
});`,
            python: `# Configure custom mappings for your organization
mappings = abmdev.field_mappings.create(
    integration_type="hubspot",
    entity_type="person",
    mappings=[
        {
            "internal_field": "matched_persona",    # Canonical field
            "external_field": "abm_persona",        # Your HubSpot property
            "direction": "write",                   # write, read, or bidirectional
            "transformation": None                  # Optional transformation
        },
        {
            "internal_field": "confidence_score",
            "external_field": "abm_confidence",
            "direction": "write",
            "transformation": {
                "type": "format",
                "pattern": "{value}%"               # 85 → "85%"
            }
        },
        {
            "internal_field": "full_name",
            "external_field": "contact_name",
            "direction": "bidirectional",
            "transformation": {
                "type": "uppercase"                 # Jane Smith → JANE SMITH
            }
        }
    ]
)`,
          }}
        />
      </section>

      {/* Mapping Direction */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Mapping Directions</h2>

        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Write (ABM.dev → CRM)</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Enriched data flows from ABM.dev to your CRM. Use this for fields you want to
              populate or update in your CRM after enrichment.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Read (CRM → ABM.dev)</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Existing CRM data is read into ABM.dev to provide context during enrichment.
              Useful for using CRM data as enrichment input.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
            <h3 className="font-medium text-[var(--cream)] mb-2">Bidirectional</h3>
            <p className="text-sm text-[var(--cream)]/70">
              Data flows both ways. CRM data is read for context, and enriched data is
              written back. This is the most common configuration for core fields.
            </p>
          </div>
        </div>
      </section>

      {/* Fallback Priority */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold text-[var(--cream)]">Fallback Priority</h2>

        <p className="text-[var(--cream)]/70">
          When multiple canonical fields could map to the same CRM property, use priority
          to control which takes precedence:
        </p>

        <CodeBlock
          title="Priority-based fallback"
          examples={{
            javascript: `// Map multiple fields to one CRM property with fallback
const mappings = await abmdev.fieldMappings.create({
  integration_type: "hubspot",
  entity_type: "person",
  mappings: [
    {
      internal_field: "email",
      external_field: "email",
      direction: "write",
      priority: 1                    // Highest priority
    },
    {
      internal_field: "secondary_email",
      external_field: "email",
      direction: "write",
      priority: 2                    // Used if primary is empty
    }
  ]
});

// ABM.dev will try fields in priority order
// If email is empty, secondary_email is used`,
          }}
        />

        <Callout type="note" title="Priority Rules">
          Lower numbers = higher priority. If a high-priority field has data, lower-priority
          mappings to the same CRM field are skipped.
        </Callout>
      </section>

      {/* Next steps */}
      <section className="p-6 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/20">
        <h2 className="text-lg font-semibold text-[var(--cream)] mb-4">Related Guides</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <Link
            href="/docs/concepts/canonical-fields"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">Canonical Fields</p>
              <p className="text-sm text-[var(--cream)]/60">All 90 enrichment fields</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/docs/guides/hubspot"
            className="group flex items-center gap-3 p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors"
          >
            <div>
              <p className="font-medium text-[var(--cream)]">HubSpot Integration</p>
              <p className="text-sm text-[var(--cream)]/60">Connect and configure</p>
            </div>
            <ArrowRight className="w-4 h-4 text-[var(--turquoise)] ml-auto group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
}
