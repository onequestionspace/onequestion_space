'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export const useToast = () => useContext(ToastContext);

const icons: Record<ToastType, ReactNode> = {
  success: <CheckCircle2 className="w-5 h-5 text-green-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
};

const borders: Record<ToastType, string> = {
  success: 'border-green-500/30',
  error: 'border-red-500/30',
  info: 'border-blue-500/30',
  warning: 'border-yellow-500/30',
};

const glows: Record<ToastType, string> = {
  success: 'shadow-[0_0_20px_rgba(34,197,94,0.15)]',
  error: 'shadow-[0_0_20px_rgba(239,68,68,0.15)]',
  info: 'shadow-[0_0_20px_rgba(59,130,246,0.15)]',
  warning: 'shadow-[0_0_20px_rgba(250,204,21,0.15)]',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((t: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { ...t, id }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const remove = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-24 right-6 z-[100] flex flex-col gap-2 pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border bg-zinc-900/95 backdrop-blur-xl min-w-[300px] max-w-[380px] animate-slide-up',
              borders[t.type],
              glows[t.type]
            )}
          >
            <span className="shrink-0 mt-0.5">{icons[t.type]}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">{t.title}</p>
              {t.description && (
                <p className="text-xs text-zinc-400 mt-0.5">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => remove(t.id)}
              className="shrink-0 text-zinc-500 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
