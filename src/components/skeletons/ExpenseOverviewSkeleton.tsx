'use client';
import { Skeleton } from './Skeleton';

export function ExpenseOverviewSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-32" /> {/* Title */}
        <Skeleton className="h-8 w-24" /> {/* Total amount */}
      </div>

      {/* Pie Chart Area */}
      <div className="flex justify-center py-8">
        <Skeleton className="h-[200px] w-[200px] rounded-full" />
      </div>

      {/* Legend List */}
      <div className="mt-4 space-y-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-3 rounded-full" /> {/* Color dot */}
              <Skeleton className="h-4 w-24" /> {/* Category name */}
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" /> {/* Amount */}
              <Skeleton className="h-4 w-12" /> {/* Percentage */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
