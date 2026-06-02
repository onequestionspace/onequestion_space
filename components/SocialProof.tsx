'use client';

/**
 * Social Proof Section Component
 * Clean stats display with brand colors
 */
export function SocialProof() {
  const stats = [
    {
      number: '100+',
      label: 'Creators Waiting',
      color: 'text-primary',
    },
    {
      number: '1000+',
      label: 'Questions Answered',
      color: 'text-accent-pink',
    },
    {
      number: '24/7',
      label: 'AI Availability',
      color: 'text-accent-yellow',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 text-center card-hover"
            >
              <p className={`text-5xl font-bold mb-2 ${stat.color}`}>{stat.number}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
