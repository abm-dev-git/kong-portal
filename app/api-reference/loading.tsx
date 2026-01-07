import { Skeleton } from '@/components/ui/skeleton';

export default function ApiReferenceLoading() {
  return (
    <div className="space-y-8">
      {/* Header Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-9 w-40" />
        <Skeleton className="h-5 w-96" />
      </div>

      {/* Base URL Skeleton */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <Skeleton className="h-4 w-20 mb-2" />
        <Skeleton className="h-5 w-48" />
      </div>

      {/* Authentication Skeleton */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <Skeleton className="h-5 w-32 mb-2" />
        <Skeleton className="h-4 w-80 mb-3" />
        <Skeleton className="h-12 w-full rounded" />
      </div>

      {/* Endpoints Section Skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-7 w-28" />
        <div className="grid gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                </div>
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-6 w-32 rounded" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rate Limits Skeleton */}
      <div className="p-4 rounded-lg bg-[var(--dark-blue)]/50 border border-[var(--turquoise)]/20">
        <Skeleton className="h-5 w-28 mb-2" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );
}
