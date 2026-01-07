'use client';

import Link from 'next/link';
import { Linkedin, ChevronRight, CheckCircle2, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Icon components
function HubSpotIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.984v-.066a2.198 2.198 0 00-4.396 0V3.1c0 .9.54 1.67 1.313 2.012v2.789a5.42 5.42 0 00-2.477 1.277l-6.44-5.019a2.385 2.385 0 00.092-.642v-.065a2.385 2.385 0 10-2.556 2.376 2.375 2.375 0 001.045-.239l6.317 4.923a5.454 5.454 0 00-.77 2.796 5.464 5.464 0 00.787 2.843l-1.907 1.907a1.81 1.81 0 00-.527-.082 1.834 1.834 0 101.833 1.833c0-.184-.029-.36-.08-.527l1.89-1.89a5.456 5.456 0 108.009-8.463 5.426 5.426 0 00-3.4-1.092zm-.117 8.442a2.85 2.85 0 110-5.702 2.85 2.85 0 010 5.702z" />
    </svg>
  );
}

function SalesforceIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M9.98 6.182a4.27 4.27 0 013.38-1.655 4.277 4.277 0 013.967 2.674 3.643 3.643 0 011.404-.28 3.675 3.675 0 013.678 3.678 3.643 3.643 0 01-.285 1.416 3.196 3.196 0 011.877 2.914 3.203 3.203 0 01-3.203 3.203 3.203 3.203 0 01-.54-.046 3.95 3.95 0 01-3.487 2.089 3.947 3.947 0 01-1.772-.418 4.494 4.494 0 01-7.83-1.573 3.315 3.315 0 01-.616.058 3.34 3.34 0 01-3.34-3.34 3.34 3.34 0 012.035-3.074 4.072 4.072 0 01-.19-1.234 4.094 4.094 0 014.094-4.094 4.072 4.072 0 01.828.085z" />
    </svg>
  );
}

interface Integration {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  connected: boolean;
  href: string;
}

const integrations: Integration[] = [
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: Linkedin,
    iconColor: 'text-[#0A66C2]',
    connected: false,
    href: '/settings/linkedin',
  },
  {
    id: 'hubspot',
    name: 'HubSpot',
    icon: HubSpotIcon,
    iconColor: 'text-[#ff7a59]',
    connected: false,
    href: '/settings/hubspot',
  },
  {
    id: 'salesforce',
    name: 'Salesforce',
    icon: SalesforceIcon,
    iconColor: 'text-[#00a1e0]',
    connected: false,
    href: '/settings/salesforce',
  },
];

interface IntegrationStatusProps {
  className?: string;
}

export function IntegrationStatus({ className }: IntegrationStatusProps) {
  const connectedCount = integrations.filter((i) => i.connected).length;

  return (
    <div className={cn("p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[var(--cream)]">Integrations</h3>
        <span className="text-sm text-[var(--cream)]/60">
          {connectedCount}/{integrations.length} connected
        </span>
      </div>
      <div className="space-y-3">
        {integrations.map((integration) => {
          const Icon = integration.icon;
          return (
            <Link
              key={integration.id}
              href={integration.href}
              className="flex items-center justify-between p-3 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10 hover:border-[var(--turquoise)]/30 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[var(--dark-blue)]">
                  <Icon className={cn("w-4 h-4", integration.iconColor)} />
                </div>
                <span className="text-sm text-[var(--cream)]">{integration.name}</span>
              </div>
              <div className="flex items-center gap-2">
                {integration.connected ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <XCircle className="w-4 h-4 text-[var(--cream)]/30" />
                )}
                <ChevronRight className="w-4 h-4 text-[var(--cream)]/30 group-hover:text-[var(--turquoise)] transition-colors" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
