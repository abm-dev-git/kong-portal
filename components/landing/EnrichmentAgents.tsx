export function EnrichmentAgents() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-[#0A1F3D]">
      {/* Background Image with warm vintage treatment */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage: `url(/images/testimonial-bg.jpg)`,
        }}
      />

      {/* Gradient overlay for smooth transitions */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#F5F5DC]/20 via-transparent to-[#F5F5DC]/20" />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Large decorative quote mark */}
          <div className="text-[#40E0D0]/30 text-[120px] leading-none font-serif absolute left-1/2 -translate-x-1/2 -top-4 select-none" aria-hidden="true">
            &ldquo;
          </div>

          {/* Industry Insight */}
          <blockquote className="space-y-6 relative">
            <p
              className="text-[#FAEBD7] text-2xl lg:text-3xl leading-relaxed"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              &quot;Companies using multi-vendor enrichment strategies report 30% higher lead conversion rates—but only when they can consolidate data quality, audit trails, and governance into a single pipeline.&quot;
            </p>

            <footer className="pt-4">
              <div className="text-[#FAEBD7]">
                <div className="text-lg font-medium">Industry Research</div>
                <div className="text-[#40E0D0]">Openprise & Zapier Studies, 2025</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
