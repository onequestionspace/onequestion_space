import { cn } from '@/lib/utils';

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl bg-white/[0.04]',
        className
      )}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-16" />
      </div>
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-2 w-full" />
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

export function StatsCardSkeleton() {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 space-y-3">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-8 w-20" />
      <Skeleton className="h-3 w-16" />
    </div>
  );
}

export function ListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] space-y-2">
          <div className="flex items-start justify-between gap-2">
            <Skeleton className="h-4 flex-1 max-w-[70%]" />
            <Skeleton className="h-5 w-16 rounded-full shrink-0" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-24" />
        </div>
      ))}
    </div>
  );
}
