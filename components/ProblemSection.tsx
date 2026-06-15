'use client';

import { useEffect, useState } from 'react';

const problems = [
  'What do you do?',
  'How can I work with you?',
  'What are your prices?',
  'How do I contact you?',
  'What do you offer?',
  'Can you explain what you do?',
];

function FloatingCard({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="glass rounded-2xl px-4 py-4 border border-white/8 text-left group hover:border-primary/30 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: `opacity 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0 animate-pulse" />
        <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors leading-snug">{text}</p>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04),transparent_70%)]" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          You keep answering the
          <br />
          <span className="gradient-text">same questions.</span>
          <br />
          Every. Single. Day.
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Your inbox is full. Your DMs never stop. You are repeating yourself to every new person who finds you.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-12">
          {problems.map((text, i) => (
            <FloatingCard key={i} text={text} delay={i * 120} />
          ))}
        </div>

        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-pink/40 rounded-2xl blur-md" />
          <div className="relative glass rounded-2xl px-8 py-5 border border-white/20">
            <p className="text-white font-bold text-xl">There is a better way.</p>
            <p className="text-muted-foreground text-sm mt-1">One space. Every question answered. Automatically.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
