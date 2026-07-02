'use client';

import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizes = {
  sm: 'w-6 h-6 text-[10px]',
  md: 'w-8 h-8 text-xs',
  lg: 'w-10 h-10 text-sm',
  xl: 'w-14 h-14 text-lg',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
  xl: 'w-7 h-7',
};

export function Avatar({ src, name, size = 'md', className }: AvatarProps) {
  const initials = name
    ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : null;

  if (src) {
    return (
      <img
        src={src}
        alt={name || 'Avatar'}
        className={cn('rounded-full object-cover ring-2 ring-white/[0.06]', sizes[size], className)}
      />
    );
  }

  return (
    <div
      className={cn(
        'rounded-full bg-amber-500/10 ring-2 ring-white/[0.06] flex items-center justify-center text-amber-500 font-semibold',
        sizes[size],
        className
      )}
    >
      {initials || <User className={iconSizes[size]} />}
    </div>
  );
}
