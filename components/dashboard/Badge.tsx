import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';

const variants: Record<BadgeVariant, string> = {
  default: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  success: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  warning: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  danger: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  info: 'bg-zinc-100 text-zinc-700 border-zinc-200',
  neutral: 'bg-white text-zinc-600 border-zinc-200',
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, variant = 'default', className, dot }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border leading-tight',
        variants[variant],
        className
      )}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
