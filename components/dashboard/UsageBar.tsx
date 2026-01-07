'use client';

import { cn } from '@/lib/utils';

interface UsageBarProps {
  label: string;
  used: number;
  limit: number;
  unit?: string;
  className?: string;
}

export function UsageBar({ label, used, limit, unit = '', className }: UsageBarProps) {
  const percentage = Math.min((used / limit) * 100, 100);
  const isWarning = percentage > 70;
  const isCritical = percentage > 90;

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-[var(--cream)]/70">{label}</span>
        <span className="text-sm text-[var(--cream)]">
          {used.toLocaleString()}{unit} / {limit.toLocaleString()}{unit}
        </span>
      </div>
      <div className="h-2 rounded-full bg-[var(--turquoise)]/10 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isCritical ? "bg-red-500" : isWarning ? "bg-amber-500" : "bg-[var(--turquoise)]"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="text-xs text-[var(--cream)]/40">
        {(limit - used).toLocaleString()}{unit} remaining
      </p>
    </div>
  );
}
