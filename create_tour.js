const fs = require('fs');

// 1. Create WelcomeModal component
const welcomeModal = `'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, Sparkles, Brain, Share2, BarChart3 } from 'lucide-react';

const STEPS = [
  {
    icon: '👋',
    title: 'Welcome to One Question',
    desc: 'You just claimed your personal AI space. Here is how it works in 30 seconds.',
    cta: 'Show me →',
  },
  {
    icon: '🧠',
    title: 'Upload your knowledge',
    desc: 'Tell your AI about yourself — your work, services, FAQs, anything. The more you add, the smarter it gets.',
    cta: 'Got it →',
  },
  {
    icon: '🔗',
    title: 'Share your space link',
    desc: 'Your space is live at onequestion.space/yourname. Share it anywhere — bio, email, X. Visitors ask, AI answers.',
    cta: 'Nice →',
  },
  {
    icon: '📊',
    title: 'Watch it work',
    desc: 'Your dashboard shows every question asked, visitor count, and answer rate. You never have to reply manually again.',
    cta: "Let's build my space →",
  },
];

interface WelcomeModalProps {
  onDone: () => void;
  username?: string;
}

export function WelcomeModal({ onDone, username }: WelcomeModalProps) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950 p-8 relative"
        >
          <button onClick={onDone} className="absolute top-4 right-4 text-zinc-600 hover:text-white transition-colors">
            <X className="w-4 h-4" />
          </button>

          {/* Progress dots */}
          <div className="flex gap-1.5 mb-8">
            {STEPS.map((_, i) => (
              <div key={i} className={"h-1 rounded-full transition-all duration-300 " + (i === step ? "bg-primary w-6" : i < step ? "bg-primary/40 w-3" : "bg-white/10 w-3")} />
            ))}
          </div>

          <div className="text-5xl mb-5">{current.icon}</div>
          <h2 className="text-xl font-black text-white mb-3 tracking-tight">{current.title}</h2>
          <p className="text-zinc-400 text-sm leading-relaxed mb-8">{current.desc}</p>

          {username && step === 2 && (
            <div className="mb-6 px-4 py-3 rounded-xl bg-primary/10 border border-primary/20">
              <p className="text-primary text-sm font-mono font-bold">onequestion.space/{username}</p>
            </div>
          )}

          <button
            onClick={() => isLast ? onDone() : setStep(s => s + 1)}
            className="w-full py-3.5 rounded-2xl bg-primary text-black font-black text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
          >
            {current.cta}
          </button>

          {step > 0 && (
            <button onClick={() => setStep(s => s - 1)} className="w-full mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">
              ← Back
            </button>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
`;

fs.writeFileSync('components/WelcomeModal.tsx', welcomeModal);
console.log('WelcomeModal created');

// 2. Create TourTooltip component
const tourTooltip = `'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
      <style>{\`
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
      \`}</style>
      <div className="tour-overlay" onClick={onDone} />
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          style={{ position: 'absolute', top: pos.top, left: pos.left, zIndex: 50 }}
          className="w-72 rounded-2xl border border-primary/30 bg-zinc-950 p-4 shadow-xl shadow-primary/10"
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
        </motion.div>
      </AnimatePresence>
    </>
  );
}
`;

fs.writeFileSync('components/TourTooltip.tsx', tourTooltip);
console.log('TourTooltip created');
