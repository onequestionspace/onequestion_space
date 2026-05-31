import { cn } from '@/lib/utils';
import React from 'react';

/**
 * Card Component
 */
export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('bg-white rounded-lg shadow border border-gray-200', className)}
      {...props}
    />
  )
);

Card.displayName = 'Card';

/**
 * Card Header
 */
export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4 border-b border-gray-200', className)} {...props} />
));

CardHeader.displayName = 'CardHeader';

/**
 * Card Content
 */
export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4', className)} {...props} />
));

CardContent.displayName = 'CardContent';

/**
 * Card Footer
 */
export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('px-6 py-4 border-t border-gray-200', className)} {...props} />
));

CardFooter.displayName = 'CardFooter';
