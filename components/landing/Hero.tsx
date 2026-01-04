import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BookOpen } from "lucide-react";

// Integration logos as SVG components
function HubSpotLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 512 512" fill="currentColor">
      <path d="M267.4 211.6c-25.1 23.7-40.8 57.3-40.8 94.6 0 37.3 15.7 70.9 40.8 94.6l-47.8 47.8c-11.8 11.8-30.8 11.8-42.6 0l-47.8-47.8c-25.1-23.7-40.8-57.3-40.8-94.6 0-37.3 15.7-70.9 40.8-94.6l47.8-47.8c11.8-11.8 30.8-11.8 42.6 0l47.8 47.8zm130.4 0l47.8-47.8c11.8-11.8 11.8-30.8 0-42.6l-47.8-47.8c-25.1-23.7-57.3-40.8-94.6-40.8-37.3 0-70.9 15.7-94.6 40.8l-47.8 47.8c-11.8 11.8-11.8 30.8 0 42.6l47.8 47.8c25.1 23.7 57.3 40.8 94.6 40.8 37.3 0 70.9-15.7 94.6-40.8z"/>
    </svg>
  );
}

function SalesforceLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M10.006 5.415c.808-.804 1.924-1.301 3.158-1.301 1.627 0 3.056.867 3.839 2.163.673-.278 1.407-.434 2.178-.434 3.138 0 5.681 2.543 5.681 5.681s-2.543 5.681-5.681 5.681c-.37 0-.73-.036-1.079-.103-.668 1.024-1.815 1.7-3.119 1.7-.593 0-1.152-.139-1.649-.387-.624 1.32-1.971 2.236-3.533 2.236-1.423 0-2.666-.762-3.347-1.899-.258.032-.521.049-.788.049-2.786 0-5.044-2.258-5.044-5.044 0-1.737.878-3.27 2.215-4.176-.165-.465-.256-.963-.256-1.482 0-2.44 1.978-4.417 4.417-4.417 1.041 0 1.999.361 2.754.964z"/>
    </svg>
  );
}

function GmailLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/>
    </svg>
  );
}

function OutlookLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 7.387v10.478c0 .23-.08.424-.238.576-.158.154-.352.23-.58.23h-8.547v-6.959l1.6 1.156c.103.07.22.104.35.104.13 0 .244-.036.342-.104l6.835-4.929v-.552h-.023l-7.154 5.156-1.95-1.406V6.217h8.547c.228 0 .422.077.58.23.158.152.238.347.238.576v.364zM14.635 6.217v12.454H.762c-.225 0-.42-.076-.58-.23-.16-.152-.24-.346-.24-.576V7.023c0-.23.08-.424.24-.576.16-.153.355-.23.58-.23h13.873zM8.47 17.376c1.27 0 2.36-.46 3.277-1.387.914-.925 1.373-2.043 1.373-3.353 0-1.31-.459-2.427-1.373-3.352-.916-.926-2.008-1.388-3.277-1.388-1.27 0-2.36.462-3.277 1.388-.917.925-1.374 2.043-1.374 3.352 0 1.31.457 2.428 1.374 3.353.916.926 2.008 1.387 3.277 1.387zm0-1.946c-.725 0-1.343-.263-1.852-.787-.51-.524-.764-1.155-.764-1.894 0-.74.255-1.37.764-1.894.51-.524 1.127-.787 1.852-.787.725 0 1.343.263 1.852.787.51.524.764 1.155.764 1.894 0 .74-.255 1.37-.764 1.894-.51.524-1.127.787-1.852.787z"/>
    </svg>
  );
}

function ZapierLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M15.633 1.69l-3.814 7.41L4.41 5.286l.003.003a5.26 5.26 0 00-.463.68l7.266 3.75-7.157 3.693a5.29 5.29 0 00.476.66l7.313-3.774 3.814 7.41a5.315 5.315 0 00.809-.082l-3.75-7.287 7.41 3.823a5.24 5.24 0 00.27-.758l-7.353-3.793 7.246-3.74a5.26 5.26 0 00-.318-.743l-7.194 3.712L15.633 1.69a5.315 5.315 0 00-.809.082z"/>
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background Image - Full visibility */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero-bg.jpg"
          alt="Professional modern service representative"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Minimal overlay - just enough for text readability on left side */}
        <div className="absolute inset-0 bg-[#0A1F3D]/40"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-start pt-32 lg:pt-40">
        <div className="max-w-2xl">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-[#40E0D0] text-[#0A1F3D] border-0 font-medium">
                GTM Intelligence API
              </Badge>
              <h1 className="text-white text-5xl lg:text-6xl drop-shadow-lg" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Rich, targeted personalization for the accounts that matter.
              </h1>
              <p className="text-xl text-white/90 max-w-xl drop-shadow-md" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Enrichment that&apos;s expansive, accurate and auditable.<br />
                Content generation that achieves unbelievable results.
              </p>
            </div>

            {/* CTAs - Distinct button styles */}
            <div className="flex flex-col sm:flex-row gap-4 mt-16">
              <Button
                size="lg"
                className="bg-[#40E0D0] hover:bg-[#20B2AA] text-[#0A1F3D] font-semibold px-8"
                asChild
              >
                <Link href="/sign-up">
                  Get API Key Free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="ghost"
                className="text-white hover:bg-white/20 border border-white/30"
                asChild
              >
                <Link href="/api-reference">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Read the Docs
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Integrations Bar - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-[#0A1F3D]/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-xs text-white/60 uppercase tracking-wider mb-4">Integrates with</p>
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <HubSpotLogo className="w-5 h-5" />
              <span className="text-sm font-medium">HubSpot</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <SalesforceLogo className="w-5 h-5" />
              <span className="text-sm font-medium">Salesforce</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <GmailLogo className="w-5 h-5" />
              <span className="text-sm font-medium">Gmail</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <OutlookLogo className="w-5 h-5" />
              <span className="text-sm font-medium">Outlook</span>
            </div>
            <div className="flex items-center gap-2 text-white/80 hover:text-white transition-colors">
              <ZapierLogo className="w-5 h-5" />
              <span className="text-sm font-medium">Zapier</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
