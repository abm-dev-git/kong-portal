import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Code, Mail } from "lucide-react";
import { SiHubspot, SiSalesforce, SiGmail } from "react-icons/si";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[var(--navy)]">
      {/* Background with gradient (no image for initial setup) */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--navy)] via-[var(--dark-blue)] to-[var(--navy)]">
        {/* Film grain texture */}
        <div className="absolute inset-0 film-grain opacity-50"></div>
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen flex items-start pt-32 lg:pt-40">
        <div className="max-w-3xl">
          <div className="space-y-8">
            <div className="space-y-6">
              <Badge variant="secondary" className="bg-[#40E0D0]/20 text-white border border-[#40E0D0]/30 backdrop-blur-sm">
                GTM Intelligence API
              </Badge>
              <h1 className="text-white text-5xl lg:text-6xl" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Rich, targeted personalization for the accounts that matter.
              </h1>
              <p className="text-xl text-[#F5F5DC] max-w-2xl" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
                Enrichment that&apos;s expansive, accurate and auditable.<br />
                Content generation that achieves unbelievable results.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 mt-20 lg:mt-24">
              <Button
                size="lg"
                className="bg-[#40E0D0] hover:bg-[#20B2AA] text-[#0A1F3D] shadow-xl"
                asChild
              >
                <Link href="/dashboard">
                  Start Building
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-[#F5F5DC]/40 bg-[#F5F5DC]/10 text-[#F5F5DC] hover:bg-[#F5F5DC]/20 backdrop-blur-sm"
                asChild
              >
                <Link href="/api-reference">
                  View Docs
                  <Code className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Proof/Integrations - Bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-[var(--navy)]/95 to-transparent backdrop-blur-sm border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-sm text-white/70 mb-4">Built for</p>
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <SiHubspot className="w-5 h-5 text-[#ff7a59]" />
              <span className="text-sm text-white">HubSpot</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <SiSalesforce className="w-5 h-5 text-[#00a1e0]" />
              <span className="text-sm text-white">Salesforce</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <SiGmail className="w-5 h-5 text-[#ea4335]" />
              <span className="text-sm text-white">Gmail</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 border border-white/20 rounded-md bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <Mail className="w-5 h-5 text-[#0078d4]" />
              <span className="text-sm text-white">Outlook</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
