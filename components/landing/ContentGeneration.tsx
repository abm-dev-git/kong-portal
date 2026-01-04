"use client";

import { Badge } from "../ui/badge";
import { Check, ArrowRight, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

// Editor Preview Component
function EditorPreview() {
  const [activeTab, setActiveTab] = useState<"A" | "B" | "C">("A");

  const handleKeyDown = (event: React.KeyboardEvent, tab: "A" | "B" | "C") => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setActiveTab(tab);
    }
  };

  const drafts = {
    A: {
      subject: "Congrats on the Series B, Sarah—let's talk about scaling your data stack",
      body: `Hi Sarah,

Saw Acme just close a $45M Series B—congrats! With that kind of growth capital, I imagine you're thinking hard about how to scale your data infrastructure without the usual enterprise tax.

We built abm.dev for teams like yours: high-quality account intelligence with confidence scores, deterministic enrichment, and transparent cost-plus pricing. No black-box vendors, no surprise bills.

Would love to show you how we're helping companies like Stripe and Plaid turn a seed email into verified, cited, fresh data in under 200ms.

Worth 15 minutes next week?

Best,
Alex`,
      rationale: ["New Funding", "Tech Fit", "Persona Pain"],
      sources: [
        { name: "Crunchbase", url: "#" },
        { name: "LinkedIn", url: "#" },
        { name: "Company Blog", url: "#" }
      ],
      validated: true
    },
    B: {
      subject: "Quick question about Acme's data enrichment strategy",
      body: `Hi Sarah,

I noticed Acme recently raised $45M in Series B funding. At that stage, data accuracy and pipeline reliability become critical—especially when you're scaling fast.

abm.dev provides GTM intelligence with full audit trails, confidence scoring, and cost controls. We've helped similar-stage companies reduce enrichment costs by 40% while improving data quality.

Happy to share a quick demo or sample response if you're interested.

Thanks,
Alex`,
      rationale: ["New Funding", "Cost Conscious"],
      sources: [
        { name: "Crunchbase", url: "#" },
        { name: "LinkedIn", url: "#" }
      ],
      validated: true
    },
    C: {
      subject: "Scaling your GTM stack post-Series B",
      body: `Sarah,

$45M is a great milestone. Now comes the hard part: scaling without breaking your pipeline.

We built abm.dev to solve exactly this—deterministic enrichment, transparent pricing, multi-model support. Teams at Stripe and Plaid use us to get verified account data with full citations and confidence scores.

Let me know if you'd like to see how it works.

Alex`,
      rationale: ["New Funding", "Direct Approach"],
      sources: [
        { name: "Crunchbase", url: "#" }
      ],
      validated: false
    }
  };

  const currentDraft = drafts[activeTab];

  return (
    <div className="bg-[var(--navy)]/50 border-2 border-[var(--electric-blue)]/30 rounded-lg backdrop-blur-sm overflow-hidden lg:mt-12">
      {/* Tabs */}
      <div className="border-b border-[var(--electric-blue)]/20 bg-[var(--navy)]/30">
        <div className="flex" role="tablist" aria-label="Content generation drafts">
          {(["A", "B", "C"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              onKeyDown={(e) => handleKeyDown(e, tab)}
              role="tab"
              aria-selected={activeTab === tab}
              aria-controls={`draft-panel-${tab}`}
              tabIndex={activeTab === tab ? 0 : -1}
              className={cn(
                "px-6 py-3 text-sm transition-colors",
                activeTab === tab
                  ? "text-[var(--electric-blue)] border-b-2 border-[var(--electric-blue)] bg-[var(--electric-blue)]/10"
                  : "text-[var(--cream)]/60 hover:text-[var(--cream)]"
              )}
              style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
              Draft {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-0" role="tabpanel" id={`draft-panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
        {/* Main Editor */}
        <div className="lg:col-span-8 p-6 border-r border-[var(--electric-blue)]/10">
          {/* Subject Line */}
          <div className="mb-4">
            <label className="text-[var(--cream)]/60 text-xs uppercase tracking-wide mb-2 block" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Subject
            </label>
            <div className="text-[var(--cream)] text-lg leading-relaxed">
              {currentDraft.subject.split(/(\{[^}]+\})/g).map((part, idx) => {
                if (part.startsWith("{") && part.endsWith("}")) {
                  return (
                    <span key={idx} className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] px-1 rounded">
                      {part}
                    </span>
                  );
                }
                return part;
              })}
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="text-[var(--cream)]/60 text-xs uppercase tracking-wide mb-2 block" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Body
            </label>
            <div className="text-[var(--cream)]/90 whitespace-pre-line leading-relaxed">
              {currentDraft.body.split(/(\$45M|Series B|Acme|Sarah|Stripe|Plaid|abm\.dev)/g).map((part, idx) => {
                if (["$45M", "Series B", "Acme", "Sarah", "Stripe", "Plaid", "abm.dev"].includes(part)) {
                  return (
                    <span key={idx} className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] px-0.5 rounded">
                      {part}
                    </span>
                  );
                }
                return part;
              })}
            </div>
          </div>
        </div>

        {/* Right Rail */}
        <div className="lg:col-span-4 p-6 space-y-6 bg-[var(--navy)]/30">
          {/* Rationale */}
          <div>
            <h4 className="text-[var(--cream)] text-sm uppercase tracking-wide mb-3" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Rationale
            </h4>
            <div className="flex flex-wrap gap-2">
              {currentDraft.rationale.map((item, idx) => (
                <Badge
                  key={idx}
                  className="bg-[var(--purple)]/20 text-[var(--purple)] border border-[var(--purple)]/30"
                  style={{
                    animationDelay: `${idx * 60}ms`,
                    animation: "fadeIn 0.3s ease-in forwards"
                  }}
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-[var(--cream)] text-sm uppercase tracking-wide mb-3" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Sources
            </h4>
            <div className="space-y-2">
              {currentDraft.sources.map((source, idx) => (
                <a
                  key={idx}
                  href={source.url}
                  className="flex items-center gap-2 text-[var(--electric-blue)] hover:text-[var(--turquoise)] transition-colors text-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  <span>{source.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Validate Badge */}
          <div>
            <h4 className="text-[var(--cream)] text-sm uppercase tracking-wide mb-3" style={{ fontFamily: '"Courier New", Courier, monospace' }}>
              Validation
            </h4>
            <Badge
              variant={currentDraft.validated ? "success" : "warning"}
            >
              {currentDraft.validated ? "Passed" : "Needs Review"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Section Component
export function ContentGeneration() {
  return (
    <section className="relative bg-[var(--navy)] py-16 lg:py-24 overflow-hidden">
      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* Left Column - Content & Process Rail */}
          <div className="lg:col-span-4 space-y-6">
            {/* Eyebrow */}
            <Badge variant="secondary" className="bg-[var(--electric-blue)]/20 text-[var(--electric-blue)] border border-[var(--electric-blue)]/30">
              From configuration to send-ready drafts
            </Badge>

            {/* H2 */}
            <h2 className="text-white text-4xl lg:text-5xl" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Content generation that adapts to your pipeline
            </h2>

            {/* Lead paragraph */}
            <p className="text-[var(--cream)] text-lg" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
              Provide a CRM reference, a prompt, and instructions from any source. The system resolves context, calls multiple models, and returns ranked drafts with rationale, citations, and validation—ready to review and ship.
            </p>

            {/* Bullet list */}
            <ul className="space-y-4">
              {[
                "Multi-model draft set: precision vs. speed options",
                "Rationale, source citations, and freshness tags",
                "Tone, length, and compliance constraints enforced",
                "Idempotent requests with request_id and audit logs"
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-[var(--electric-blue)]/20 flex items-center justify-center">
                    <Check className="w-3 h-3 text-[var(--electric-blue)]" />
                  </div>
                  <span className="text-[var(--cream)]">{item}</span>
                </li>
              ))}
            </ul>

            {/* Supporting paragraph */}
            <p className="text-[var(--cream)]/70 text-sm">
              The pipeline validates inputs, collects references, assembles prompts, generates drafts across providers, and quality-checks each output for tone, required elements, and personalization before returning results.
            </p>

            {/* CTA Row */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" className="bg-[var(--turquoise)] hover:bg-[var(--dark-turquoise)] text-[var(--navy)]">
                Generate a draft
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="border-[var(--electric-blue)] text-[var(--electric-blue)] hover:bg-[var(--electric-blue)]/10">
                See prompt package
              </Button>
            </div>
          </div>

          {/* Right Column - Editorial Preview */}
          <div className="lg:col-span-8">
            <EditorPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
