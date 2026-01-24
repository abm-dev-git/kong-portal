import { Navigation } from "@/components/shared/Navigation";
import { Hero } from "@/components/landing/Hero";
import { EnrichmentFeature } from "@/components/landing/EnrichmentFeature";
import { FeaturesGrid } from "@/components/landing/FeaturesGrid";
import { QuickStart } from "@/components/landing/QuickStart";
import { PricingTeaser } from "@/components/landing/PricingTeaser";
import { CtaBand } from "@/components/landing/CtaBand";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* Main Content */}
      <main id="main-content">
        <Hero />
        <EnrichmentFeature />
        <FeaturesGrid />
        <QuickStart />
        <PricingTeaser />
        <CtaBand />
        <Footer />
      </main>
    </div>
  );
}
