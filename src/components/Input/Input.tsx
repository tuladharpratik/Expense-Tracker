'use client';
import { cn } from '@/utils/utils';
import { Icon } from '@iconify/react';
import clsx from 'clsx';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  iconClick?: () => void;
  containerClassName?: string;
  inputClassName?: string;
  labelClassName?: string;
  icon?: string;
  iconPlacement?: 'left' | 'right';
  label?: string;
  error?: string;
}

export default function Input({
  iconClick,
  containerClassName,
  inputClassName,
  labelClassName,
  icon,
  iconPlacement = 'left',
  label,
  error,
  ...inputProps
}: InputProps) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label
          htmlFor={inputProps?.name || 'input'}
          className={cn('text-md cursor-pointer font-medium capitalize text-neutral-500', labelClassName)}
        >
          {label}
        </label>
      )}
      <div className={cn('relative flex items-center', inputClassName)}>
        {icon && iconPlacement === 'left' && (
          <Icon
            icon={icon}
            className="absolute left-2 w-6"
            fontSize={'1.2rem'}
            onClick={() => (iconClick ? iconClick() : {})}
          />
        )}
        <input
          {...inputProps}
          className={cn('peer w-full rounded-md border border-neutral-300 px-4 py-2 text-neutral-500', inputClassName, {
            'pl-8': icon && iconPlacement === 'left',
            'pr-8': icon && iconPlacement === 'right',
          })}
        />
        {icon && iconPlacement === 'right' && (
          <Icon
            icon={icon}
            className="absolute right-2 w-6"
            fontSize={'1.2rem'}
            onClick={() => (iconClick ? iconClick() : {})}
          />
        )}
      </div>
      {label && (
        <p className={clsx('invisible text-xs text-red-500', { '!visible': error?.length })}>{error || 'Error'}</p>
      )}
    </div>
  );
}
