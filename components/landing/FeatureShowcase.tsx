"use client";

import { Badge } from "../ui/badge";
import { Check } from "lucide-react";

interface FeatureShowcaseProps {
  badge: string;
  title: string;
  description: string;
  bullets: string[];
  footnote?: string;
  visual: React.ReactNode;
  reversed?: boolean;
}

export function FeatureShowcase({
  badge,
  title,
  description,
  bullets,
  footnote,
  visual,
  reversed = false,
}: FeatureShowcaseProps) {
  return (
    <section className="relative bg-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${reversed ? 'lg:flex-row-reverse' : ''}`}>
          {/* Visual - Left or Right based on reversed */}
          <div className={`lg:col-span-7 ${reversed ? 'lg:order-2' : 'lg:order-1'} lg:mt-14`}>
            {visual}
          </div>

          {/* Content */}
          <div className={`lg:col-span-5 space-y-6 ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
            <Badge variant="secondary" className="bg-[#0A1F3D]/90 text-[#40E0D0] border border-[#40E0D0]/50">
              {badge}
            </Badge>

            <h2 className="text-[#0A1628] text-3xl lg:text-4xl leading-tight font-semibold" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {title}
            </h2>

            <p className="text-[#1a2f4a] text-lg leading-relaxed" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              {description}
            </p>

            <ul className="space-y-4">
              {bullets.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#40E0D0]/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#0d9488]" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {footnote && (
              <p className="text-gray-500 text-sm leading-relaxed">
                {footnote}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// Visual components for each feature

export function CanonicalFieldsVisual() {
  return (
    <div className="bg-[#0A1F3D] rounded-lg shadow-2xl overflow-hidden border border-[#40E0D0]/20">
      <div className="p-6">
        <p className="text-[#40E0D0] text-xs uppercase tracking-wide font-medium mb-4">90 Canonical Fields</p>
        <div className="grid grid-cols-2 gap-3">
          {[
            { category: "Person (43 fields)", fields: ["full_name", "email", "title", "seniority_level", "department", "phone_number", "linkedin_url", "..."] },
            { category: "Company (47 fields)", fields: ["firm_name", "revenue", "employees", "industry", "tech_stack", "funding", "headquarters", "..."] },
          ].map((group, idx) => (
            <div key={idx} className="space-y-2">
              <p className="text-[#FAEBD7] text-sm font-medium">{group.category}</p>
              <div className="space-y-1">
                {group.fields.map((field, i) => (
                  <div key={i} className="text-xs text-[#40E0D0]/70 font-mono bg-[#0A1628]/50 px-2 py-1 rounded">
                    {field}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <p className="text-[#FAEBD7]/50 text-xs mt-4 text-center">Consistent schema across all enrichments</p>
      </div>
    </div>
  );
}

export function BatchEnrichmentVisual() {
  return (
    <div className="bg-[#0A1F3D] rounded-lg shadow-2xl overflow-hidden border border-[#40E0D0]/20">
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-[#40E0D0] text-xs uppercase tracking-wide font-medium">Batch Job #4521</p>
          <span className="text-xs text-[#10B981] bg-[#10B981]/20 px-2 py-1 rounded">Processing</span>
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-[#FAEBD7]/70">
            <span>2,847 / 5,000 contacts</span>
            <span>57%</span>
          </div>
          <div className="h-2 bg-[#0A1628] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#40E0D0] to-[#20B2AA] rounded-full" style={{ width: '57%' }} />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 pt-2">
          <div className="text-center">
            <p className="text-2xl font-bold text-[#40E0D0]">2,712</p>
            <p className="text-xs text-[#FAEBD7]/50">Enriched</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#FBBF24]">135</p>
            <p className="text-xs text-[#FAEBD7]/50">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-[#EF4444]">12</p>
            <p className="text-xs text-[#FAEBD7]/50">Failed</p>
          </div>
        </div>

        <p className="text-[#FAEBD7]/50 text-xs text-center pt-2">ETA: 12 minutes remaining</p>
      </div>
    </div>
  );
}

export function LinkedInRoutingVisual() {
  return (
    <div className="bg-[#0A1F3D] rounded-lg shadow-2xl overflow-hidden border border-[#40E0D0]/20">
      <div className="p-6 space-y-4">
        <p className="text-[#40E0D0] text-xs uppercase tracking-wide font-medium">Team Connection Routing</p>

        {/* Target contact */}
        <div className="p-3 bg-[#0A1628]/50 rounded-lg">
          <p className="text-[#FAEBD7]/50 text-xs mb-1">Enriching</p>
          <p className="text-[#FAEBD7] font-medium">Sarah Chen, VP Engineering @ Stripe</p>
        </div>

        {/* Team connections */}
        <div className="space-y-2">
          <p className="text-[#FAEBD7]/70 text-xs">Best team connection:</p>
          {[
            { name: "Alex (You)", degree: "1st", selected: true },
            { name: "Jordan M.", degree: "2nd", selected: false },
            { name: "Sam K.", degree: "3rd", selected: false },
          ].map((member, idx) => (
            <div key={idx} className={`flex items-center justify-between p-2 rounded ${member.selected ? 'bg-[#40E0D0]/20 border border-[#40E0D0]/50' : 'bg-[#0A1628]/30'}`}>
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${member.selected ? 'bg-[#40E0D0] text-[#0A1628]' : 'bg-[#0A1628] text-[#FAEBD7]/50'}`}>
                  {member.name.charAt(0)}
                </div>
                <span className="text-[#FAEBD7] text-sm">{member.name}</span>
              </div>
              <span className={`text-xs px-2 py-1 rounded ${member.degree === '1st' ? 'bg-[#10B981]/20 text-[#10B981]' : member.degree === '2nd' ? 'bg-[#FBBF24]/20 text-[#FBBF24]' : 'bg-[#EF4444]/20 text-[#EF4444]'}`}>
                {member.degree}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[#FAEBD7]/50 text-xs text-center">Using 1st-degree connection for deeper profile access</p>
      </div>
    </div>
  );
}

export function ConfigurablePromptsVisual() {
  return (
    <div className="bg-[#0A1F3D] rounded-lg shadow-2xl overflow-hidden border border-[#40E0D0]/20">
      <div className="p-6 space-y-4">
        <p className="text-[#40E0D0] text-xs uppercase tracking-wide font-medium">Prompt Configuration</p>

        <div className="space-y-3">
          <div className="p-3 bg-[#0A1628]/50 rounded-lg">
            <p className="text-[#FAEBD7]/50 text-xs mb-2">Outreach Angle Prompt</p>
            <p className="text-[#FAEBD7] text-sm font-mono leading-relaxed">
              &quot;Focus on {'{'}pain_points{'}'} related to data quality. Mention their {'{'}recent_activity{'}'} if relevant. Keep tone {'{'}brand_voice{'}'}.&quot;
            </p>
          </div>

          <div className="p-3 bg-[#0A1628]/50 rounded-lg">
            <p className="text-[#FAEBD7]/50 text-xs mb-2">Persona Matching Rules</p>
            <div className="space-y-1">
              {["VP/Director + RevOps → 'Technical Buyer'", "C-Suite + <500 emp → 'Executive Sponsor'", "Manager + Marketing → 'Champion'"].map((rule, idx) => (
                <p key={idx} className="text-[#40E0D0]/80 text-xs font-mono">{rule}</p>
              ))}
            </div>
          </div>
        </div>

        <p className="text-[#FAEBD7]/50 text-xs text-center">Customize AI synthesis for your ICP</p>
      </div>
    </div>
  );
}

export function LogStreamingVisual() {
  return (
    <div className="bg-[#0A1F3D] rounded-lg shadow-2xl overflow-hidden border border-[#40E0D0]/20">
      <div className="p-6 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[#40E0D0] text-xs uppercase tracking-wide font-medium">Live Enrichment Stream</p>
          <span className="flex items-center gap-1 text-xs text-[#10B981]">
            <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            Connected
          </span>
        </div>

        <div className="space-y-2 font-mono text-xs">
          {[
            { time: "09:15:32.142", level: "info", msg: "Starting enrichment for marcus.chen@datawise.io" },
            { time: "09:15:32.891", level: "info", msg: "LinkedIn: Found profile, extracting..." },
            { time: "09:15:33.402", level: "info", msg: "Hunter: Email verified (confidence: 98%)" },
            { time: "09:15:34.118", level: "info", msg: "Perplexity: Company data synthesized" },
            { time: "09:15:34.892", level: "info", msg: "Tavily: Recent news found (3 articles)" },
            { time: "09:15:35.201", level: "success", msg: "Enrichment complete: 42 fields populated" },
          ].map((log, idx) => (
            <div key={idx} className="flex gap-2">
              <span className="text-[#FAEBD7]/40">{log.time}</span>
              <span className={log.level === 'success' ? 'text-[#10B981]' : 'text-[#40E0D0]'}>[{log.level}]</span>
              <span className="text-[#FAEBD7]/80">{log.msg}</span>
            </div>
          ))}
        </div>

        <p className="text-[#FAEBD7]/50 text-xs text-center pt-2">Real-time SSE streaming via /v1/enrichment/logs</p>
      </div>
    </div>
  );
}
