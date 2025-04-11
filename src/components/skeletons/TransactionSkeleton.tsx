'use client';

import { Skeleton } from './Skeleton';

export function TransactionSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-32" /> {/* Date filter */}
          <Skeleton className="h-10 w-32" /> {/* Other filter */}
        </div>
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-28" /> {/* Export button */}
          <Skeleton className="h-10 w-28" /> {/* Add transaction button */}
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="rounded-md border">
        <div className="border-b bg-neutral-50/40">
          <div className="grid grid-cols-6 p-4">
            <Skeleton className="h-4 w-8" /> {/* Checkbox */}
            <Skeleton className="h-4 w-24" /> {/* Date */}
            <Skeleton className="h-4 w-24" /> {/* Type */}
            <Skeleton className="h-4 w-24" /> {/* Amount */}
            <Skeleton className="h-4 w-32" /> {/* Category */}
            <Skeleton className="h-4 w-16" /> {/* Actions */}
          </div>
        </div>
        {/* Table Rows */}
        {[...Array(5)].map((_, index) => (
          <div key={index} className="border-b">
            <div className="grid grid-cols-6 p-4">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
