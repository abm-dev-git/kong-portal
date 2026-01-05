"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Sparkles, Zap, Shield, BarChart3 } from "lucide-react";
import { SiHubspot, SiSalesforce, SiGmail } from "react-icons/si";
import { Mail } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-[100vh] overflow-hidden">
      {/* Hero background image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/images/hero-bg.jpg)' }}
      />

      {/* Gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)]/95 via-[var(--navy)]/80 to-transparent" />

      {/* Film grain texture for retro feel */}
      <div className="absolute inset-0 film-grain opacity-40" />

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
            <h1 className="font-serif text-white text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] tracking-tight animate-fade-in-up animate-delay-100">
              Every Decision,{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--turquoise)] to-[var(--electric-blue)]">
                Powered by Intelligence
              </span>
            </h1>

            {/* Subheadline */}
            <p className="font-serif text-xl lg:text-2xl text-[var(--cream)]/80 max-w-xl leading-relaxed animate-fade-in-up animate-delay-200">
              Enrich leads with verified company data, generate targeted content,
              and surface intent signals—all in one API built for GTM teams.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-3 animate-fade-in-up animate-delay-300">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-[var(--turquoise)]/30 transition-all duration-300">
                <Shield className="w-4 h-4 text-[var(--turquoise)]" />
                Confidence Scores
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-[var(--turquoise)]/30 transition-all duration-300">
                <BarChart3 className="w-4 h-4 text-[var(--turquoise)]" />
                Full Audit Trails
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm text-white/80 hover:bg-white/10 hover:border-[var(--turquoise)]/30 transition-all duration-300">
                <Zap className="w-4 h-4 text-[var(--turquoise)]" />
                Sub-200ms Response
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fade-in-up animate-delay-400">
              <Button
                size="lg"
                className="bg-[var(--turquoise)] hover:bg-[var(--dark-turquoise)] text-[var(--dark-blue)] font-semibold text-lg px-8 py-6 shadow-lg shadow-[var(--turquoise)]/25 hover:shadow-xl hover:shadow-[var(--turquoise)]/30 hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link href="/dashboard">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:border-white/30 text-lg px-8 py-6 backdrop-blur-sm hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link href="/api-reference">
                  View API Docs
                  <Code className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>

            {/* Social proof */}
            <div className="pt-4 flex items-center gap-4 text-sm text-white/60 animate-fade-in-up animate-delay-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                99.9% uptime
              </span>
              <span>•</span>
              <span>No credit card required</span>
              <span>•</span>
              <span>SOC 2 compliant</span>
            </div>
          </div>

          {/* Right Column - Visual Element */}
          <div className="relative hidden lg:block animate-fade-in-up animate-delay-300">
            {/* Floating code card */}
            <div className="relative animate-float-slow">
              {/* Glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-r from-[var(--turquoise)]/20 to-[var(--electric-blue)]/20 rounded-2xl blur-xl" />

              {/* Main card */}
              <div className="relative bg-[var(--navy)]/80 backdrop-blur-xl border border-[var(--turquoise)]/20 rounded-xl shadow-2xl overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-black/20">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/80" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                    <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  </div>
                  <span className="text-xs text-white/40 ml-2 font-mono">enrich-response.json</span>
                </div>

                {/* Code content */}
                <div className="p-6 font-mono text-sm overflow-hidden">
                  <pre className="text-white/90">
                    <code>{`{
  "person": {
    "name": "Jane Smith",
    "title": "VP Engineering",
    "confidence": 0.98,
    "sources": ["linkedin", "clearbit"]
  },
  "company": {
    "name": "Acme Corp",
    "employees": "500-1000",
    "funding": "Series B"
  }
}`}</code>
                  </pre>
                </div>

                {/* Stats bar */}
                <div className="px-6 py-4 border-t border-white/10 bg-black/20 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400" />
                      <span className="text-xs text-white/60">98% confidence</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--turquoise)]" />
                      <span className="text-xs text-white/60">143ms</span>
                    </div>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                    Fresh
                  </Badge>
                </div>
              </div>

              {/* Floating badges */}
              <div className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full bg-[var(--electric-blue)] text-white text-xs font-medium shadow-lg shadow-[var(--electric-blue)]/50">
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Live API
                </span>
              </div>
            </div>
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
                  <div className="text-sm text-white/60">GTM Teams</div>
                </div>
                <div className="h-10 w-px bg-white/20 hidden lg:block" />
                <div>
                  <div className="text-3xl font-bold text-white">10M+</div>
                  <div className="text-sm text-white/60">Enrichments/month</div>
                </div>
                <div className="h-10 w-px bg-white/20 hidden lg:block" />
                <div>
                  <div className="text-3xl font-bold text-[var(--turquoise)]">98%</div>
                  <div className="text-sm text-white/60">Data Accuracy</div>
                </div>
              </div>

              {/* Compliance badges */}
              <div className="flex items-center gap-4">
                <div className="px-3 py-1.5 rounded border border-white/20 bg-white/5 text-xs text-white/70 font-medium">
                  SOC 2 Type II
                </div>
                <div className="px-3 py-1.5 rounded border border-white/20 bg-white/5 text-xs text-white/70 font-medium">
                  GDPR Ready
                </div>
                <div className="px-3 py-1.5 rounded border border-white/20 bg-white/5 text-xs text-white/70 font-medium">
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
          <p className="text-sm text-white/50 mb-6 text-center lg:text-left">Integrates with your stack</p>
          <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-[var(--turquoise)]/30 transition-all duration-300 cursor-default">
              <SiHubspot className="w-5 h-5 text-[#ff7a59]" />
              <span className="text-sm text-white font-medium">HubSpot</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-[var(--turquoise)]/30 transition-all duration-300 cursor-default">
              <SiSalesforce className="w-5 h-5 text-[#00a1e0]" />
              <span className="text-sm text-white font-medium">Salesforce</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-[var(--turquoise)]/30 transition-all duration-300 cursor-default">
              <SiGmail className="w-5 h-5 text-[#ea4335]" />
              <span className="text-sm text-white font-medium">Gmail</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-white/10 rounded-lg bg-white/5 backdrop-blur-sm hover:bg-white/10 hover:border-[var(--turquoise)]/30 transition-all duration-300 cursor-default">
              <Mail className="w-5 h-5 text-[#0078d4]" />
              <span className="text-sm text-white font-medium">Outlook</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
