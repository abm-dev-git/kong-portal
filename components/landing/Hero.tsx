"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { SiHubspot, SiSalesforce, SiGmail } from "react-icons/si";
import { Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden bg-[#0A1628]">
      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      />

      {/* Gradient overlay for text readability - dark across most of width */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0A1628] via-[#0A1628]/95 to-[#0A1628]/40 lg:via-[#0A1628]/90" />

      {/* Film grain texture for retro feel */}
      <div className="absolute inset-0 film-grain opacity-30" />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 lg:pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 animate-fade-in-up">
              <Badge
                variant="secondary"
                className="bg-[var(--turquoise)]/10 text-[var(--turquoise)] border border-[var(--turquoise)]/30 backdrop-blur-sm px-4 py-1.5 text-sm"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                GTM Intelligence Platform
              </Badge>
            </div>

            {/* Headline - Transformation-focused */}
            <h1 className="font-serif text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight animate-fade-in-up animate-delay-100 drop-shadow-lg">
              Every Decision,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--turquoise)] to-[var(--electric-blue)] drop-shadow-none">
                Powered by Intelligence
              </span>
            </h1>

            {/* Subheadline */}
            <p className="font-serif text-xl lg:text-2xl text-white max-w-md leading-relaxed animate-fade-in-up animate-delay-200 drop-shadow-md">
              Enrich leads with verified company data, generate targeted content,
              and surface intent signals—all in one API built for GTM teams.
            </p>

            {/* Single Primary CTA */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2 animate-fade-in-up animate-delay-300">
              <Button
                size="lg"
                className="bg-[var(--turquoise)] hover:bg-[var(--dark-turquoise)] text-[#0A1628] font-bold text-lg px-10 py-7 shadow-lg shadow-[var(--turquoise)]/30 hover:shadow-xl hover:shadow-[var(--turquoise)]/40 hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link href="/dashboard">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Link
                href="/api-reference"
                className="text-[var(--cream)] hover:text-white text-sm underline underline-offset-4 py-3 transition-colors"
              >
                View API Documentation →
              </Link>
            </div>

            {/* Minimal trust indicator */}
            <div className="pt-6 flex items-center gap-3 text-sm text-[var(--cream)] animate-fade-in-up animate-delay-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                No credit card required
              </span>
            </div>
          </div>

          {/* Right Column - Empty to let hero image show through */}
          <div className="relative hidden lg:block">
            {/* Hero image shows through on right side */}
          </div>
        </div>

        {/* Enhanced Social Proof Bar */}
        <div className="relative z-10 mt-16 pt-8 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              {/* Trust metric */}
              <div className="flex items-center gap-8 text-center lg:text-left">
                <div>
                  <div className="text-3xl font-bold text-white">500+</div>
                  <div className="text-sm text-[var(--cream)]">GTM Teams</div>
                </div>
                <div className="h-10 w-px bg-[var(--cream)]/40 hidden lg:block" />
                <div>
                  <div className="text-3xl font-bold text-white">10M+</div>
                  <div className="text-sm text-[var(--cream)]">Enrichments/month</div>
                </div>
                <div className="h-10 w-px bg-[var(--cream)]/40 hidden lg:block" />
                <div>
                  <div className="text-3xl font-bold text-[var(--turquoise)]">98%</div>
                  <div className="text-sm text-[var(--cream)]">Data Accuracy</div>
                </div>
              </div>

              {/* Compliance badges */}
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded border border-[var(--cream)]/50 bg-[var(--cream)]/10 text-xs text-[var(--cream)] font-medium">
                  SOC 2 Type II
                </div>
                <div className="px-3 py-1.5 rounded border border-[var(--cream)]/50 bg-[var(--cream)]/10 text-xs text-[var(--cream)] font-medium">
                  GDPR Ready
                </div>
                <div className="px-3 py-1.5 rounded border border-[var(--cream)]/50 bg-[var(--cream)]/10 text-xs text-[var(--cream)] font-medium">
                  CCPA Compliant
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Integration logos - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[var(--navy)] to-transparent pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--cream)] mb-6 text-center lg:text-left">Integrates with your stack</p>
          <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <SiHubspot className="w-5 h-5 text-[#ff7a59]" />
              <span className="text-sm text-white font-medium">HubSpot</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <SiSalesforce className="w-5 h-5 text-[#00a1e0]" />
              <span className="text-sm text-white font-medium">Salesforce</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <SiGmail className="w-5 h-5 text-[#ea4335]" />
              <span className="text-sm text-white font-medium">Gmail</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <Mail className="w-5 h-5 text-[#0078d4]" />
              <span className="text-sm text-white font-medium">Outlook</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
