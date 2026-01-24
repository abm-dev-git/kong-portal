"use client";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, ArrowRight, Code, Database, Clock, Sparkles, Building2, User, TrendingUp } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

type TabType = "person" | "ai" | "company" | "audit";

export function EnrichmentFeature() {
  const [activeTab, setActiveTab] = useState<TabType>("person");

  const handleKeyDown = (event: React.KeyboardEvent, tab: TabType) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveTab(tab);
    }
  };

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: "person", label: "Person", icon: <User className="w-3.5 h-3.5" /> },
    { id: "ai", label: "AI Insights", icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: "company", label: "Company", icon: <Building2 className="w-3.5 h-3.5" /> },
    { id: "audit", label: "Audit", icon: <Database className="w-3.5 h-3.5" /> },
  ];

  return (
    <section className="relative bg-gray-50 py-16 lg:py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column - Product Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#0A1F3D] border border-[#40E0D0]/20 rounded-lg shadow-2xl overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-[#40E0D0]/20 bg-[#0A1F3D]/50 backdrop-blur-sm">
                <div className="flex" role="tablist" aria-label="Enrichment data views">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      onKeyDown={(e) => handleKeyDown(e, tab.id)}
                      role="tab"
                      aria-selected={activeTab === tab.id}
                      aria-controls={`enrichment-panel-${tab.id}`}
                      tabIndex={activeTab === tab.id ? 0 : -1}
                      className={cn(
                        "flex items-center gap-1.5 px-4 py-3 text-sm transition-colors",
                        activeTab === tab.id
                          ? "text-[#40E0D0] border-b-2 border-[#40E0D0]"
                          : "text-[#FAEBD7]/60 hover:text-[#FAEBD7]"
                      )}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6 min-h-[420px]" role="tabpanel" id={`enrichment-panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
                {/* Person Tab */}
                {activeTab === "person" && (
                  <div className="space-y-4">
                    {/* Profile header with Buyer Score */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#40E0D0] to-[#20B2AA] flex items-center justify-center text-[#0A1F3D] text-xl font-semibold">
                        MC
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[#FAEBD7] text-lg font-semibold">Marcus Chen</h3>
                          <Badge className="bg-[#10B981] text-white text-xs border-0">
                            92% Buyer Score
                          </Badge>
                        </div>
                        <p className="text-[#FAEBD7]/60 text-sm">VP of Revenue Operations</p>
                        <p className="text-[#FAEBD7]/60 text-sm">Datawise Analytics • Series B</p>
                      </div>
                    </div>

                    {/* Person Fields */}
                    <div className="space-y-3 pt-2">
                      <DataField
                        label="Email"
                        value="marcus.chen@datawise.io"
                        confidence="High"
                        source="Hunter, LinkedIn"
                        freshness="Verified live"
                      />
                      <DataField
                        label="Phone"
                        value="+1 (512) 555-0147"
                        confidence="Medium"
                        source="Hunter"
                        freshness="Updated 5d ago"
                      />
                      <DataField
                        label="LinkedIn"
                        value="linkedin.com/in/marcuschen-revops"
                        confidence="High"
                        source="LinkedIn"
                        freshness="Live"
                      />
                      <DataField
                        label="Location"
                        value="Austin, TX"
                        confidence="High"
                        source="LinkedIn, Perplexity"
                        freshness="Live"
                      />
                      <DataField
                        label="Seniority"
                        value="VP Level • Reports to CRO"
                        confidence="High"
                        source="LinkedIn, Tavily"
                        freshness="Live"
                      />
                    </div>
                  </div>
                )}

                {/* AI Insights Tab */}
                {activeTab === "ai" && (
                  <div className="space-y-4">
                    {/* Outreach Angle */}
                    <div className="p-4 rounded-lg bg-[#40E0D0]/10 border border-[#40E0D0]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#40E0D0]" />
                        <p className="text-xs text-[#40E0D0] uppercase tracking-wide font-medium">Outreach Angle</p>
                        <Badge className="ml-auto bg-[#10B981]/20 text-[#10B981] text-xs border-0">88%</Badge>
                      </div>
                      <p className="text-[#FAEBD7] text-sm leading-relaxed">
                        &ldquo;Marcus recently posted about scaling RevOps for hypergrowth. Lead with how ABM.dev eliminates manual data entry—his team is drowning in spreadsheet imports from HubSpot.&rdquo;
                      </p>
                    </div>

                    {/* Person Summary */}
                    <div className="p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <User className="w-4 h-4 text-[#8B5CF6]" />
                        <p className="text-xs text-[#8B5CF6] uppercase tracking-wide font-medium">Person Summary</p>
                        <Badge className="ml-auto bg-[#10B981]/20 text-[#10B981] text-xs border-0">95%</Badge>
                      </div>
                      <p className="text-[#FAEBD7] text-sm leading-relaxed">
                        Revenue operations leader with 8+ years scaling GTM teams at high-growth SaaS companies. Previously built RevOps function at two unicorns. Known for data-driven approach and strong opinions on CRM hygiene.
                      </p>
                    </div>

                    {/* Background Highlights */}
                    <div className="p-4 rounded-lg bg-[#F59E0B]/10 border border-[#F59E0B]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-[#F59E0B]" />
                        <p className="text-xs text-[#F59E0B] uppercase tracking-wide font-medium">Background Highlights</p>
                        <Badge className="ml-auto bg-[#10B981]/20 text-[#10B981] text-xs border-0">91%</Badge>
                      </div>
                      <ul className="text-[#FAEBD7] text-sm space-y-1">
                        <li>• Built RevOps team from 0→12 at previous company</li>
                        <li>• Reduced sales cycle 23% through data enrichment</li>
                        <li>• Speaker at RevOps Summit 2025</li>
                      </ul>
                    </div>

                    {/* Matched Persona */}
                    <div className="p-4 rounded-lg bg-[#3B82F6]/10 border border-[#3B82F6]/20">
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-4 h-4 text-[#3B82F6]" />
                        <p className="text-xs text-[#3B82F6] uppercase tracking-wide font-medium">Matched Persona</p>
                        <Badge className="ml-auto bg-[#10B981]/20 text-[#10B981] text-xs border-0">92%</Badge>
                      </div>
                      <p className="text-[#FAEBD7] font-medium">Technical Decision Maker</p>
                      <p className="text-[#FAEBD7]/70 text-sm mt-1">
                        Title (VP RevOps) + department (Operations) + seniority (reports to CRO) align with technical buyer profile. High likelihood of evaluating tools independently.
                      </p>
                    </div>
                  </div>
                )}

                {/* Company Tab */}
                {activeTab === "company" && (
                  <div className="space-y-4">
                    {/* Company Header */}
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-lg bg-[#3B82F6]/20 flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-[#3B82F6]" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[#FAEBD7] text-lg font-semibold">Datawise Analytics</h3>
                          <Badge className="bg-[#10B981] text-white text-xs border-0">
                            94% ICP Fit
                          </Badge>
                        </div>
                        <p className="text-[#FAEBD7]/60 text-sm">Series B • Data Analytics Platform</p>
                      </div>
                    </div>

                    {/* Company Fields */}
                    <div className="space-y-3">
                      <DataField
                        label="Revenue"
                        value="$25M–$50M ARR"
                        confidence="High"
                        source="Tavily, Perplexity"
                        freshness="Updated 1w ago"
                      />
                      <DataField
                        label="Employees"
                        value="200–500 (grew 40% YoY)"
                        confidence="High"
                        source="LinkedIn"
                        freshness="Live"
                      />
                      <DataField
                        label="Tech Stack"
                        value="HubSpot, Snowflake, dbt, Fivetran, Segment"
                        confidence="Medium"
                        source="Hunter, Perplexity"
                        freshness="Updated 2w ago"
                      />
                      <DataField
                        label="Funding"
                        value="$47M raised • Sequoia, a16z"
                        confidence="High"
                        source="Tavily, Perplexity"
                        freshness="Updated 3d ago"
                      />
                    </div>

                    {/* Expansion Signals */}
                    <div className="p-3 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20">
                      <p className="text-xs text-[#10B981] uppercase tracking-wide font-medium mb-2">Expansion Signals</p>
                      <ul className="text-[#FAEBD7] text-sm space-y-1">
                        <li>• Hiring 12 SDRs and 3 RevOps managers</li>
                        <li>• Opened Austin office (HQ expansion)</li>
                        <li>• Job posts mention "data enrichment needs"</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* Audit Tab */}
                {activeTab === "audit" && (
                  <div className="space-y-3">
                    <AuditEntry
                      timestamp="2026-01-24 09:15"
                      action="Outreach angle generated"
                      source="Perplexity + LinkedIn activity"
                      confidence="88%"
                    />
                    <AuditEntry
                      timestamp="2026-01-24 09:15"
                      action="Person summary synthesized"
                      source="LinkedIn + Tavily + Perplexity"
                      confidence="95%"
                    />
                    <AuditEntry
                      timestamp="2026-01-24 09:15"
                      action="Persona matched: Technical Decision Maker"
                      source="AI Synthesis (4 sources)"
                      confidence="92%"
                    />
                    <AuditEntry
                      timestamp="2026-01-24 09:14"
                      action="ICP fit score calculated"
                      source="Firmographic + Intent signals"
                      confidence="94%"
                    />
                    <AuditEntry
                      timestamp="2026-01-24 09:14"
                      action="Background highlights extracted"
                      source="LinkedIn + Perplexity"
                      confidence="91%"
                    />
                    <AuditEntry
                      timestamp="2026-01-24 09:13"
                      action="Hallucination check passed"
                      source="Cross-source validation"
                      confidence="100%"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Content */}
          <div className="lg:col-span-5 space-y-6">
            {/* Eyebrow */}
            <Badge variant="secondary" className="bg-[#0A1F3D]/90 text-[#40E0D0] border border-[#40E0D0]/50">
              30–48 fields per profile
            </Badge>

            {/* H1 */}
            <h2 className="text-[#0A1628] text-4xl lg:text-5xl leading-tight font-semibold" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Depth you can trust, sources you can cite
            </h2>

            {/* Lead paragraph */}
            <p className="text-[#1a2f4a] text-lg leading-relaxed" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Every field comes with a confidence score and source citation. Our multi-stage LLM pipeline synthesizes data from LinkedIn, Hunter, Perplexity, and Tavily—with hallucination detection built in.
            </p>

            {/* Bullet list */}
            <ul className="space-y-4">
              {[
                "AI synthesis from 4 sources with transparent citations",
                "Confidence scores + freshness on every field",
                "Hallucination detection—no made-up data",
                "HubSpot auto-sync: CRM writeback without manual entry"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#40E0D0]/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#0d9488]" />
                  </div>
                  <span className="text-gray-700 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Supporting paragraph */}
            <p className="text-gray-500 text-sm leading-relaxed">
              Canonical fields from multi-stage LLM processing. Configurable prompts let you customize enrichment behavior. Real-time SSE streaming so you can watch enrichment happen live.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="bg-[#40E0D0] hover:bg-[#20B2AA] text-[#0A1F3D]"
                asChild
              >
                <a href="/dashboard/playground">
                  Try the Playground
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#0A1F3D]/30 text-[#0A1F3D] hover:bg-[#0A1F3D]/10"
                asChild
              >
                <a href="/api-reference">
                  See schema
                  <Code className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Helper component for data fields
function DataField({
  label,
  value,
  confidence,
  source,
  freshness
}: {
  label: string;
  value: string;
  confidence: "High" | "Medium" | "Low";
  source: string;
  freshness: string;
}) {
  const confidenceColors = {
    High: { bg: "#10B98120", text: "#10B981" },
    Medium: { bg: "#F59E0B20", text: "#F59E0B" },
    Low: { bg: "#EF444420", text: "#EF4444" }
  };

  const colors = confidenceColors[confidence];

  return (
    <div className="border border-[#40E0D0]/10 rounded p-3 bg-[#0A1F3D]/30">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[#FAEBD7]/60 text-xs uppercase tracking-wide font-medium">{label}</span>
        <Badge
          style={{
            backgroundColor: colors.bg,
            color: colors.text,
            border: 0
          }}
          className="text-xs"
        >
          {confidence}
        </Badge>
      </div>
      <p className="text-[#FAEBD7] mb-2 font-medium">{value}</p>
      <div className="flex items-center gap-2 text-xs text-[#FAEBD7]/50">
        <Database className="w-3 h-3" />
        <span className="px-2 py-1 bg-[#40E0D0]/10 rounded text-[#40E0D0]">{source}</span>
        <span>•</span>
        <Clock className="w-3 h-3" />
        <span>{freshness}</span>
      </div>
    </div>
  );
}

// Helper component for audit entries
function AuditEntry({
  timestamp,
  action,
  source,
  confidence
}: {
  timestamp: string;
  action: string;
  source: string;
  confidence: string;
}) {
  const confidenceValue = parseInt(confidence);
  const confidenceColor = confidenceValue >= 90
    ? { bg: "#10B98120", text: "#10B981" }
    : confidenceValue >= 75
    ? { bg: "#F59E0B20", text: "#F59E0B" }
    : { bg: "#EF444420", text: "#EF4444" };

  return (
    <div className="border-l-2 border-[#40E0D0]/30 pl-4 py-2">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[#FAEBD7] text-sm font-medium">{action}</p>
        <Badge
          style={{
            backgroundColor: confidenceColor.bg,
            color: confidenceColor.text,
            border: 0
          }}
          className="text-xs"
        >
          {confidence}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-[#FAEBD7]/60 text-xs">
        <Database className="w-3 h-3" />
        <p>{source}</p>
      </div>
      <div className="flex items-center gap-2 text-[#FAEBD7]/40 text-xs mt-1">
        <Clock className="w-3 h-3" />
        <p>{timestamp}</p>
      </div>
    </div>
  );
}
