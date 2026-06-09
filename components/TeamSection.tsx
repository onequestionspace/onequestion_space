'use client';
import Image from 'next/image';

/**
 * Team Section Component
 * Clean minimal team display
 */

const XIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

export function TeamSection() {
  const team = [
    {
      name: 'Asym Alwali',
      role: 'Founder & CEO',
      bio: 'Building AI-powered products and technical architecture',
      handle: '@Asym_Alwali',
      link: 'https://twitter.com/Asym_Alwali',
      avatar: '/founders/asym.png',
      gradient: 'from-primary to-accent-pink',
    },
    {
      name: 'Paraja',
      role: 'Founding Product Lead',
      bio: 'Driving growth, user research, and product strategy',
      handle: '@Paraja',
      link: 'https://x.com/MuhammadParaja',
      avatar: '/founders/paraja.png',
      gradient: 'from-accent-pink to-accent-red',
    },
  ];

  return (
    <section id="team" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 grid-pattern" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Meet the <span className="gradient-text">Team</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Building the future of AI-powered knowledge sharing
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {team.map((member, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-8 card-hover"
            >
              {/* Avatar */}
              <Image src={member.avatar} alt={member.name} width={64} height={64} className="w-16 h-16 rounded-full object-cover mb-4" />

              {/* Name and Role */}
              <h3 className="text-xl font-bold text-white mb-1">{member.name}</h3>
              <p className="text-primary font-medium text-sm mb-3">{member.role}</p>

              {/* Bio */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>

              {/* Social Link */}
              <a
                href={member.link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm"
              >
                <XIcon className="w-4 h-4" />
                <span>{member.handle}</span>
              </a>
            </div>
          ))}
        </div>

        {/* Official Account */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">Follow us on X for updates</p>
          <a
            href="https://twitter.com/OneQuestion_Spa"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gradient-primary text-white px-6 py-3 rounded-full font-medium hover:shadow-glow transition-all"
          >
            <XIcon className="w-5 h-5" />
            <span>@OneQuestion_Spa</span>
          </a>
        </div>
      </div>
    </section>
  );
}
