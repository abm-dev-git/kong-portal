"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { MethodBadge } from "./MethodBadge";
import { ParameterTable, Parameter } from "./ParameterTable";
import { ResponseExample } from "./ResponseExample";
import { ChevronDown, ChevronRight, Copy, Check } from "lucide-react";

interface EndpointCardProps {
  id?: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  title: string;
  description?: string;
  parameters?: Parameter[];
  requestBody?: {
    description?: string;
    example: Record<string, unknown>;
  };
  response?: {
    description?: string;
    example: Record<string, unknown>;
  };
  authenticated?: boolean;
}

export function EndpointCard({
  id,
  method,
  path,
  title,
  description,
  parameters,
  requestBody,
  response,
  authenticated = true,
}: EndpointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyPath = () => {
    navigator.clipboard.writeText(path);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={id}
      className="border border-[var(--turquoise)]/20 rounded-lg overflow-hidden bg-[var(--dark-blue)]/50"
    >
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-[var(--turquoise)]/5 transition-colors"
      >
        <div className="flex items-center gap-3">
          <MethodBadge method={method} />
          <code className="text-sm text-[var(--cream)]/80 font-mono">{path}</code>
          {authenticated && (
            <span className="text-xs text-[var(--cream)]/40 px-2 py-0.5 rounded bg-[var(--cream)]/10">
              Auth Required
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[var(--cream)]/60 hidden sm:block">{title}</span>
          {isExpanded ? (
            <ChevronDown className="w-4 h-4 text-[var(--cream)]/60" />
          ) : (
            <ChevronRight className="w-4 h-4 text-[var(--cream)]/60" />
          )}
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-[var(--turquoise)]/20 p-4 space-y-6">
          {/* Description */}
          {description && (
            <p className="text-[var(--cream)]/70">{description}</p>
          )}

          {/* Endpoint Path */}
          <div>
            <h4 className="text-sm font-medium text-[var(--cream)] mb-2">Endpoint</h4>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/10">
              <code className="flex-1 text-sm font-mono text-[var(--turquoise)]">
                {method} https://api.abm.dev{path}
              </code>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  copyPath();
                }}
                className="p-1.5 rounded hover:bg-[var(--turquoise)]/10 transition-colors"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4 text-[var(--cream)]/60" />
                )}
              </button>
            </div>
          </div>

          {/* Parameters */}
          {parameters && parameters.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-[var(--cream)] mb-2">Parameters</h4>
              <ParameterTable parameters={parameters} />
            </div>
          )}

          {/* Request Body */}
          {requestBody && (
            <div>
              <h4 className="text-sm font-medium text-[var(--cream)] mb-2">Request Body</h4>
              {requestBody.description && (
                <p className="text-sm text-[var(--cream)]/60 mb-2">{requestBody.description}</p>
              )}
              <ResponseExample json={requestBody.example} title="Example Request" />
            </div>
          )}

          {/* Response */}
          {response && (
            <div>
              <h4 className="text-sm font-medium text-[var(--cream)] mb-2">Response</h4>
              {response.description && (
                <p className="text-sm text-[var(--cream)]/60 mb-2">{response.description}</p>
              )}
              <ResponseExample json={response.example} title="Example Response" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
