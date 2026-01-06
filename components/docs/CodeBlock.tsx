"use client";

import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Language = "curl" | "javascript" | "python";

interface CodeExample {
  curl?: string;
  javascript?: string;
  python?: string;
}

interface CodeBlockProps {
  examples: CodeExample;
  title?: string;
  showCopyToClaude?: boolean;
  className?: string;
}

const languageLabels: Record<Language, string> = {
  curl: "cURL",
  javascript: "JavaScript",
  python: "Python",
};

export function CodeBlock({
  examples,
  title,
  showCopyToClaude = false,
  className
}: CodeBlockProps) {
  const availableLanguages = Object.keys(examples).filter(
    (lang) => examples[lang as Language]
  ) as Language[];

  const [selectedLang, setSelectedLang] = useState<Language>(
    availableLanguages[0] || "curl"
  );
  const [copied, setCopied] = useState(false);
  const [copiedClaude, setCopiedClaude] = useState(false);

  const currentCode = examples[selectedLang] || "";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleKeyDown = (event: React.KeyboardEvent, lang: Language) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedLang(lang);
    }
  };

  const handleCopyToClaude = async () => {
    const claudePrompt = `I'm integrating the ABM.dev API.

Here's my current code:
\`\`\`${selectedLang}
${currentCode}
\`\`\`

API Documentation: https://abm.dev/docs

Help me:
1. Understand what this code does
2. Handle errors properly
3. Implement best practices`;

    await navigator.clipboard.writeText(claudePrompt);
    setCopiedClaude(true);
    setTimeout(() => setCopiedClaude(false), 2000);
  };

  return (
    <div className={cn("bg-[var(--dark-blue)] rounded-lg overflow-hidden border border-[var(--turquoise)]/20", className)}>
      {/* Header with language tabs */}
      <div className="border-b border-[var(--turquoise)]/20 bg-[var(--dark-blue)]/50">
        <div className="flex items-center justify-between">
          <div className="flex" role="tablist" aria-label="Code example languages">
            {availableLanguages.map((lang) => (
              <button
                key={lang}
                onClick={() => setSelectedLang(lang)}
                onKeyDown={(e) => handleKeyDown(e, lang)}
                role="tab"
                aria-selected={selectedLang === lang}
                aria-controls={`code-panel-${lang}`}
                tabIndex={selectedLang === lang ? 0 : -1}
                className={cn(
                  "px-4 py-3 text-sm transition-colors",
                  selectedLang === lang
                    ? "text-[var(--turquoise)] border-b-2 border-[var(--turquoise)]"
                    : "text-[var(--cream)]/60 hover:text-[var(--cream)]"
                )}
              >
                {languageLabels[lang]}
              </button>
            ))}
          </div>
          {title && (
            <span className="px-4 text-xs text-[var(--cream)]/40 font-medium">
              {title}
            </span>
          )}
        </div>
      </div>

      {/* Code Block */}
      <div
        className="p-4 relative"
        role="tabpanel"
        id={`code-panel-${selectedLang}`}
        aria-labelledby={`tab-${selectedLang}`}
      >
        <pre className="text-[var(--cream)] text-sm overflow-x-auto">
          <code>{currentCode}</code>
        </pre>
      </div>

      {/* Actions */}
      <div className="border-t border-[var(--turquoise)]/20 p-3 flex gap-2 flex-wrap bg-[var(--dark-blue)]/30">
        {/* Screen reader announcements */}
        <div role="status" aria-live="polite" className="sr-only">
          {copied && "Code copied to clipboard"}
          {copiedClaude && "Prompt copied to clipboard for Claude"}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleCopy}
          className="border-[var(--turquoise)]/30 text-[var(--cream)] hover:bg-[var(--turquoise)]/20 hover:text-[var(--cream)]"
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
              Copy
            </>
          )}
        </Button>

        {showCopyToClaude && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyToClaude}
            className="border-[var(--accent-purple)]/30 text-[var(--cream)] hover:bg-[var(--accent-purple)]/20 hover:text-[var(--cream)]"
            aria-label={copiedClaude ? "Prompt copied for Claude" : "Copy prompt for Claude"}
          >
            {copiedClaude ? (
              <>
                <Check className="w-4 h-4 mr-2 text-green-400" aria-hidden="true" />
                Copied!
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2 text-[var(--accent-purple)]" aria-hidden="true" />
                Copy to Claude
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
