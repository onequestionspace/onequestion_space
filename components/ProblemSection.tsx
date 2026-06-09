'use client';

export function ProblemSection() {
  const problems = [
    { emoji: '😤', text: 'What do you do?' },
    { emoji: '💬', text: 'How can I work with you?' },
    { emoji: '🔁', text: 'What are your prices?' },
    { emoji: '📩', text: 'How do I contact you?' },
    { emoji: '😩', text: 'What do you offer?' },
    { emoji: '🔄', text: 'Can you explain what you do?' },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
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
        <div className="grid grid-cols-2 gap-3">
          {problems.map((p, i) => (
            <div key={i} className="glass rounded-2xl px-4 py-3 border border-white/10 text-left flex items-center gap-3">
              <span className="text-xl">{p.emoji}</span>
              <p className="text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
        <p className="text-white font-bold text-xl mt-10">There is a better way.</p>
      </div>
    </section>
  );
}