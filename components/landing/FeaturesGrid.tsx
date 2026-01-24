"use client";

import {
  Zap,
  Settings2,
  Database,
  Target,
  Play,
  Shield,
  Layers,
  Code2,
  Bell,
  Clock,
  Sparkles,
  FileJson
} from "lucide-react";
import { SiHubspot, SiLinkedin } from "react-icons/si";

const features = [
  {
    icon: SiHubspot,
    title: "HubSpot Auto-Sync",
    description: "Enriched data flows directly to your CRM. Map any of our 90 fields to HubSpot properties—no CSV exports, no manual entry.",
    color: "#ff7a59",
    bgColor: "#ff7a5915",
  },
  {
    icon: Play,
    title: "Enrichment Playground",
    description: "Test enrichment on any email or LinkedIn URL before you commit. See exactly what data you'll get, with full confidence scores.",
    color: "#40E0D0",
    bgColor: "#40E0D015",
  },
  {
    icon: Zap,
    title: "Real-time SSE Streaming",
    description: "Watch enrichment happen live. Our streaming API shows each source as it returns, so your UI stays responsive.",
    color: "#FBBF24",
    bgColor: "#FBBF2415",
  },
  {
    icon: Settings2,
    title: "Configurable Prompts",
    description: "Customize how AI synthesizes your data. Adjust persona definitions, outreach tone, and which signals matter most to your ICP.",
    color: "#8B5CF6",
    bgColor: "#8B5CF615",
  },
  {
    icon: FileJson,
    title: "90 Canonical Fields",
    description: "Every enrichment returns a consistent schema—43 person fields, 47 company fields. No surprises, no schema drift.",
    color: "#3B82F6",
    bgColor: "#3B82F615",
  },
  {
    icon: Target,
    title: "Buyer Intent Scoring",
    description: "AI-generated ICP fit scores and persona matching. Know which leads to prioritize before you pick up the phone.",
    color: "#10B981",
    bgColor: "#10B98115",
  },
  {
    icon: Shield,
    title: "Hallucination Detection",
    description: "Every AI-generated field is validated against source data. If we can't verify it, we flag it—no made-up information.",
    color: "#EF4444",
    bgColor: "#EF444415",
  },
  {
    icon: SiLinkedin,
    title: "Team LinkedIn Routing",
    description: "Connect multiple team members' LinkedIn accounts. We'll automatically route enrichments through the closest connection to each prospect.",
    color: "#0A66C2",
    bgColor: "#0A66C215",
  },
  {
    icon: Layers,
    title: "Batch Enrichment",
    description: "Upload thousands of contacts at once. Our queue processes them in parallel with progress tracking and webhook notifications.",
    color: "#EC4899",
    bgColor: "#EC489915",
  },
  {
    icon: Code2,
    title: "TypeScript SDK",
    description: "Fully typed client library with autocomplete for all 90 fields. Also available: OpenAPI spec, Postman collection, and cURL examples.",
    color: "#06B6D4",
    bgColor: "#06B6D415",
  },
  {
    icon: Bell,
    title: "Webhook Notifications",
    description: "Get notified when enrichments complete. Perfect for async workflows—trigger Slack alerts, update dashboards, or kick off sequences.",
    color: "#F97316",
    bgColor: "#F9731615",
  },
  {
    icon: Clock,
    title: "Off-peak Processing",
    description: "Schedule batch jobs for off-peak hours and save 30% on costs. Great for overnight list enrichment when you don't need real-time results.",
    color: "#6366F1",
    bgColor: "#6366F115",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative bg-[#0A1628] py-20 lg:py-28 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-[#40E0D0] text-sm font-medium tracking-wide uppercase mb-3" style={{ fontFamily: 'Courier New, monospace' }}>
            Built for ABM Teams
          </p>
          <h2
            className="text-3xl lg:text-5xl text-white font-semibold mb-4"
            style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
          >
            Everything you need to enrich with confidence
          </h2>
          <p className="text-[#FAEBD7]/70 text-lg max-w-2xl mx-auto">
            From live data streaming to CRM sync, we&apos;ve built the features that matter for teams who care about data quality.
          </p>
        </div>

        {/* Features Grid - Clean card design */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div key={idx} className="space-y-4">
                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: feature.bgColor }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-semibold">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-[#FAEBD7]/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-[#FAEBD7]/50 text-sm mb-4" style={{ fontFamily: 'Courier New, monospace' }}>
            Ready to see it in action?
          </p>
          <a
            href="/dashboard/playground"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#40E0D0] text-[#0A1628] font-semibold rounded-lg hover:bg-[#20B2AA] transition-colors"
          >
            <Play className="w-4 h-4" />
            Try the Playground
          </a>
        </div>
      </div>
    </section>
  );
}
