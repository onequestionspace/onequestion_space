'use client';

/**
 * Team Section Component
 * Displays founder and team information
 */
export function TeamSection() {
  const team = [
    {
      name: 'Asym Alwali',
      role: 'Founder & CEO',
      bio: 'Building AI-powered products and technical architecture',
      handle: '@Asym_Alwali',
      link: 'https://twitter.com/Asym_Alwali',
      avatar: 'A',
    },
    {
      name: 'Paraja',
      role: 'Founding Product Lead & Operations',
      bio: 'Driving growth, user research, and product strategy',
      handle: '@Paraja',
      link: '#',
      avatar: 'P',
    },
  ];

  return (
    <section id="team" className="relative py-20 bg-cyber-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-cyber-purple rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet the Team</h2>
          <p className="text-xl text-gray-400">Building the future of AI-powered knowledge sharing</p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="group relative bg-cyber-gray border border-cyber-purple/20 rounded-2xl p-8 hover:border-cyber-purple/50 transition-all hover:shadow-glow-purple"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyber-purple/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>

              <div className="relative z-10">
                {/* Avatar */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-red flex items-center justify-center text-2xl font-bold text-white mb-4">
                  {member.avatar}
                </div>

                {/* Name and Role */}
                <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
                <p className="text-cyber-purple font-semibold text-sm mb-3">{member.role}</p>

                {/* Bio */}
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{member.bio}</p>

                {/* Social Link */}
                <a
                  href={member.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-cyber-purple hover:text-cyber-yellow transition-colors text-sm font-medium"
                >
                  <span>{member.handle}</span>
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.658 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Official Account */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">Follow us on X for updates</p>
          <a
            href="https://twitter.com/OneQuestion_Spa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-cyber-purple text-white px-6 py-3 rounded-lg hover:bg-cyber-purple/90 transition-all hover:shadow-glow-purple font-medium"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2s9 5 20 5a9.5 9.5 0 00-9-5.5c4.75 2.25 7-7 7-7" />
            </svg>
            <span>@OneQuestion_Spa</span>
          </a>
        </div>
      </div>
    </section>
  );
}
