import { ReactNode } from 'react';
import { Card } from './Card';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <Card className="py-16 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.04] flex items-center justify-center text-zinc-500">
          {icon}
        </div>
        <div className="max-w-xs">
          <p className="text-sm font-semibold text-white mb-1">{title}</p>
          <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </Card>
  );
}
