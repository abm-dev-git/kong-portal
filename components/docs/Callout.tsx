"use client";

import { cn } from "@/lib/utils";
import { AlertCircle, Info, Lightbulb, AlertTriangle } from "lucide-react";

type CalloutType = "note" | "tip" | "warning" | "danger";

interface CalloutProps {
  type?: CalloutType;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const calloutConfig: Record<CalloutType, {
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  iconColor: string;
  titleColor: string;
  defaultTitle: string;
}> = {
  note: {
    icon: <Info className="w-5 h-5" />,
    bgColor: "bg-[var(--electric-blue)]/10",
    borderColor: "border-[var(--electric-blue)]/30",
    iconColor: "text-[var(--electric-blue)]",
    titleColor: "text-[var(--electric-blue)]",
    defaultTitle: "Note",
  },
  tip: {
    icon: <Lightbulb className="w-5 h-5" />,
    bgColor: "bg-[var(--turquoise)]/10",
    borderColor: "border-[var(--turquoise)]/30",
    iconColor: "text-[var(--turquoise)]",
    titleColor: "text-[var(--turquoise)]",
    defaultTitle: "Tip",
  },
  warning: {
    icon: <AlertTriangle className="w-5 h-5" />,
    bgColor: "bg-[var(--warning-yellow)]/10",
    borderColor: "border-[var(--warning-yellow)]/30",
    iconColor: "text-[var(--warning-yellow)]",
    titleColor: "text-[var(--warning-yellow)]",
    defaultTitle: "Warning",
  },
  danger: {
    icon: <AlertCircle className="w-5 h-5" />,
    bgColor: "bg-[var(--error-red)]/10",
    borderColor: "border-[var(--error-red)]/30",
    iconColor: "text-[var(--error-red)]",
    titleColor: "text-[var(--error-red)]",
    defaultTitle: "Important",
  },
};

export function Callout({
  type = "note",
  title,
  children,
  className
}: CalloutProps) {
  const config = calloutConfig[type];

  return (
    <div
      className={cn(
        "rounded-lg border p-4",
        config.bgColor,
        config.borderColor,
        className
      )}
      role="note"
    >
      <div className="flex gap-3">
        <div className={cn("flex-shrink-0 mt-0.5", config.iconColor)}>
          {config.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={cn("font-medium text-sm mb-1", config.titleColor)}>
            {title || config.defaultTitle}
          </p>
          <div className="text-sm text-[var(--cream)]/80 prose-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
