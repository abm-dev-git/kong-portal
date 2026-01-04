import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, DollarSign } from "lucide-react";
import { cn } from "@/lib/utils";

export function PricingTeaser() {
  return (
    <section className="py-20 lg:py-28 bg-[var(--cream)] relative overflow-hidden">
      {/* Film grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '128px 128px'
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <Badge
            variant="outline"
            className="mb-6 bg-[var(--navy)]/10 border-[var(--navy)]/20 text-[var(--navy)]"
          >
            Transparent pricing
          </Badge>

          <h2 className="text-[var(--navy)] mb-4 text-4xl lg:text-5xl font-serif">
            Transparent, cost-plus pricing
          </h2>
          <p className="text-lg text-[var(--navy)]/70 max-w-2xl mx-auto">
            No markup surprises. You see our costs, our margin floor, and exactly what you pay per enrichment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-12">
          {/* Free Tier */}
          <div className="bg-white border-2 border-[var(--navy)]/20 rounded-lg p-8 shadow-lg relative">

            <div className="mb-6">
              <h3 className="text-[var(--navy)] mb-3 text-2xl font-serif">
                Free
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[var(--navy)] text-4xl font-serif">
                  $0
                </span>
              </div>
              <p className="text-sm text-[var(--navy)]/70">
                5 enrichments + 5 drafts/month
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">Test API keys (sk_test)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">Full API access</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">OpenAPI docs</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">Community support</span>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
              asChild
            >
              <a href="/api-keys">Start Free</a>
            </Button>
          </div>

          {/* Pay-as-you-go - Featured/Most Popular */}
          <div className="bg-[var(--navy)] border-2 border-[var(--electric-blue)] rounded-lg p-8 shadow-xl relative transform scale-105">

            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge className="bg-[var(--electric-blue)] text-white border-0 font-mono uppercase text-xs px-4 py-1">
                MOST POPULAR
              </Badge>
            </div>

            <div className="mb-6">
              <h3 className="text-white mb-3 text-2xl font-serif">
                Pay-as-you-go
              </h3>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-[var(--turquoise)] text-3xl font-serif">
                    $0.15
                  </span>
                  <span className="text-sm text-white/70 font-mono">
                    /enrichment
                  </span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[var(--turquoise)] text-3xl font-serif">
                    $0.07
                  </span>
                  <span className="text-sm text-white/70 font-mono">
                    /draft
                  </span>
                </div>
              </div>
              <p className="text-sm text-white/80 mt-2">
                Volume discounts at scale
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-white">Production keys (sk_live)</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-white">Confidence scores & audit trails</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-white">Email support</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-white">99.9% SLA</span>
              </li>
            </ul>

            <Button
              className="w-full bg-[var(--electric-blue)] hover:bg-[var(--electric-blue)]/90 text-white border-0"
              asChild
            >
              <a href="/api-keys">Start Building</a>
            </Button>
          </div>

          {/* Enterprise */}
          <div className="bg-white border-2 border-[var(--navy)]/20 rounded-lg p-8 shadow-lg relative">

            <div className="mb-6">
              <h3 className="text-[var(--navy)] mb-3 text-2xl font-serif">
                Enterprise
              </h3>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-[var(--navy)] text-4xl font-serif">
                  Custom
                </span>
              </div>
              <p className="text-sm text-[var(--navy)]/70">
                Volume commitments & custom SLA
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">Dedicated support</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">Custom data sources</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">Private deployment options</span>
              </li>
              <li className="flex items-start gap-2 text-sm">
                <Check className="w-4 h-4 text-[var(--turquoise)] flex-shrink-0 mt-0.5" />
                <span className="text-[var(--navy)]">Custom SLA & success team</span>
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full border-2 border-[var(--navy)] text-[var(--navy)] hover:bg-[var(--navy)] hover:text-white"
              asChild
            >
              <a href="mailto:sales@abm.dev">Book a Pilot</a>
            </Button>
          </div>
        </div>

        {/* How cost-plus works - Explanation Card */}
        <div className="max-w-3xl mx-auto bg-white border-2 border-[var(--navy)]/30 rounded-lg p-8 shadow-lg relative">

          <div className="flex items-start gap-6">
            <div className="w-14 h-14 rounded-full bg-[var(--electric-blue)]/10 flex items-center justify-center flex-shrink-0 border-2 border-[var(--electric-blue)]/30">
              <DollarSign className="w-6 h-6 text-[var(--electric-blue)]" />
            </div>
            <div className="flex-1">
              <h4 className="text-[var(--navy)] mb-3 text-xl font-serif">
                How cost-plus works
              </h4>
              <p className="text-sm text-[var(--navy)]/70 mb-4 leading-relaxed">
                You see the upstream provider costs, our margin (minimum 15%), and your final price.
                As provider costs drop or you scale, your unit economics improve automatically.
              </p>
              <div
                className={cn(
                  "inline-flex items-center gap-3 text-xs bg-[var(--navy)] px-4 py-3 rounded border-2 border-[var(--turquoise)] font-mono"
                )}
              >
                <span className="text-white">Provider: $0.08</span>
                <span className="text-[var(--turquoise)]">+</span>
                <span className="text-white">Margin: $0.05</span>
                <span className="text-[var(--turquoise)]">=</span>
                <span className="text-[var(--turquoise)]">Your price: $0.13</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
