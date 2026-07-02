'use client';

import { motion } from 'framer-motion';

const dms = [
  { name: 'Sarah K.', msg: 'Hey what exactly do you do?', time: '2m ago', color: '#f59e0b' },
  { name: 'Paraja M.', msg: 'What is One Question about?', time: '4m ago', color: '#ef4444' },
  { name: 'James O.', msg: 'How much do you charge?', time: '5m ago', color: '#3b82f6' },
  { name: 'Amina B.', msg: 'Can we work together?', time: '8m ago', color: '#22c55e' },
  { name: 'Raj P.', msg: 'What services do you offer?', time: '11m ago', color: '#f97316' },
  { name: 'Lena M.', msg: 'How do I contact you?', time: '14m ago', color: '#a855f7' },
  { name: 'Carlos T.', msg: 'Do you do consulting?', time: '17m ago', color: '#06b6d4' },
  { name: 'Fatima A.', msg: 'Can you explain your process?', time: '20m ago', color: '#ec4899' },
  { name: 'Mike D.', msg: 'Are you available for hire?', time: '23m ago', color: '#84cc16' },
];

function DmBubble({ name, msg, time, color }: { name: string; msg: string; time: string; color: string }) {
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <div className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold text-black shadow-lg" style={{ backgroundColor: color }}>
        {name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-zinc-300 text-xs font-medium">{name}</span>
          <span className="text-zinc-600 text-[10px]">{time}</span>
        </div>
        <div className="bg-white/5 border border-white/[0.06] rounded-2xl rounded-tl-sm px-3 py-2 hover:bg-white/[0.08] transition-colors">
          <p className="text-zinc-400 text-sm leading-snug">{msg}</p>
        </div>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(245,158,11,0.08), transparent 70%)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold mb-6'>
            <span className='w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse' />
            The problem
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-4 tracking-tight">
            You keep answering the<br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">same questions.</span><br />
            Every. Single. Day.
          </h2>
          <p className="text-zinc-500 text-lg leading-relaxed max-w-lg mx-auto">
            Your inbox is full. Your DMs never stop. You are repeating yourself to every new person who finds you.
          </p>
        </motion.div>
      </div>

      <motion.div
        className="relative h-72 overflow-hidden mx-auto max-w-lg px-4"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        <div className="grid grid-cols-2 gap-3 h-full">
          <div className="overflow-hidden rounded-2xl">
            <div className="flex flex-col" style={{ animation: 'scrollUp 18s linear infinite' }}>
              {[...dms, ...dms].map((dm, i) => <DmBubble key={i} {...dm} />)}
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl">
            <div className="flex flex-col" style={{ animation: 'scrollDown 22s linear infinite' }}>
              {[...dms.slice(4), ...dms.slice(0, 4), ...dms.slice(4), ...dms.slice(0, 4)].map((dm, i) => <DmBubble key={i} {...dm} />)}
            </div>
          </div>
        </div>
      </motion.div>

      <style jsx>{`
        @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
      `}</style>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center mt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block px-8 py-5 rounded-2xl border border-amber-500/15 bg-gradient-to-b from-amber-500/10 to-transparent shadow-lg shadow-amber-500/10 backdrop-blur-sm"
        >
          <p className="text-white font-black text-xl">There is a better way.</p>
          <p className="text-zinc-500 text-sm mt-1">One space. Every question answered. Automatically.</p>
        </motion.div>
      </div>
    </section>
  );
}
