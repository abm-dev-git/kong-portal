"use client";

import { useState } from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Copy, Check, ArrowRight, Key, Sparkles } from "lucide-react";

type Language = "curl" | "javascript" | "python";

const codeExamples: Record<Language, string> = {
  curl: `curl -X POST https://api.abm.dev/v1/enrich \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "email": "jane.smith@acme.com"
  }'`,
  javascript: `const response = await fetch('https://api.abm.dev/v1/enrich', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'jane.smith@acme.com'
  }),
});

const data = await response.json();
console.log(data);`,
  python: `import requests

response = requests.post(
    'https://api.abm.dev/v1/enrich',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json',
    },
    json={
        'email': 'jane.smith@acme.com'
    }
)

data = response.json()
print(data)`,
};

const languageLabels: Record<Language, string> = {
  curl: "cURL",
  javascript: "JavaScript",
  python: "Python",
};

export function QuickStart() {
  const [selectedLang, setSelectedLang] = useState<Language>("curl");
  const [copied, setCopied] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(codeExamples[selectedLang]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (event: React.KeyboardEvent, lang: Language) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setSelectedLang(lang);
    }
  };

  const handleCopyToClaude = async () => {
    const claudePrompt = `I'm integrating the ABM.dev API for data enrichment.

Here's my current code:
\`\`\`${selectedLang}
${codeExamples[selectedLang]}
\`\`\`

API Documentation: https://abm.dev/api

Help me:
1. Understand what this code does
2. Handle errors properly
3. Implement best practices for rate limiting and retries`;

    await navigator.clipboard.writeText(claudePrompt);
    setCopiedClaude(true);
    setTimeout(() => setCopiedClaude(false), 2000);
  };

  return (
    <section className="relative bg-[#F5F5DC] py-16 lg:py-24 overflow-hidden">
      {/* Subtle noise texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <Badge
            variant="secondary"
            className="bg-[#40E0D0]/20 text-[#0A1F3D] border border-[#40E0D0]/50 mb-4"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            Start in 3 minutes
          </Badge>
          <h2
            className="text-[#0A1F3D] text-4xl lg:text-5xl font-serif leading-tight mb-4"
          >
            Get started with one API call
          </h2>
          <p className="text-[#0A1F3D]/70 text-lg max-w-2xl mx-auto">
            Sign up, grab your API key, and enrich your first contact in under 3 minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Left: Steps */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#40E0D0] flex items-center justify-center text-[#0A1F3D] font-bold">
                1
              </div>
              <div>
                <h3 className="text-[#0A1F3D] text-lg font-semibold mb-2">Get your API key</h3>
                <p className="text-[#0A1F3D]/70 mb-3">
                  Create a free account and generate your API key instantly.
                </p>
                <Button
                  className="bg-[#40E0D0] hover:bg-[#20B2AA] text-[#0A1F3D]"
                  asChild
                >
                  <a href="/api-keys">
                    <Key className="w-4 h-4 mr-2" />
                    Get API Key
                  </a>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#40E0D0]/30 flex items-center justify-center text-[#0A1F3D] font-bold border-2 border-[#40E0D0]">
                2
              </div>
              <div>
                <h3 className="text-[#0A1F3D] text-lg font-semibold mb-2">Make your first request</h3>
                <p className="text-[#0A1F3D]/70">
                  Use the code example on the right. Replace <code className="bg-[#0A1F3D]/10 px-1 rounded text-sm">YOUR_API_KEY</code> with your actual key.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#40E0D0]/30 flex items-center justify-center text-[#0A1F3D] font-bold border-2 border-[#40E0D0]">
                3
              </div>
              <div>
                <h3 className="text-[#0A1F3D] text-lg font-semibold mb-2">Explore the response</h3>
                <p className="text-[#0A1F3D]/70 mb-3">
                  Get enriched data with confidence scores, sources, and freshness indicators.
                </p>
                <Button
                  variant="outline"
                  className="border-[#0A1F3D]/30 text-[#0A1F3D] hover:bg-[#0A1F3D]/10"
                  asChild
                >
                  <a href="/api-reference">
                    View Full API Reference
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Right: Code Example */}
          <div className="bg-[#0A1F3D] rounded-lg shadow-2xl overflow-hidden">
            {/* Language Tabs */}
            <div className="border-b border-[#40E0D0]/20 bg-[#0A1F3D]/50">
              <div className="flex" role="tablist" aria-label="Code example languages">
                {(Object.keys(codeExamples) as Language[]).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLang(lang)}
                    onKeyDown={(e) => handleKeyDown(e, lang)}
                    role="tab"
                    aria-selected={selectedLang === lang}
                    aria-controls={`code-panel-${lang}`}
                    tabIndex={selectedLang === lang ? 0 : -1}
                    className={`px-4 py-3 text-sm transition-colors ${
                      selectedLang === lang
                        ? "text-[#40E0D0] border-b-2 border-[#40E0D0]"
                        : "text-[#FAEBD7]/60 hover:text-[#FAEBD7]"
                    }`}
                  >
                    {languageLabels[lang]}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Block */}
            <div className="p-4 relative" role="tabpanel" id={`code-panel-${selectedLang}`} aria-labelledby={`tab-${selectedLang}`}>
              <pre className="text-[#FAEBD7] text-sm overflow-x-auto">
                <code>{codeExamples[selectedLang]}</code>
              </pre>
            </div>

            {/* Actions */}
            <div className="border-t border-[#40E0D0]/20 p-4 flex gap-3 flex-wrap">
              {/* Screen reader announcements for copy actions */}
              <div role="status" aria-live="polite" className="sr-only">
                {copied && "Code copied to clipboard"}
                {copiedClaude && "Prompt copied to clipboard for Claude"}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="border-[#40E0D0]/30 text-[#FAEBD7] hover:bg-[#40E0D0]/20 hover:text-[#FAEBD7]"
                aria-label={copied ? "Code copied" : "Copy code to clipboard"}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 mr-2" aria-hidden="true" />
                    Copy Code
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClaude}
                className="border-[#FF6347]/30 text-[#FAEBD7] hover:bg-[#FF6347]/20 hover:text-[#FAEBD7]"
                aria-label={copiedClaude ? "Prompt copied for Claude" : "Copy prompt to clipboard for Claude"}
              >
                {copiedClaude ? (
                  <>
                    <Check className="w-4 h-4 mr-2 text-green-400" aria-hidden="true" />
                    Copied for Claude!
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2 text-[#FF6347]" aria-hidden="true" />
                    Copy to Claude
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
