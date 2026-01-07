"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";

interface ResponseExampleProps {
  json: Record<string, unknown>;
  title?: string;
}

export function ResponseExample({ json, title }: ResponseExampleProps) {
  const [copied, setCopied] = useState(false);
  const formatted = JSON.stringify(json, null, 2);

  const copyCode = () => {
    navigator.clipboard.writeText(formatted);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden border border-[var(--turquoise)]/20 bg-[var(--navy)]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--turquoise)]/10 bg-[var(--dark-blue)]/50">
        <span className="text-xs font-medium text-[var(--cream)]/60">
          {title || "JSON"}
        </span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 px-2 py-1 text-xs text-[var(--cream)]/60 hover:text-[var(--cream)] rounded transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copy
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <pre className="p-4 overflow-x-auto text-sm">
        <code className="text-[var(--cream)]/80 font-mono">
          {formatJsonWithHighlighting(json)}
        </code>
      </pre>
    </div>
  );
}

function formatJsonWithHighlighting(obj: Record<string, unknown>, indent = 0): React.ReactNode {
  const spaces = "  ".repeat(indent);
  const entries = Object.entries(obj);

  if (entries.length === 0) {
    return "{}";
  }

  return (
    <>
      {"{\n"}
      {entries.map(([key, value], index) => (
        <span key={key}>
          {spaces}{"  "}
          <span className="text-[var(--turquoise)]">"{key}"</span>
          {": "}
          {formatValue(value, indent + 1)}
          {index < entries.length - 1 ? ",\n" : "\n"}
        </span>
      ))}
      {spaces}{"}"}
    </>
  );
}

function formatValue(value: unknown, indent: number): React.ReactNode {
  if (value === null) {
    return <span className="text-[var(--cream)]/50">null</span>;
  }

  if (typeof value === "boolean") {
    return <span className="text-amber-400">{value.toString()}</span>;
  }

  if (typeof value === "number") {
    return <span className="text-emerald-400">{value}</span>;
  }

  if (typeof value === "string") {
    return <span className="text-amber-300">"{value}"</span>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return "[]";
    }
    const spaces = "  ".repeat(indent);
    return (
      <>
        {"[\n"}
        {value.map((item, index) => (
          <span key={index}>
            {spaces}{"  "}
            {formatValue(item, indent + 1)}
            {index < value.length - 1 ? ",\n" : "\n"}
          </span>
        ))}
        {spaces}{"]"}
      </>
    );
  }

  if (typeof value === "object") {
    return formatJsonWithHighlighting(value as Record<string, unknown>, indent);
  }

  return String(value);
}
