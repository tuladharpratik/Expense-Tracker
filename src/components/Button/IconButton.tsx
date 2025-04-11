'use client';

import React from 'react';
import { Icon } from '@iconify/react';
import { cn } from '@/utils/utils';
import { Button } from './Button';

interface IconButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | null | undefined;
  iconPlacement?: 'top' | 'right' | 'bottom' | 'left';
  icon: string;
  text?: string;
  additionalClassNames?: string;
}

export default function IconButton({
  icon,
  iconPlacement = 'left',
  text,
  variant,
  additionalClassNames,
  onClick,
}: IconButtonProps) {
  return (
    <Button
      variant={variant}
      className={cn(`flex items-center justify-between gap-2`, additionalClassNames)}
      onClick={onClick}
    >
      {icon && iconPlacement === 'left' && <Icon icon={icon} fontSize={'1.2rem'} />}
      {text}
      {icon && iconPlacement === 'right' && <Icon icon={icon} fontSize={'1.2rem'} />}
    </Button>
  );
}
