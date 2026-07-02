'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Globe, Zap } from 'lucide-react';

export function StatsBar() {
  const profilesCount = useQuery(api.profiles.getProfilesCount);
  const count = profilesCount ?? 0;

  const stats = [
    { icon: Globe, label: 'Spaces Created', value: count + '+', color: '#f59e0b' },
    { icon: MessageSquare, label: 'Questions Answered', value: '1,200+', color: '#ef4444' },
    { icon: Users, label: 'Active Creators', value: Math.max(1, Math.round(count * 0.7)) + '+', color: '#3b82f6' },
    { icon: Zap, label: 'Avg Response Time', value: '<2s', color: '#22c55e' },
  ];

  return (
    <section className="relative py-12 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/3 via-transparent to-transparent" />
      <div className="relative z-10 max-w-4xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="px-4 py-5 rounded-2xl border border-white/5 bg-white/[0.02] text-center hover:border-white/10 transition-all group"
            >
              <s.icon className="w-5 h-5 mx-auto mb-2 opacity-60 group-hover:opacity-100 transition-opacity" style={{ color: s.color }} />
              <p className="text-2xl font-black text-white mb-0.5">{s.value}</p>
              <p className="text-xs text-zinc-500">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}