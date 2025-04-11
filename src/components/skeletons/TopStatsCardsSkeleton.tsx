'use client';

import { Skeleton } from './Skeleton';

export function TopStatsCardsSkeleton() {
  return (
    <div className="flex flex-wrap items-center gap-4 lg:justify-between">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-card flex w-full min-w-[240px] flex-1 items-center rounded-xl border p-6 shadow-sm">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" /> {/* Title */}
            <Skeleton className="h-7 w-32" /> {/* Amount */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-16" /> {/* Percentage */}
              <Skeleton className="h-4 w-32" /> {/* Description */}
            </div>
          </div>
          <Skeleton className="ml-auto h-12 w-12 rounded-full" /> {/* Icon */}
        </div>
      ))}
    </div>
  );
}
