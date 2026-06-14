'use client';

export function ProfilesSection() {
  const profiles = [
    {
      emoji: '🎨',
      type: 'Creator',
      name: 'Sarah',
      username: 'sarahcreates',
      bio: 'I make YouTube videos about design. My AI answers questions about my process, tools and courses.',
      questions: ['What camera do you use?', 'How do I start in design?'],
    },
    {
      emoji: '🚀',
      type: 'Founder',
      name: 'Asym',
      username: 'asym',
      bio: 'Building One Question from a phone in Nigeria. My AI answers questions about bootstrapping and building with constraints.',
      questions: ['How do you build without a laptop?', 'What tools do you use?'],
    },
    {
      emoji: '🎓',
      type: 'Coach',
      name: 'Marcus',
      username: 'marcuscoach',
      bio: 'I help founders go from idea to first paying customer. My AI handles all the initial questions so I can focus on deep work.',
      questions: ['How much does coaching cost?', 'How do I book a call?'],
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Built for creators,
          <br />
          <span className="text-white">founders and experts.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Anyone who gets asked the same questions over and over needs a One Question space.
        </p>
        <div className="space-y-4">
          {profiles.map((p, i) => (
            <div key={i} className="glass rounded-3xl p-5 border border-white/10 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-pink flex items-center justify-center text-lg">
                  {p.emoji}
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{p.name} — {p.type}</p>
                  <p className="text-primary text-xs">onequestion.space/{p.username}</p>
                </div>
              </div>
              <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{p.bio}</p>
              <div className="space-y-2">
                {p.questions.map((q, j) => (
                  <div key={j} className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
                    <span className="text-primary text-xs">Q</span>
                    <p className="text-white text-xs">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}