'use client';

/**
 * Social Proof Section Component
 * Displays key metrics and statistics
 */
export function SocialProof() {
  const stats = [
    {
      number: '100+',
      label: 'Creators Waiting',
      icon: '👥',
    },
    {
      number: '1000+',
      label: 'Questions Answered',
      icon: '💬',
    },
    {
      number: '24/7',
      label: 'AI Availability',
      icon: '⚡',
    },
  ];

  return (
    <section className="relative py-20 bg-cyber-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-cyber-purple rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-cyber-gray border border-cyber-purple/20 rounded-2xl p-8 hover:border-cyber-purple/50 transition-all hover:shadow-glow-purple"
            >
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

              <div className="relative z-10 text-center">
                <div className="text-5xl mb-4">{stat.icon}</div>
                <p className="text-4xl font-bold text-cyber-purple mb-2">{stat.number}</p>
                <p className="text-gray-400 text-lg">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
