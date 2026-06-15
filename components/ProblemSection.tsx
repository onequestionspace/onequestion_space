'use client';

export function ProblemSection() {
  const problems = [
    { text: 'What do you do?' },
    { text: 'How can I work with you?' },
    { text: 'What are your prices?' },
    { text: 'How do I contact you?' },
    { text: 'What do you offer?' },
    { text: 'Can you explain what you do?' },
  ];

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
          {problems.map((p, i) => (
            <div
              key={i}
              className="glass rounded-2xl px-4 py-4 border border-white/8 text-left group hover:border-red-500/30 transition-all duration-300"
              style={{
                opacity: 0.5 + i * 0.1,
              }}
            >
              <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors leading-snug">{p.text}</p>
            </div>
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
