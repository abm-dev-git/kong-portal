import { Button } from "../ui/button";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";

export function CtaBand() {
  return (
    <section className="relative py-20 lg:py-28 bg-[var(--primary)] overflow-hidden">
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
          className="text-4xl lg:text-5xl font-bold text-[var(--primary-foreground)] mb-4"
          style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
        >
          Time to first call: 3 minutes
        </h2>
        <p className="text-lg text-[var(--primary-foreground)]/80 mb-8 max-w-2xl mx-auto">
          Get your API key, make your first enrichment call, and start building production-ready workflows today.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary CTA - Start Building - Navy on turquoise */}
          <Button
            size="lg"
            className="bg-[var(--background)] hover:bg-[var(--navy)] text-[var(--foreground)] font-semibold shadow-lg"
            asChild
          >
            <a href="/dashboard/api-keys">
              Start Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>

          {/* Secondary CTA - View Docs - White solid */}
          <Button
            size="lg"
            className="bg-white hover:bg-white/90 text-[var(--primary-foreground)] font-medium"
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
            className="text-[var(--primary-foreground)] hover:bg-[var(--primary-foreground)]/10 border border-[var(--primary-foreground)]/30"
            asChild
          >
            <a href="mailto:support@abm.dev?subject=Book a Pilot Program">
              <Calendar className="w-4 h-4 mr-2" />
              Book a Pilot
            </a>
          </Button>
        </div>

        {/* No credit card text */}
        <div className="mt-8 text-sm text-[var(--primary-foreground)]/60">
          No credit card required
        </div>
      </div>
    </section>
  );
}
