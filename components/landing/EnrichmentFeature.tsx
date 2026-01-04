"use client";

import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, ArrowRight, Code, Database, Clock } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function EnrichmentFeature() {
  const [activeTab, setActiveTab] = useState<"fields" | "json" | "audit">("fields");

  const handleKeyDown = (event: React.KeyboardEvent, tab: "fields" | "json" | "audit") => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveTab(tab);
    }
  };

  return (
    <section className="relative bg-[#F5F5DC] py-16 lg:py-24 overflow-hidden">
      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left Column - Product Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#0A1F3D] border border-[#40E0D0]/20 rounded-lg shadow-2xl overflow-hidden">
              {/* Tabs */}
              <div className="border-b border-[#40E0D0]/20 bg-[#0A1F3D]/50 backdrop-blur-sm">
                <div className="flex" role="tablist" aria-label="Enrichment data views">
                  {(["fields", "json", "audit"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      onKeyDown={(e) => handleKeyDown(e, tab)}
                      role="tab"
                      aria-selected={activeTab === tab}
                      aria-controls={`enrichment-panel-${tab}`}
                      tabIndex={activeTab === tab ? 0 : -1}
                      className={cn(
                        "px-6 py-3 text-sm capitalize transition-colors",
                        activeTab === tab
                          ? "text-[#40E0D0] border-b-2 border-[#40E0D0]"
                          : "text-[#FAEBD7]/60 hover:text-[#FAEBD7]"
                      )}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6" role="tabpanel" id={`enrichment-panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
                {activeTab === "fields" && (
                  <div className="space-y-4">
                    {/* Profile header */}
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#40E0D0] to-[#20B2AA] flex items-center justify-center text-[#0A1F3D] text-xl font-semibold">
                        JS
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-[#FAEBD7] text-lg font-semibold">Jane Smith</h3>
                          <Badge className="bg-[#10B981] text-white text-xs border-0">
                            High
                          </Badge>
                        </div>
                        <p className="text-[#FAEBD7]/60 text-sm">VP of Engineering</p>
                        <p className="text-[#FAEBD7]/60 text-sm">Acme Corp</p>
                      </div>
                    </div>

                    {/* Fields */}
                    <div className="space-y-3 pt-2">
                      <DataField
                        label="Email"
                        value="jane.smith@acme.com"
                        confidence="High"
                        source="LinkedIn, Clearbit"
                        freshness="Updated 2d ago"
                      />
                      <DataField
                        label="Title"
                        value="VP of Engineering"
                        confidence="High"
                        source="LinkedIn"
                        freshness="Updated 1w ago"
                      />
                      <DataField
                        label="Company"
                        value="Acme Corp"
                        confidence="High"
                        source="Clearbit, ZoomInfo"
                        freshness="Updated 3d ago"
                      />
                      <DataField
                        label="Phone"
                        value="+1 (555) 123-4567"
                        confidence="Medium"
                        source="Public records"
                        freshness="Updated 2w ago"
                      />
                    </div>
                  </div>
                )}

                {activeTab === "json" && (
                  <div className="bg-[#0A1F3D]/80 rounded p-4 overflow-x-auto">
                    <pre className="text-xs text-[#FAEBD7]" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
                      <code>{`{
  "person": {
    "name": "Jane Smith",
    "email": "jane.smith@acme.com",
    "title": "VP of Engineering",
    "confidence": 0.98,
    "sources": ["linkedin", "clearbit"],
    "updated_at": "2025-11-12T14:32:00Z"
  },
  "company": {
    "name": "Acme Corp",
    "domain": "acme.com",
    "employees": "500-1000",
    "confidence": 0.95
  }
}`}</code>
                    </pre>
                  </div>
                )}

                {activeTab === "audit" && (
                  <div className="space-y-3">
                    <AuditEntry
                      timestamp="2025-11-12 14:32"
                      action="Email verified"
                      source="LinkedIn API"
                      confidence="98%"
                    />
                    <AuditEntry
                      timestamp="2025-11-12 14:32"
                      action="Title confirmed"
                      source="LinkedIn Profile"
                      confidence="98%"
                    />
                    <AuditEntry
                      timestamp="2025-11-10 09:15"
                      action="Company data merged"
                      source="Clearbit + ZoomInfo"
                      confidence="95%"
                    />
                    <AuditEntry
                      timestamp="2025-11-05 16:22"
                      action="Phone number found"
                      source="Public records"
                      confidence="72%"
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
              Enrichment that won&apos;t break your pipeline
            </Badge>

            {/* H1 */}
            <h2 className="text-[#0A1F3D] text-4xl lg:text-5xl font-serif leading-tight">
              Simply the deepest, most accurate enrichment API
            </h2>

            {/* Lead paragraph */}
            <p className="text-[#0A1F3D]/80 text-lg font-serif leading-relaxed">
              Turn a seed like an email or domain into verified person and company intelligence with confidence scores, sources, and freshness—all in one consistent schema.
            </p>

            {/* Bullet list */}
            <ul className="space-y-4">
              {[
                "Deterministic over guesses with full audit trails",
                "Confidence-scored fields and freshness windows",
                "Cache, batch, and off-peak controls to cut costs"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[#40E0D0]/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[#40E0D0]" />
                  </div>
                  <span className="text-[#0A1F3D]/80 leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>

            {/* Supporting paragraph */}
            <p className="text-[#0A1F3D]/70 text-sm leading-relaxed">
              The engine merges multiple sources, normalizes to a canonical schema, and emits transparent citations so every field is explainable. Teams decide confidence thresholds and sources of record.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                size="lg"
                className="bg-[#40E0D0] hover:bg-[#20B2AA] text-[#0A1F3D]"
                asChild
              >
                <a href="/api-keys">
                  Get API key
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
