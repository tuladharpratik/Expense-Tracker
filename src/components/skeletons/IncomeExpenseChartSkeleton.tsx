'use client';
import { Skeleton } from './Skeleton';

export function IncomeExpenseChartSkeleton() {
  return (
    <div className="rounded-lg border border-neutral-200 p-4">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-5 w-32" /> {/* Title */}
        <div className="flex items-center gap-4">
          {/* Legend Items */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="mt-6 min-h-[200px]">
        <Skeleton className="h-[200px] w-full" />
      </div>

      {/* X-Axis Labels */}
      <div className="mt-4 flex justify-between px-4">
        {[...Array(12)].map((_, i) => (
          <Skeleton key={i} className="h-4 w-8" />
        ))}
      </div>
    </div>
  );
}
