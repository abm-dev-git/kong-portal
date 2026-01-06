import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Rocket,
  BookOpen,
  Puzzle,
  FileCode,
  ArrowRight,
  Clock,
  Zap,
  Building2,
  Linkedin,
  Key,
  Shield
} from "lucide-react";

export const metadata = {
  title: "Documentation - ABM.dev",
  description: "Learn how to use ABM.dev for data enrichment and CRM integration",
};

interface DocCard {
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  time?: string;
  badge?: string;
}

const gettingStarted: DocCard = {
  title: "Getting Started",
  description: "Make your first API call in under 5 minutes. Get your API key, enrich your first contact, and explore the response.",
  href: "/docs/getting-started",
  icon: <Rocket className="w-6 h-6" />,
  time: "5 min",
  badge: "Start here",
};

const concepts: DocCard[] = [
  {
    title: "How Enrichment Works",
    description: "Understand our multi-source enrichment engine, confidence scores, and how we deliver accurate data.",
    href: "/docs/concepts/enrichment",
    icon: <Zap className="w-5 h-5" />,
    time: "8 min",
  },
  {
    title: "Authentication",
    description: "Learn about API keys, JWT tokens, and organization context for secure API access.",
    href: "/docs/concepts/authentication",
    icon: <Shield className="w-5 h-5" />,
    time: "5 min",
  },
];

const integrations: DocCard[] = [
  {
    title: "HubSpot Integration",
    description: "Connect your HubSpot CRM to automatically sync enriched data to your contacts and companies.",
    href: "/docs/guides/hubspot",
    icon: <Building2 className="w-5 h-5" />,
    time: "10 min",
  },
  {
    title: "LinkedIn Integration",
    description: "Set up LinkedIn profile enrichment using Browserbase for real-time data extraction.",
    href: "/docs/guides/linkedin",
    icon: <Linkedin className="w-5 h-5" />,
    time: "10 min",
  },
];

function CardLink({ card, featured = false }: { card: DocCard; featured?: boolean }) {
  return (
    <Link
      href={card.href}
      className={`group block p-6 rounded-lg border transition-all duration-200 ${
        featured
          ? "bg-[var(--turquoise)]/10 border-[var(--turquoise)]/30 hover:border-[var(--turquoise)]/50 hover:bg-[var(--turquoise)]/15"
          : "bg-[var(--dark-blue)]/50 border-[var(--turquoise)]/20 hover:border-[var(--turquoise)]/40 hover:bg-[var(--turquoise)]/5"
      }`}
    >
      <div className="flex items-start gap-4">
        <div className={`flex-shrink-0 p-2 rounded-lg ${
          featured ? "bg-[var(--turquoise)]/20 text-[var(--turquoise)]" : "bg-[var(--turquoise)]/10 text-[var(--turquoise)]"
        }`}>
          {card.icon}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-[var(--cream)] ${featured ? "text-lg" : "text-base"}`}>
              {card.title}
            </h3>
            {card.badge && (
              <Badge className="bg-[var(--turquoise)]/20 text-[var(--turquoise)] border-[var(--turquoise)]/30 text-xs">
                {card.badge}
              </Badge>
            )}
          </div>
          <p className="text-[var(--cream)]/60 text-sm mb-3">
            {card.description}
          </p>
          <div className="flex items-center gap-4">
            {card.time && (
              <span className="flex items-center gap-1 text-xs text-[var(--cream)]/40">
                <Clock className="w-3 h-3" />
                {card.time}
              </span>
            )}
            <span className="flex items-center gap-1 text-sm text-[var(--turquoise)] group-hover:gap-2 transition-all">
              Read guide
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <div className="space-y-4">
        <h1 className="text-3xl lg:text-4xl font-serif text-[var(--cream)]">
          Documentation
        </h1>
        <p className="text-lg text-[var(--cream)]/70 max-w-2xl">
          Everything you need to integrate ABM.dev into your workflow. From quick starts to detailed API references.
        </p>
      </div>

      {/* Getting Started - Featured */}
      <section>
        <CardLink card={gettingStarted} featured />
      </section>

      {/* Concepts */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-xl font-semibold text-[var(--cream)]">Concepts</h2>
        </div>
        <p className="text-[var(--cream)]/60 text-sm">
          Understand the core concepts behind ABM.dev
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {concepts.map((card) => (
            <CardLink key={card.href} card={card} />
          ))}
        </div>
      </section>

      {/* Integration Guides */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Puzzle className="w-5 h-5 text-[var(--turquoise)]" />
          <h2 className="text-xl font-semibold text-[var(--cream)]">Integration Guides</h2>
        </div>
        <p className="text-[var(--cream)]/60 text-sm">
          Step-by-step guides to connect your tools
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {integrations.map((card) => (
            <CardLink key={card.href} card={card} />
          ))}
        </div>
      </section>

      {/* API Reference CTA */}
      <section className="p-6 rounded-lg bg-gradient-to-r from-[var(--dark-blue)] to-[var(--navy)] border border-[var(--turquoise)]/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-[var(--turquoise)]/10">
              <FileCode className="w-6 h-6 text-[var(--turquoise)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--cream)]">API Reference</h3>
              <p className="text-sm text-[var(--cream)]/60">
                Complete API documentation with interactive examples
              </p>
            </div>
          </div>
          <Button
            asChild
            className="bg-[var(--turquoise)] text-[var(--dark-blue)] hover:bg-[var(--dark-turquoise)]"
          >
            <Link href="/api-reference">
              Explore API
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Quick Links */}
      <section className="p-6 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/10">
        <h3 className="font-semibold text-[var(--cream)] mb-4">Quick Links</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <Link
            href="/api-keys"
            className="flex items-center gap-2 text-sm text-[var(--cream)]/70 hover:text-[var(--turquoise)] transition-colors"
          >
            <Key className="w-4 h-4" />
            Get API Key
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-[var(--cream)]/70 hover:text-[var(--turquoise)] transition-colors"
          >
            <Rocket className="w-4 h-4" />
            Dashboard
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-2 text-sm text-[var(--cream)]/70 hover:text-[var(--turquoise)] transition-colors"
          >
            <Building2 className="w-4 h-4" />
            Settings
          </Link>
        </div>
      </section>
    </div>
  );
}
