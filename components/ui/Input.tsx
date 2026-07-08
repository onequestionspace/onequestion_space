import { cn } from '@/lib/utils';
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/15 transition-all',
        className
      )}
      {...props}
    />
  )
);

Input.displayName = 'Input';
