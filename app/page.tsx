import { Navigation } from "@/components/shared/Navigation";
import { Hero } from "@/components/landing/Hero";
import { EnrichmentFeature } from "@/components/landing/EnrichmentFeature";
import { ContentGeneration } from "@/components/landing/ContentGeneration";
import { QuickStart } from "@/components/landing/QuickStart";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--navy)]">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-[var(--turquoise)] focus:text-[var(--dark-blue)] focus:rounded focus:font-semibold focus:shadow-lg"
      >
        Skip to main content
      </a>

      {/* Custom Navigation - dark theme with auth awareness */}
      <Navigation />

      {/* Main Content */}
      <main id="main-content">
        <Hero />
        <EnrichmentFeature />
        <ContentGeneration />
        <QuickStart />
        <PricingTeaser />
        <CtaBand />
        <Footer />
      </main>
    </div>
  );
}
