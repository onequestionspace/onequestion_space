'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70">
      <div className="w-full max-w-sm rounded-3xl border border-white/10 bg-zinc-950 p-8 relative animate-scale-in">
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
      </div>
    </div>
  );
}
