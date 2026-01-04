import { Navigation } from "@/components/shared/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Footer } from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[var(--navy)]">
      <Navigation />
      <Hero />
      <Footer />
    </main>
  );
}
