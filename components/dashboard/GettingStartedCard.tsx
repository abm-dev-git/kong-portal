'use client';

import Link from 'next/link';
import { Key, Play, BookOpen, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  href?: string;
  action?: string;
  completed?: boolean;
}

interface GettingStartedCardProps {
  className?: string;
  hasApiKey?: boolean;
  hasFirstCall?: boolean;
}

export function GettingStartedCard({ className, hasApiKey = false, hasFirstCall = false }: GettingStartedCardProps) {
  const steps: Step[] = [
    {
      id: 'api-key',
      title: 'Get your API key',
      description: 'Create an API key to authenticate your requests',
      icon: Key,
      href: '/dashboard/api-keys',
      action: 'Generate Key',
      completed: hasApiKey,
    },
    {
      id: 'first-call',
      title: 'Make your first API call',
      description: 'Try the enrichment API in the playground below',
      icon: Play,
      action: 'Try Now',
      completed: hasFirstCall,
    },
    {
      id: 'docs',
      title: 'Explore the documentation',
      description: 'Learn about advanced features and integrations',
      icon: BookOpen,
      href: '/docs',
      action: 'Read Docs',
      completed: false,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <div className={cn("rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 overflow-hidden", className)}>
      {/* Header */}
      <div className="p-4 border-b border-[var(--turquoise)]/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-[var(--cream)]">
              Get started with ABM.dev
            </h3>
            <p className="text-sm text-[var(--cream)]/60 mt-0.5">
              Your first API call is just 2 minutes away
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-[var(--turquoise)]">{completedCount}</span>
            <span className="text-sm text-[var(--cream)]/50">/{steps.length}</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-1.5 bg-[var(--dark-blue)] rounded-full overflow-hidden">
          <div
            className="h-full bg-[var(--turquoise)] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="divide-y divide-[var(--turquoise)]/10">
        {steps.map((step, index) => {
          const stepContent = (
            <>
              {/* Step number / check */}
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                  step.completed
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-[var(--turquoise)]/20 text-[var(--turquoise)]"
                )}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5" />
                ) : (
                  <span className="text-lg font-bold">{index + 1}</span>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={cn(
                  "text-sm font-medium",
                  step.completed ? "text-[var(--cream)]/60 line-through" : "text-[var(--cream)]"
                )}>
                  {step.title}
                </h4>
                <p className="text-sm text-[var(--cream)]/50 truncate">
                  {step.description}
                </p>
              </div>

              {/* Action */}
              {!step.completed && step.action && (
                <div className="flex items-center gap-1 text-sm text-[var(--turquoise)] font-medium">
                  {step.action}
                  <ArrowRight className="w-4 h-4" />
                </div>
              )}
            </>
          );

          const wrapperClassName = cn(
            "flex items-center gap-4 p-4 transition-colors",
            step.href && "hover:bg-[var(--turquoise)]/5 cursor-pointer",
            step.completed && "opacity-60"
          );

          if (step.href) {
            return (
              <Link key={step.id} href={step.href} className={wrapperClassName}>
                {stepContent}
              </Link>
            );
          }

          return (
            <div key={step.id} className={wrapperClassName}>
              {stepContent}
            </div>
          );
        })}
      </div>
    </div>
  );
}
