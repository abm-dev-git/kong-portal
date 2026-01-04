export function EnrichmentAgents() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(/images/testimonial-bg.jpg)`,
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0A1F3D]/70" />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-8">
          {/* Quote */}
          <blockquote className="space-y-6">
            <p
              className="text-[#FAEBD7] text-2xl lg:text-3xl leading-relaxed"
              style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
            >
              &quot;abm.dev&apos;s confidence scores and audit trails ended the &apos;is this data real?&apos; debates. We retired three legacy vendors and consolidated our GTM pipeline without compromising quality.&quot;
            </p>

            <footer className="pt-4">
              <div className="text-[#FAEBD7]">
                <div className="text-lg">Oscar Avatare</div>
                <div className="text-[#FAEBD7]/70">CTO, Saphira AI</div>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}
