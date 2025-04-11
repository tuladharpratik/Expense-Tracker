import { cn } from '@/utils/utils';
import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  label?: string;
  placeholder?: string;
  labelClassName?: string;
  textareaClassName?: string;
  containerClassName?: string;
}
export default function Textarea({
  name,
  label,
  labelClassName,
  textareaClassName,
  containerClassName,
  placeholder,
  ...props
}: TextareaProps) {
  return (
    <div className={cn('flex flex-col gap-1', containerClassName)}>
      {label && (
        <label
          htmlFor={name || 'input'}
          className={cn('text-md cursor-pointer font-medium capitalize text-neutral-500', labelClassName)}
        >
          {label}
        </label>
      )}
      <textarea
        name={name}
        rows={4}
        placeholder={placeholder || 'Write something...'}
        className={cn(
          'w-full resize-none rounded-md border border-neutral-300 px-4 py-2 text-neutral-500',
          textareaClassName
        )}
        {...props}
      ></textarea>
    </div>
  );
}
