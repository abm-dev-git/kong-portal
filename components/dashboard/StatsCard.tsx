'use client';

import Link from 'next/link';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  change?: {
    value: number;
    period: string;
  };
  subtitle?: string;
  className?: string;
  href?: string;
}

export function StatsCard({ title, value, icon: Icon, change, subtitle, className, href }: StatsCardProps) {
  const isPositive = change && change.value > 0;
  const isNegative = change && change.value < 0;
  const isNeutral = change && change.value === 0;

  const content = (
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <p className="text-sm text-[var(--cream)]/60">{title}</p>
        <p className="text-2xl font-semibold text-[var(--cream)]">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-2 whitespace-nowrap">
            {isPositive && <TrendingUp className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
            {isNegative && <TrendingDown className="w-4 h-4 text-red-400 flex-shrink-0" />}
            {isNeutral && <Minus className="w-4 h-4 text-[var(--cream)]/40 flex-shrink-0" />}
            <span className={cn(
              "text-sm",
              isPositive && "text-emerald-400",
              isNegative && "text-red-400",
              isNeutral && "text-[var(--cream)]/40"
            )}>
              {isPositive && '+'}{change.value}%
            </span>
            <span className="text-sm text-[var(--cream)]/40">{change.period}</span>
          </div>
        )}
        {subtitle && (
          <p className="text-xs text-[var(--cream)]/40 mt-1">{subtitle}</p>
        )}
      </div>
      <div className="p-3 rounded-lg bg-[var(--turquoise)]/10">
        <Icon className="w-6 h-6 text-[var(--turquoise)]" />
      </div>
    </div>
  );

  const cardClasses = cn(
    "p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20",
    href && "hover:border-[var(--turquoise)]/40 transition-colors cursor-pointer",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClasses}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  );
}
