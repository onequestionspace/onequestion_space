'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { FadeIn } from '@/components/motion/FadeIn';

const ACTIVITY_POOL = [
  { name: 'Sarah K.', q: 'Hey what exactly do you do?', time: '2m ago', color: '#F5A623' },
  { name: 'Paraja M.', q: 'What is One Question about?', time: '4m ago' },
  { name: 'James O.', q: 'How much do you charge?', time: '5m ago' },
  { name: 'Amina B.', q: 'Can we work together?', time: '8m ago' },
  { name: 'Raj P.', q: 'What services do you offer?', time: '11m ago' },
  { name: 'Lena M.', q: 'How do I contact you?', time: '14m ago' },
  { name: 'Carlos T.', q: 'Do you do consulting?', time: '17m ago' },
  { name: 'Fatima A.', q: 'Can you explain your process?', time: '20m ago' },
  { name: 'Mike D.', q: 'Are you available for hire?', time: '23m ago' },
];

export function LiveActivity() {
  const [items, setItems] = useState(ACTIVITY_POOL.slice(0, 5));

  useEffect(() => {
    const interval = setInterval(() => {
      setItems(prev => {
        const newItem = ACTIVITY_POOL[Math.floor(Math.random() * ACTIVITY_POOL.length)];
        return [newItem, ...prev.slice(0, 3)];
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative py-20 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-[11px] font-bold mb-5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              Live Activity
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3">
              Questions being answered<br />
              <span className="gradient-text">right now.</span>
            </h2>
            <p className="text-zinc-500 text-sm max-w-sm mx-auto">
              Real visitors asking real questions. AI responding instantly.
            </p>
          </FadeIn>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none z-10" />
          <div className="space-y-2">
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 px-4 py-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all group"
              >
                <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${item.name}`} alt="" className="w-7 h-7 rounded-full shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-xs font-medium truncate">{item.q}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-zinc-500 text-[10px]">{item.name}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-600" />
                    <span className="text-zinc-600 text-[10px]">{item.time}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-green-400 text-[10px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Answered
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <FadeIn delay={0.3} y={10}>
          <div className="mt-8 text-center">
            <p className="text-xs text-zinc-600 flex items-center justify-center gap-2">
              <Sparkles className="w-3 h-3 text-primary" />
              Your space could be answering questions right now
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
