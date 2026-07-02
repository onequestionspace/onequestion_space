import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.06] bg-white/[0.03] p-6 ${
        hover ? 'transition-all duration-200 hover:border-white/[0.12] hover:bg-white/[0.05]' : ''
      } ${className}`}
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
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 min-w-0">
        {icon && <span className="shrink-0">{icon}</span>}
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-white">{title}</h3>
          {description && <p className="text-sm text-zinc-500 mt-0.5">{description}</p>}
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

export function StatsCard({ label, value, icon, color = '#f59e0b', trend }: StatsCardProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        {icon && (
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}18` }}
          >
            <div style={{ color }}>{icon}</div>
          </div>
        )}
        {trend && (
          <span
            className={`text-xs font-medium ${
              trend.positive ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-3xl font-bold text-white mb-1">{value}</p>
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
  const barColor =
    color ||
    (pct > 80 ? '#ef4444' : pct > 50 ? '#f97316' : '#f59e0b');
  const h = size === 'sm' ? 'h-1.5' : 'h-2';

  return (
    <div className={`w-full ${h} bg-white/5 rounded-full overflow-hidden`}>
      <div
        className={`h-full rounded-full transition-all duration-500`}
        style={{ width: `${pct}%`, backgroundColor: barColor }}
      />
    </div>
  );
}
