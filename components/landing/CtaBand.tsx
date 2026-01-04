import { Button } from "../ui/button";
import { ArrowRight, BookOpen, Calendar } from "lucide-react";

export function CtaBand() {
  return (
    <section className="relative py-20 lg:py-28 bg-[var(--navy)] overflow-hidden">
      {/* Decorative blur circles */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--turquoise)] rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--turquoise)] rounded-full blur-3xl opacity-80"></div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h2 className="text-4xl lg:text-5xl font-bold text-[var(--cream)] mb-4">
          Time to first call: 3 minutes
        </h2>
        <p className="text-lg text-[var(--cream)]/80 mb-8 max-w-2xl mx-auto">
          Get your API key, make your first enrichment call, and start building production-ready workflows today.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          {/* Primary CTA - Start Building */}
          <Button
            size="lg"
            className="bg-[var(--turquoise)] hover:bg-[var(--turquoise)]/90 text-[var(--navy)] font-semibold"
            asChild
          >
            <a href="/api-keys">
              Start Building
              <ArrowRight className="w-4 h-4 ml-2" />
            </a>
          </Button>

          {/* Secondary CTA - View Docs */}
          <Button
            size="lg"
            variant="outline"
            className="border-[var(--cream)]/30 bg-transparent text-[var(--cream)] hover:bg-[var(--cream)]/10 hover:text-[var(--cream)] hover:border-[var(--cream)]/50"
            asChild
          >
            <a href="/api-reference">
              View Docs
              <BookOpen className="w-4 h-4 ml-2" />
            </a>
          </Button>

          {/* Tertiary CTA - Book a Pilot */}
          <Button
            size="lg"
            variant="outline"
            className="border-[var(--cream)]/30 bg-transparent text-[var(--cream)] hover:bg-[var(--cream)]/10 hover:text-[var(--cream)] hover:border-[var(--cream)]/50"
            asChild
          >
            <a href="mailto:support@abm.dev?subject=Book a Pilot Program">
              Book a Pilot
              <Calendar className="w-4 h-4 ml-2" />
            </a>
          </Button>
        </div>

        {/* No credit card text */}
        <div className="mt-8 text-sm text-[var(--cream)]/60">
          No credit card required
        </div>
      </div>
    </section>
  );
}
