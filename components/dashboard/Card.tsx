import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={cn('paper-card p-4 sm:p-5', hover ? 'hover:border-zinc-400' : '', className)}
    >
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}

export function CardHeader({ title, description, action, icon }: CardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 mb-5">
      <div className="flex items-center gap-3 min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-zinc-950">{title}</h3>
          {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  color?: string;
  trend?: { value: string; positive: boolean };
}

export function StatsCard({ label, value, icon, color: _color = '#09090B', trend }: StatsCardProps) {
  return (
    <Card hover>
      <div className="flex items-center justify-between mb-3">
        {icon && (
          <div
            className="w-9 h-9 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0"
          >
            {icon}
          </div>
        )}
        {trend && (
          <span className="text-[11px] font-medium text-zinc-500">
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-2xl font-semibold tracking-tight text-zinc-950 mb-0.5">{value}</p>
      <p className="text-xs text-zinc-500">{label}</p>
    </Card>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  size?: 'sm' | 'md';
}

export function ProgressBar({ value, max = 100, color, size = 'md' }: ProgressBarProps) {
  const pct = Math.min(Math.round((value / max) * 100), 100);
  const barColor = color || '#09090B';
  const h = size === 'sm' ? 'h-1' : 'h-1.5';

  return (
    <div className={`w-full ${h} bg-zinc-100 rounded-full overflow-hidden`}>
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{ width: `${pct}%`, backgroundColor: barColor }}
      />
    </div>
  );
}
