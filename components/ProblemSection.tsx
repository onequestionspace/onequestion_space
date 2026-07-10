'use client';

// framer-motion removed for mobile stability
import { FadeIn } from '@/components/motion/FadeIn';

const dms = [
  { name: 'Sarah K.', msg: 'Hey what exactly do you do?', time: '2m ago', avatar: 'https://i.pravatar.cc/150?img=47' },
  { name: 'Paraja M.', msg: 'What is One Question about?', time: '4m ago', avatar: 'https://i.pravatar.cc/150?img=12' },
  { name: 'James O.', msg: 'How much do you charge?', time: '5m ago', avatar: 'https://i.pravatar.cc/150?img=33' },
  { name: 'Amina B.', msg: 'Can we work together?', time: '8m ago', avatar: 'https://i.pravatar.cc/150?img=45' },
  { name: 'Raj P.', msg: 'What services do you offer?', time: '11m ago', avatar: 'https://i.pravatar.cc/150?img=51' },
  { name: 'Lena M.', msg: 'How do I contact you?', time: '14m ago', avatar: 'https://i.pravatar.cc/150?img=29' },
  { name: 'Carlos T.', msg: 'Do you do consulting?', time: '17m ago', avatar: 'https://i.pravatar.cc/150?img=14' },
  { name: 'Fatima A.', msg: 'Can you explain your process?', time: '20m ago', avatar: 'https://i.pravatar.cc/150?img=48' },
  { name: 'Mike D.', msg: 'Are you available for hire?', time: '23m ago', avatar: 'https://i.pravatar.cc/150?img=8' },
];

function DmBubble({ name, msg, time, avatar }: { name: string; msg: string; time: string; avatar: string }) {
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <img
        src={avatar}
        alt={name}
        className="w-6 h-6 rounded-full shrink-0 object-cover shadow-lg ring-1 ring-white/10"
        loading="lazy"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="text-zinc-300 text-[11px] font-medium">{name}</span>
          <span className="text-zinc-600 text-[9px]">{time}</span>
        </div>
        <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl rounded-tl-sm px-3 py-2">
          <p className="text-zinc-400 text-xs leading-snug">{msg}</p>
        </div>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center mb-14">
        <FadeIn>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold mb-5'>
            <span className='w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse' />
            The problem
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight mb-4 tracking-tight">
            You keep answering the<br />
            <span className="gradient-text">same questions.</span><br />
            Every. Single. Day.
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
            Your inbox is full. Your DMs never stop. You are repeating yourself to every new person who finds you.
          </p>
        </FadeIn>
      </div>

      <FadeIn y={20}>
        <div className="relative h-64 overflow-hidden mx-auto max-w-lg px-4">
          <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
          <div className="grid grid-cols-2 gap-3 h-full">
            <div className="overflow-hidden rounded-xl">
              <div className="flex flex-col" style={{ animation: 'scrollUp 18s linear infinite' }}>
                {[...dms, ...dms].map((dm, i) => <DmBubble key={i} {...dm} />)}
              </div>
            </div>
            <div className="overflow-hidden rounded-xl">
              <div className="flex flex-col" style={{ animation: 'scrollDown 22s linear infinite' }}>
                {[...dms.slice(4), ...dms.slice(0, 4), ...dms.slice(4), ...dms.slice(0, 4)].map((dm, i) => <DmBubble key={i} {...dm} />)}
              </div>
            </div>
          </div>
        </div>
      </FadeIn>

      <style>{`
        @keyframes scrollUp { 0% { transform: translateY(0); } 100% { transform: translateY(-50%); } }
        @keyframes scrollDown { 0% { transform: translateY(-50%); } 100% { transform: translateY(0); } }
      `}</style>

      <FadeIn delay={0.15}>
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center mt-14">
          <div className="inline-block px-6 py-4 rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/[0.06] to-transparent shadow-amber-glow backdrop-blur-sm">
            <p className="text-white font-bold text-lg">There is a better way.</p>
            <p className="text-zinc-500 text-xs mt-1">One space. Every question answered. Automatically.</p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
