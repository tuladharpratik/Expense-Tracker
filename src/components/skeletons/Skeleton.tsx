import { cn } from '@/utils/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('animate-pulse rounded-md bg-neutral-100/40', className)} {...props} />;
}

export { Skeleton };
