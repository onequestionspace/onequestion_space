'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const ACTIVITY_POOL = [
  { name: 'Sarah K.', q: 'Hey what exactly do you do?', time: '2m ago', color: '#f59e0b' },
  { name: 'Paraja M.', q: 'What is One Question about?', time: '4m ago', color: '#ef4444' },
  { name: 'James O.', q: 'How much do you charge?', time: '5m ago', color: '#3b82f6' },
  { name: 'Amina B.', q: 'Can we work together?', time: '8m ago', color: '#22c55e' },
  { name: 'Raj P.', q: 'What services do you offer?', time: '11m ago', color: '#f97316' },
  { name: 'Lena M.', q: 'How do I contact you?', time: '14m ago', color: '#a855f7' },
  { name: 'Carlos T.', q: 'Do you do consulting?', time: '17m ago', color: '#06b6d4' },
  { name: 'Fatima A.', q: 'Can you explain your process?', time: '20m ago', color: '#ec4899' },
  { name: 'Mike D.', q: 'Are you available for hire?', time: '23m ago', color: '#84cc16' },
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
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent" />
      <div className="relative z-10 max-w-3xl mx-auto px-4">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              Live Activity
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4">
              Questions being answered<br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">right now.</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-sm mx-auto">
              Real visitors asking real questions. AI responding instantly.
            </p>
          </motion.div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none z-10" />
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="space-y-2"
          >
            {items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl border border-white/5 bg-white/[0.02] hover:border-white/10 transition-all group"
              >
                <div className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-black" style={{ backgroundColor: item.color }}>
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-sm font-medium truncate">{item.q}</span>
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
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-zinc-600 flex items-center justify-center gap-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            Your space could be answering questions right now
          </p>
        </motion.div>
      </div>
    </section>
  );
}