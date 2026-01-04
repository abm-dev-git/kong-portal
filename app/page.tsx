import { Navigation } from "@/components/shared/Navigation";
import {
  Hero,
  Footer,
  QuickStart,
  EnrichmentFeature,
  EnrichmentAgents,
  ContentGeneration,
  PricingTeaser,
  CtaBand
} from "@/components/landing";

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
        {/* Hero Section - full viewport with background image */}
        <Hero />

        {/* QuickStart - Get started in 3 minutes */}
        <QuickStart />

        {/* Enrichment Feature - tabbed demo with profile card */}
        <EnrichmentFeature />

        {/* Testimonial Section - full-width with background */}
        <EnrichmentAgents />

        {/* Content Generation - email preview demo */}
        <ContentGeneration />

        {/* Pricing Teaser - 3 tiers */}
        <PricingTeaser />

        {/* CTA Band - final conversion point */}
        <CtaBand />

        {/* Footer - columns variant, dark theme */}
        <Footer />
      </main>
    </div>
  );
}
