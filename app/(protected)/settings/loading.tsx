import { Skeleton } from '@/components/ui/skeleton';

export default function SettingsLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-80" />
      </div>

      {/* Data Enrichment Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
            <Skeleton className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* CRM Integrations Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-40" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20"
            >
              <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-lg flex-shrink-0" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="grid gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[var(--navy)] border border-[var(--turquoise)]/20"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <Skeleton className="h-5 w-5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
