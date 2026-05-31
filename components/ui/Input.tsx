import { cn } from '@/lib/utils';
import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

/**
 * Reusable Input Component
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...props }, ref) => (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full px-4 py-2 border border-gray-300 rounded-lg',
        'focus:ring-2 focus:ring-blue-500 focus:border-transparent',
        'placeholder:text-gray-400',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        className
      )}
      {...props}
    />
  )
);

Input.displayName = 'Input';
