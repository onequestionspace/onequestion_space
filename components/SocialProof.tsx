'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function SocialProof() {
  const waitlistData = useQuery(api.waitlist.getWaitlistCount);
  const count = waitlistData?.count ?? 0;

  const stats = [
    {
      number: count > 0 ? `${count}+` : '...',
      label: 'Early Members',
      color: 'text-primary',
    },
    {
      number: '24/7',
      label: 'AI Availability',
      color: 'text-accent-pink',
    },
    {
      number: '100%',
      label: 'Free to Join',
      color: 'text-accent-yellow',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 grid-pattern" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="glass rounded-2xl p-8 text-center card-hover">
              <p className={`text-5xl font-bold mb-2 ${stat.color}`}>{stat.number}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
