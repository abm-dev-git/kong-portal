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
    <main className="min-h-screen bg-[var(--navy)]">
      <Navigation />
      <Hero />
      <EnrichmentFeature />
      <ContentGeneration />
      <QuickStart />
      <PricingTeaser />
      <CtaBand />
      <Footer />
    </main>
  );
}
