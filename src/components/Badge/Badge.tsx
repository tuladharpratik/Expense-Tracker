import * as React from 'react';

import { cn } from '@/utils/utils';
interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
}

const variantStyles = {
  default: 'bg-blue-100 text-blue-800', // For ACTIVE status
  success: 'bg-green-100 text-green-800', // For PAID status
  warning: 'bg-yellow-100 text-yellow-800',
  destructive: 'bg-red-100 text-red-800',
  outline: 'border border-neutral-200 text-neutral-700',
};

export function Badge({ variant = 'default', className, ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
