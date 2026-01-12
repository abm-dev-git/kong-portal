'use client';

import { useState } from 'react';
import { Key, Linkedin, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CreateKeyModal } from '@/app/(protected)/dashboard/api-keys/_components/CreateKeyModal';
import { ConnectLinkedInModal } from '@/components/settings/ConnectLinkedInModal';
import { EnrichContactModal } from './EnrichContactModal';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  action?: string | null;
  completed?: boolean;
  disabled?: boolean;
  onClick?: () => void;
}

interface GettingStartedCardProps {
  className?: string;
  hasApiKey?: boolean;
  hasLinkedIn?: boolean;
  hasFirstEnrichment?: boolean;
  token?: string;
  orgId?: string;
  onApiKeyCreated?: () => void;
  onLinkedInConnected?: () => void;
  onEnrichmentComplete?: () => void;
}

export function GettingStartedCard({
  className,
  hasApiKey = false,
  hasLinkedIn = false,
  hasFirstEnrichment = false,
  token,
  orgId,
  onApiKeyCreated,
  onLinkedInConnected,
  onEnrichmentComplete,
}: GettingStartedCardProps) {
  const [showKeyModal, setShowKeyModal] = useState(false);
  const [showLinkedInModal, setShowLinkedInModal] = useState(false);
  const [showEnrichModal, setShowEnrichModal] = useState(false);

  const steps: Step[] = [
    {
      id: 'api-key',
      title: hasApiKey ? 'API key created' : 'Get your API key',
      description: hasApiKey
        ? 'Your API key is ready to use'
        : 'Create an API key to authenticate your requests',
      icon: Key,
      action: hasApiKey ? null : 'Generate Key',
      completed: hasApiKey,
      onClick: () => !hasApiKey && setShowKeyModal(true),
    },
    {
      id: 'linkedin',
      title: hasLinkedIn ? 'LinkedIn connected' : 'Connect LinkedIn',
      description: hasLinkedIn
        ? 'Your LinkedIn account is connected'
        : 'Enable rich profile data for enrichment',
      icon: Linkedin,
      action: hasLinkedIn ? null : 'Connect',
      completed: hasLinkedIn,
      onClick: () => !hasLinkedIn && setShowLinkedInModal(true),
    },
    {
      id: 'enrichment',
      title: hasFirstEnrichment ? 'First enrichment complete' : 'Try enrichment',
      description: hasFirstEnrichment
        ? 'You\'ve run your first enrichment'
        : 'Enrich a contact using all 4 data sources',
      icon: Sparkles,
      action: hasFirstEnrichment ? null : 'Enrich Now',
      completed: hasFirstEnrichment,
      disabled: !hasApiKey,
      onClick: () => hasApiKey && !hasFirstEnrichment && setShowEnrichModal(true),
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;

  return (
    <>
      <div className={cn("rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20 overflow-hidden", className)}>
        {/* Header */}
        <div className="p-4 border-b border-[var(--turquoise)]/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-[var(--cream)]">
                Get started with ABM.dev
              </h3>
              <p className="text-sm text-[var(--cream)]/60 mt-0.5">
                Complete these steps to unlock full enrichment
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
            const isClickable = !step.completed && !step.disabled && step.onClick;

            return (
              <div
                key={step.id}
                onClick={isClickable ? step.onClick : undefined}
                className={cn(
                  "flex items-center gap-4 p-4 transition-colors",
                  isClickable && "hover:bg-[var(--turquoise)]/5 cursor-pointer",
                  step.completed && "opacity-60",
                  step.disabled && !step.completed && "opacity-40"
                )}
              >
                {/* Step number / check */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                    step.completed
                      ? "bg-emerald-500/20 text-emerald-400"
                      : step.disabled
                      ? "bg-[var(--turquoise)]/10 text-[var(--turquoise)]/50"
                      : "bg-[var(--turquoise)]/20 text-[var(--turquoise)]"
                  )}
                >
                  {step.completed ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <step.icon className="w-5 h-5" />
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
                {!step.completed && step.action && !step.disabled && (
                  <div className="flex items-center gap-1 text-sm text-[var(--turquoise)] font-medium">
                    {step.action}
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
                {step.disabled && !step.completed && (
                  <span className="text-xs text-[var(--cream)]/40">
                    Complete step 1 first
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <CreateKeyModal
        open={showKeyModal}
        onOpenChange={setShowKeyModal}
        onKeyCreated={() => {
          setShowKeyModal(false);
          onApiKeyCreated?.();
        }}
      />

      <ConnectLinkedInModal
        open={showLinkedInModal}
        onOpenChange={setShowLinkedInModal}
        token={token}
        orgId={orgId}
        onSuccess={() => {
          setShowLinkedInModal(false);
          onLinkedInConnected?.();
        }}
      />

      <EnrichContactModal
        open={showEnrichModal}
        onOpenChange={setShowEnrichModal}
        token={token}
        orgId={orgId}
        hasLinkedIn={hasLinkedIn}
        onComplete={() => {
          setShowEnrichModal(false);
          onEnrichmentComplete?.();
        }}
      />
    </>
  );
}
