"use client";

import {
  Zap,
  Settings2,
  Database,
  Target,
  Play,
  Shield,
  Users,
  Layers,
  Code2,
  Bell,
  Clock
} from "lucide-react";
import { SiHubspot, SiLinkedin } from "react-icons/si";

const features = [
  {
    icon: SiHubspot,
    title: "HubSpot Auto-Sync",
    description: "Enriched data flows directly to your CRM. Map any of our 90 fields to HubSpot properties—no CSV exports, no manual entry.",
    color: "#ff7a59",
  },
  {
    icon: Play,
    title: "Enrichment Playground",
    description: "Test enrichment on any email or LinkedIn URL before you commit. See exactly what data you'll get, with full confidence scores.",
    color: "#40E0D0",
  },
  {
    icon: Zap,
    title: "Real-time SSE Streaming",
    description: "Watch enrichment happen live. Our streaming API shows each source as it returns, so your UI stays responsive.",
    color: "#FBBF24",
  },
  {
    icon: Settings2,
    title: "Configurable Prompts",
    description: "Customize how AI synthesizes your data. Adjust persona definitions, outreach tone, and which signals matter most to your ICP.",
    color: "#8B5CF6",
  },
  {
    icon: Database,
    title: "90 Canonical Fields",
    description: "Every enrichment returns a consistent schema—43 person fields, 47 company fields. No surprises, no schema drift.",
    color: "#3B82F6",
  },
  {
    icon: Target,
    title: "Buyer Intent Scoring",
    description: "AI-generated ICP fit scores and persona matching. Know which leads to prioritize before you pick up the phone.",
    color: "#10B981",
  },
  {
    icon: Shield,
    title: "Hallucination Detection",
    description: "Every AI-generated field is validated against source data. If we can't verify it, we flag it—no made-up information.",
    color: "#EF4444",
  },
  {
    icon: SiLinkedin,
    title: "Team LinkedIn Routing",
    description: "Connect multiple team members' LinkedIn accounts. We'll automatically route enrichments through the closest connection to each prospect.",
    color: "#0A66C2",
  },
  {
    icon: Layers,
    title: "Batch Enrichment",
    description: "Upload thousands of contacts at once. Our queue processes them in parallel with progress tracking and webhook notifications.",
    color: "#EC4899",
  },
  {
    icon: Code2,
    title: "TypeScript SDK",
    description: "Fully typed client library with autocomplete for all 90 fields. Also available: OpenAPI spec, Postman collection, and cURL examples.",
    color: "#06B6D4",
  },
  {
    icon: Bell,
    title: "Webhook Notifications",
    description: "Get notified when enrichments complete. Perfect for async workflows—trigger Slack alerts, update dashboards, or kick off sequences.",
    color: "#F97316",
  },
  {
    icon: Clock,
    title: "Off-peak Processing",
    description: "Schedule batch jobs for off-peak hours and save 30% on costs. Great for overnight list enrichment when you don't need real-time results.",
    color: "#6366F1",
  },
];

export function FeaturesGrid() {
  return (
    <section className="relative bg-[#0A1628] py-20 lg:py-28 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(64,224,208,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(64,224,208,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

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

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <div
                key={idx}
                className="group p-6 rounded-xl bg-[#0A1F3D]/50 border border-[#40E0D0]/10 hover:border-[#40E0D0]/30 transition-all duration-300 hover:bg-[#0A1F3D]/70"
              >
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{ backgroundColor: `${feature.color}20` }}
                >
                  <Icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-white text-lg font-semibold mb-2">
                  {feature.title}
                </h3>
                <p className="text-[#FAEBD7]/60 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
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
