'use client';

const dms = [
  { name: 'Sarah K.', msg: 'Hey what exactly do you do?', time: '2m ago' },
  { name: 'James O.', msg: 'How much do you charge?', time: '5m ago' },
  { name: 'Amina B.', msg: 'Can we work together?', time: '8m ago' },
  { name: 'Raj P.', msg: 'What services do you offer?', time: '11m ago' },
  { name: 'Lena M.', msg: 'How do I contact you?', time: '14m ago' },
  { name: 'Carlos T.', msg: 'Do you do consulting?', time: '17m ago' },
  { name: 'Fatima A.', msg: 'Can you explain your process?', time: '20m ago' },
  { name: 'Mike D.', msg: 'Are you available to hire?', time: '23m ago' },
  { name: 'Priya S.', msg: 'What tools do you use?', time: '26m ago' },
  { name: 'Noah L.', msg: 'Do you take on new clients?', time: '29m ago' },
];

const col1 = [...dms, ...dms];
const col2 = [...dms.slice(5), ...dms.slice(0, 5), ...dms.slice(5), ...dms.slice(0, 5)];

function DmBubble({ name, msg, time }: { name: string; msg: string; time: string }) {
  const initials = name.split(' ').map(n => n[0]).join('');
  return (
    <div className="flex items-start gap-2.5 mb-3">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent-pink flex items-center justify-center text-white text-xs font-bold shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-white/70 text-xs font-medium">{name}</span>
          <span className="text-white/30 text-xs">{time}</span>
        </div>
        <div className="bg-white/8 border border-white/10 rounded-2xl rounded-tl-sm px-3 py-2">
          <p className="text-white/80 text-sm leading-snug">{msg}</p>
        </div>
      </div>
    </div>
  );
}

export function ProblemSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04),transparent_70%)]" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          You keep answering the
          <br />
          <span className="gradient-text">same questions.</span>
          <br />
          Every. Single. Day.
        </h2>
        <p className="text-muted-foreground text-lg">
          Your inbox is full. Your DMs never stop. You are repeating yourself to every new person who finds you.
        </p>
      </div>

      {/* DM columns */}
      <div className="relative h-72 overflow-hidden mx-auto max-w-lg px-4">
        {/* fade top */}
        <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        {/* fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

        <div className="grid grid-cols-2 gap-3 h-full">
          {/* Column 1 — scrolls up */}
          <div className="overflow-hidden">
            <div
              className="flex flex-col"
              style={{
                animation: 'scrollUp 18s linear infinite',
              }}
            >
              {col1.map((dm, i) => (
                <DmBubble key={i} {...dm} />
              ))}
            </div>
          </div>

          {/* Column 2 — scrolls down */}
          <div className="overflow-hidden">
            <div
              className="flex flex-col"
              style={{
                animation: 'scrollDown 22s linear infinite',
              }}
            >
              {col2.map((dm, i) => (
                <DmBubble key={i} {...dm} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        @keyframes scrollDown {
          0% { transform: translateY(-50%); }
          100% { transform: translateY(0); }
        }
      `}</style>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center mt-12">
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
