import { Button } from "../ui/button";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";

export function CtaBand() {
  return (
    <section className="relative py-20 lg:py-28 bg-[#40E0D0] overflow-hidden">
      {/* Subtle texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2
          className="text-4xl lg:text-5xl font-bold text-[#0A1F3D] mb-4"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Time to first call: 3 minutes
        </h2>
        <p className="text-lg text-[#0A1F3D]/80 mb-8 max-w-2xl mx-auto">
          Get your API key, make your first enrichment call, and start building production-ready workflows today.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary CTA - Start Building - Navy on turquoise */}
          <Button
            size="lg"
            className="bg-[#0A1F3D] hover:bg-[#1a1a2e] text-white font-semibold shadow-lg"
            asChild
          >
            <a href="/api-keys">
              Start Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>

          {/* Secondary CTA - View Docs - White solid */}
          <Button
            size="lg"
            className="bg-white hover:bg-white/90 text-[#0A1F3D] font-medium"
            asChild
          >
            <a href="/api-reference">
              <BookOpen className="w-4 h-4 mr-2" />
              View Docs
            </a>
          </Button>

          {/* Tertiary CTA - Book a Pilot - Ghost outline */}
          <Button
            size="lg"
            variant="ghost"
            className="text-[#0A1F3D] hover:bg-[#0A1F3D]/10 border border-[#0A1F3D]/30"
            asChild
          >
            <a href="mailto:support@abm.dev?subject=Book a Pilot Program">
              <Calendar className="w-4 h-4 mr-2" />
              Book a Pilot
            </a>
          </Button>
        </div>

        {/* No credit card text */}
        <div className="mt-8 text-sm text-[#0A1F3D]/60">
          No credit card required
        </div>
      </div>
    </section>
  );
}
