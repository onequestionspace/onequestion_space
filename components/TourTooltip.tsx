'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export interface TourStep {
  target: string; // CSS selector
  title: string;
  desc: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

interface TourTooltipProps {
  steps: TourStep[];
  onDone: () => void;
}

export function TourTooltip({ steps, onDone }: TourTooltipProps) {
  const [current, setCurrent] = useState(0);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const step = steps[current];
  const isLast = current === steps.length - 1;

  useEffect(() => {
    const el = document.querySelector(step.target);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const rect = el.getBoundingClientRect();
    const position = step.position || 'bottom';
    let top = 0, left = 0;
    if (position === 'bottom') { top = rect.bottom + window.scrollY + 12; left = rect.left + window.scrollX; }
    if (position === 'top') { top = rect.top + window.scrollY - 120; left = rect.left + window.scrollX; }
    if (position === 'right') { top = rect.top + window.scrollY; left = rect.right + window.scrollX + 12; }
    setPos({ top, left });

    // Highlight element
    el.classList.add('tour-highlight');
    return () => el.classList.remove('tour-highlight');
  }, [current, step.target, step.position]);

  return (
    <>
      <style>{`
        .tour-highlight {
          outline: 2px solid #f59e0b !important;
          outline-offset: 4px !important;
          border-radius: 12px !important;
          position: relative;
          z-index: 45;
        }
        .tour-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.4);
          z-index: 44;
        }
        .tour-card {
          animation: scaleIn 0.25s ease-out forwards;
        }
      `}</style>
      <div className="tour-overlay" onClick={onDone} />
      <div
        key={current}
        style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 50 }}
        className="tour-card w-72 rounded-2xl border border-primary/30 bg-zinc-950 p-4 shadow-xl shadow-primary/10"
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <p className="text-sm font-black text-white">{step.title}</p>
          <button onClick={onDone} className="text-zinc-600 hover:text-white shrink-0">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed mb-4">{step.desc}</p>
        <div className="flex items-center justify-between">
          <span className="text-xs text-zinc-600">{current + 1} of {steps.length}</span>
          <button
            onClick={() => isLast ? onDone() : setCurrent(c => c + 1)}
            className="px-4 py-1.5 rounded-lg bg-primary text-black text-xs font-black hover:opacity-90 transition-all"
          >
            {isLast ? 'Done ✓' : 'Next →'}
          </button>
        </div>
      </div>
    </>
  );
}
