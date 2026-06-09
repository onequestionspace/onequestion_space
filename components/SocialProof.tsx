'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function SocialProof() {
  let count = 0;
  try {
    const waitlistData = useQuery(api.waitlist.getWaitlistCount);
    count = waitlistData?.count ?? 0;
  } catch {
    count = 0;
  }

  const stats = [
    {
      number: count > 0 ? `${count}+` : 'Growing',
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
        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="glass rounded-2xl p-4 text-center card-hover">
              <p className={`text-2xl sm:text-4xl font-bold mb-1 ${stat.color}`}>{stat.number}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
