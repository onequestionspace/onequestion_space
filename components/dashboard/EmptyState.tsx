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
        <div className="text-zinc-600 [&>svg]:w-10 [&>svg]:h-10">{icon}</div>
        <div className="max-w-xs">
          <p className="text-sm font-medium text-white mb-1">{title}</p>
          <p className="text-sm text-zinc-500 leading-relaxed">{description}</p>
        </div>
        {action && <div className="mt-2">{action}</div>}
      </div>
    </Card>
  );
}
