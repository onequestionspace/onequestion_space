'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { FadeIn } from '@/components/motion/FadeIn';

export function StatsBar() {
  const profilesCount = useQuery(api.profiles.getProfilesCount);
  const count = profilesCount ?? 0;

  const stats = [
    { icon: '🔥', label: 'Spaces Live', value: count + '+', color: '#F5A623' },
    { icon: '💬', label: 'Questions Answered', value: '1,200+', color: '#F5A623' },
    { icon: '⚡', label: 'AI Running 24/7', value: 'Always', color: '#F5A623' },
    { icon: '🌍', label: 'Builders Worldwide', value: Math.max(1, Math.round(count * 0.7)) + '+', color: '#F5A623' },
  ];

  return (
    <section className="relative py-12">
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {stats.map((s, i) => (
            <FadeIn key={s.label} delay={i * 0.08} y={16}>
              <div className="paper-card p-4 text-center">
                <p className="text-xl mb-1">{s.icon}</p>
                <p className="text-lg font-bold text-white mb-0.5">{s.value}</p>
                <p className="text-[10px] text-zinc-500">{s.label}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  );
}
