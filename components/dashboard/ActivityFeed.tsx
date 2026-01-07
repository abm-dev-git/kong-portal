'use client';

import { Zap, Key, Link as LinkIcon, Settings, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'enrichment' | 'api_key' | 'integration' | 'settings';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'error' | 'pending';
}

const activityIcons = {
  enrichment: Zap,
  api_key: Key,
  integration: LinkIcon,
  settings: Settings,
};

const statusIcons = {
  success: CheckCircle2,
  error: AlertCircle,
  pending: null,
};

interface ActivityFeedProps {
  activities: Activity[];
  className?: string;
}

export function ActivityFeed({ activities, className }: ActivityFeedProps) {
  if (activities.length === 0) {
    return (
      <div className={cn("p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20", className)}>
        <p className="text-center text-[var(--cream)]/50 py-8">
          No recent activity to display
        </p>
      </div>
    );
  }

  return (
    <div className={cn("p-6 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20", className)}>
      <h3 className="text-lg font-medium text-[var(--cream)] mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activityIcons[activity.type];
          const StatusIcon = activity.status ? statusIcons[activity.status] : null;

          return (
            <div
              key={activity.id}
              className="flex items-start gap-3 p-3 rounded-lg bg-[var(--turquoise)]/5 border border-[var(--turquoise)]/10"
            >
              <div className="p-2 rounded-lg bg-[var(--dark-blue)]">
                <Icon className="w-4 h-4 text-[var(--turquoise)]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--cream)]">{activity.title}</p>
                  {StatusIcon && (
                    <StatusIcon className={cn(
                      "w-4 h-4",
                      activity.status === 'success' && "text-emerald-400",
                      activity.status === 'error' && "text-red-400"
                    )} />
                  )}
                </div>
                <p className="text-xs text-[var(--cream)]/60">{activity.description}</p>
              </div>
              <span className="text-xs text-[var(--cream)]/40 whitespace-nowrap">
                {activity.timestamp}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
