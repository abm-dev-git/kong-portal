"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Zap } from "lucide-react";
import { SiHubspot, SiLinkedin } from "react-icons/si";

export function Hero() {
  return (
    <section className="relative min-h-[85vh] overflow-hidden bg-[#0A1628]">
      {/* Solid background for text area */}
      <div className="absolute inset-0 bg-[#0A1628]" />

      {/* Film grain texture for retro feel */}
      <div className="absolute inset-0 film-grain opacity-10" />

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
                <Zap className="w-3.5 h-3.5 mr-1.5" />
                B2B Data Enrichment API
              </Badge>
            </div>

            {/* Headline - Retro serif typography */}
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.05] tracking-tight animate-fade-in-up animate-delay-100"
              style={{ fontFamily: 'Playfair Display, Georgia, "Times New Roman", serif' }}
            >
              <span className="text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">Know your customer</span>
              <br />
              <span className="text-[#40E0D0] drop-shadow-[0_2px_10px_rgba(64,224,208,0.3)]">
                before they know they are.
              </span>
            </h1>

            {/* Subheadline - Warm, relationship-focused */}
            <p
              className="text-2xl lg:text-3xl text-white font-medium max-w-xl leading-relaxed animate-fade-in-up animate-delay-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]"
              style={{ fontFamily: 'Playfair Display, Georgia, "Times New Roman", serif' }}
            >
              30+ verified data points per relationship, each one sourced live, scored, and ready for your team to act upon.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-start gap-4 pt-2 animate-fade-in-up animate-delay-300">
              <Button
                size="lg"
                className="bg-[var(--turquoise)] hover:bg-[var(--dark-turquoise)] text-[#0A1628] font-bold text-lg px-10 py-7 shadow-lg shadow-[var(--turquoise)]/30 hover:shadow-xl hover:shadow-[var(--turquoise)]/40 hover:scale-[1.02] transition-all duration-300"
                asChild
              >
                <Link href="/dashboard">
                  Start Building
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Link
                href="/api-reference"
                className="text-[var(--cream)] hover:text-white text-sm underline underline-offset-4 py-3 transition-colors"
                style={{ fontFamily: 'Courier New, monospace' }}
              >
                View API Documentation →
              </Link>
            </div>

            {/* Trust indicators - honest, developer-focused */}
            <div className="pt-6 flex flex-wrap items-center gap-6 text-sm text-[var(--cream)] animate-fade-in-up animate-delay-400" style={{ fontFamily: 'Courier New, monospace' }}>
              <span className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-400" />
                No credit card required
              </span>
              <span className="flex items-center gap-2">
                OpenAPI spec included
              </span>
              <span className="flex items-center gap-2">
                TypeScript SDK
              </span>
            </div>
          </div>

          {/* Right Column - Framed hero image like mesa.dev */}
          <div className="relative hidden lg:block">
            <div
              className="relative overflow-hidden"
              style={{
                border: '1px solid rgba(10, 22, 40, 0.8)',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
              }}
            >
              {/* The framed image */}
              <img
                src="/images/hero-bg.jpg"
                alt="Professional woman representing ABM intelligence"
                className="w-full h-auto object-cover"
                style={{
                  minHeight: '480px',
                  maxHeight: '580px',
                  objectPosition: '75% center'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Real Data Sources - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[var(--navy)] to-transparent pt-20 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-sm text-[var(--cream)] mb-6 text-center lg:text-left" style={{ fontFamily: 'Courier New, monospace' }}>
            Real data sources, unified schema
          </p>
          <div className="flex items-center justify-center lg:justify-start gap-4 flex-wrap">
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <SiHubspot className="w-5 h-5 text-[#ff7a59]" />
              <span className="text-sm text-white font-medium">HubSpot</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <SiLinkedin className="w-5 h-5 text-[#0A66C2]" />
              <span className="text-sm text-white font-medium">LinkedIn</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <svg className="w-5 h-5 text-[#ff6b35]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
              <span className="text-sm text-white font-medium">Hunter.io</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <svg className="w-5 h-5 text-[#20808D]" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10"/>
              </svg>
              <span className="text-sm text-white font-medium">Perplexity AI</span>
            </div>
            <div className="integration-logo flex items-center gap-2 px-5 py-2.5 border border-[var(--cream)]/30 rounded-lg bg-[var(--cream)]/10 backdrop-blur-sm hover:bg-[var(--cream)]/15 hover:border-[var(--turquoise)]/50 transition-all duration-300 cursor-default">
              <svg className="w-5 h-5 text-[#5436DA]" viewBox="0 0 24 24" fill="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="3"/>
              </svg>
              <span className="text-sm text-white font-medium">Tavily</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
