'use client';

import { useState, useMemo, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowRight, Sparkles, Globe, Brain, Star, Users, Play, Check, X as XIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import AnimatedCounter from '@/components/motion/AnimatedCounter';
import { FadeIn } from '@/components/motion/FadeIn';

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function FloatingParticles({ count = 20 }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => {
      const s = i * 137.5;
      return {
        id: i,
        x: seededRandom(s) * 100,
        y: seededRandom(s + 1) * 100,
        size: seededRandom(s + 2) * 2 + 0.5,
        delay: seededRandom(s + 3) * 5,
        duration: seededRandom(s + 4) * 12 + 10,
        xDrift: (seededRandom(s + 5) - 0.5) * 40,
        yDrift: (seededRandom(s + 6) - 0.5) * 40,
      };
    }), [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, rgba(245,166,35,0.3), transparent)',
          }}
          animate={{
            y: [0, p.yDrift * 0.5, p.yDrift * -0.3, p.yDrift * 0.2, 0],
            x: [0, p.xDrift * 0.4, p.xDrift * -0.5, p.xDrift * 0.3, 0],
            opacity: [0.1, 0.4, 0.15, 0.3, 0.1],
            scale: [1, 1.2, 0.9, 1.1, 1],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

export function Hero() {
  const { isSignedIn } = useAuth();
  const [username, setUsername] = useState('');

  const recentProfiles = useQuery(api.profiles.getRecentProfiles, { limit: 5 });
  const profilesCount = useQuery(api.profiles.getProfilesCount);
  const count = profilesCount ?? 0;

  const handleClaim = useCallback(() => {
    if (isSignedIn) {
      window.location.href = '/dashboard';
    } else {
      const u = username.trim().toLowerCase();
      window.location.href = '/sign-up' + (u ? '?username=' + u : '');
    }
  }, [isSignedIn, username]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      <div className="absolute inset-0 bg-background" />
      <div className="absolute inset-0 amber-radial pointer-events-none" />
      <div className="absolute inset-0 faint-grid opacity-50 pointer-events-none" />
      <div className="absolute inset-0 grain opacity-[0.02] pointer-events-none mix-blend-soft-light" />

      {/* Top gradient line */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.3), rgba(245,166,35,0.5), rgba(245,166,35,0.3), transparent)',
          backgroundSize: '200% 100%',
        }}
        animate={{ backgroundPosition: ['0% 0%', '200% 0%'] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
      />

      <FloatingParticles count={20} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">

        {/* === COMPARISON SECTION === */}
        <FadeIn delay={0}>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold tracking-wide mb-4">
              <Brain className="w-3 h-3" />
              NOT ANOTHER AI CHATBOT
            </div>
            <p className="text-zinc-500 text-sm max-w-xl mx-auto">
              ChatGPT answers from the internet. One Question answers from <span className="text-zinc-300 font-semibold">YOUR</span> knowledge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto mb-12">
            {/* ChatGPT card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="paper-card p-5"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-white/[0.06] flex items-center justify-center">
                  <Globe className="w-4 h-4 text-zinc-400" />
                </div>
                <span className="text-sm font-bold text-zinc-300">ChatGPT</span>
              </div>
              <p className="text-xs text-zinc-500 mb-3">Answers from the internet.</p>
              <ul className="space-y-2">
                {['Internet knowledge', 'General answers', 'Same for everyone'].map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                    <XIcon className="w-3 h-3 text-red-400/60 shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* One Question card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="paper-card p-5 border-primary/20 bg-gradient-to-b from-primary/[0.04] to-transparent"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                  <Brain className="w-4 h-4 text-black" />
                </div>
                <span className="text-sm font-bold text-white">One Question</span>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/25 ml-auto">
                  YOUR AI
                </span>
              </div>
              <p className="text-xs text-primary/80 mb-3">Answers from YOUR knowledge.</p>
              <ul className="space-y-2 mb-3">
                {['YOUR documents', 'YOUR links', 'YOUR expertise', 'YOUR voice', 'Trained only on you'].map((b, i) => (
                  <li key={i} className="flex items-center gap-2 text-xs text-zinc-300">
                    <Check className="w-3 h-3 text-primary shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>
              <div className="text-[10px] text-center text-primary/60 font-medium pt-2 border-t border-primary/10">
                Upload once. Answer forever.
              </div>
            </motion.div>
          </div>
        </FadeIn>

        {/* === HERO === */}
        <div className="text-center max-w-4xl mx-auto">
          <FadeIn delay={0.1} y={20}>
            <h1 className="text-[clamp(2.5rem,8vw,5.5rem)] font-black text-white leading-[1.04] tracking-[-0.03em] mb-4">
              YOUR AI.<br />
              <span className="gradient-text">YOUR VOICE.</span><br />
              <span className="text-white">ALWAYS ON.</span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2} y={15}>
            <p className="text-zinc-400 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8">
              Upload your knowledge once. Let AI answer every visitor instantly — <span className="text-zinc-200 font-semibold">in your voice</span>.
            </p>
          </FadeIn>

          {/* CTA Buttons */}
          <FadeIn delay={0.35} y={15}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-8">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                className="group relative px-8 py-4 rounded-2xl bg-primary text-black font-black text-sm flex items-center gap-2 transition-all shadow-amber-glow-lg hover:shadow-amber-glow overflow-hidden"
              >
                <motion.div
                  animate={{ opacity: [0, 0.4, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-20deg]"
                />
                <Sparkles className="w-4 h-4 relative" />
                <span className="relative">Claim Your Space</span>
                <ArrowRight className="w-4 h-4 relative group-hover:translate-x-0.5 transition-transform" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-8 py-4 rounded-2xl border border-white/10 text-zinc-300 font-semibold text-sm flex items-center gap-2 hover:bg-white/[0.04] hover:border-white/20 transition-all"
              >
                <Play className="w-4 h-4" />
                See Demo
              </motion.button>
            </div>
          </FadeIn>

          {/* Social Proof */}
          <FadeIn delay={0.45} y={15}>
            <div className="flex flex-col items-center justify-center gap-4 mb-8">
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-3">
                  {(recentProfiles && recentProfiles.length > 0 ? recentProfiles : Array.from({ length: 5 }, (_, i) => ({ avatar: undefined, username: ['Asym', 'Sarah', 'Kwame', 'Priya', 'Carlos'][i] }))).map((p, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.06 }}
                      className="relative w-7 h-7 rounded-full border-2 border-background overflow-hidden ring-2 ring-background"
                      style={{ zIndex: 5 - i }}
                    >
                      {p.avatar ? (
                        <Image src={p.avatar} alt="" width={28} height={28} className="w-full h-full object-cover" />
                      ) : (
                        <img src={`https://api.dicebear.com/9.x/avataaars/svg?seed=${p.username || 'User'}`} alt="" className="w-full h-full object-cover" />
                      )}
                    </motion.div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className="w-3 h-3 text-primary" fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg mx-auto mb-8">
              {[
                { icon: '🔥', label: 'Spaces Live', value: count },
                { icon: '💬', label: 'Questions Answered', value: '1,200+' },
                { icon: '⚡', label: 'AI Running 24/7', value: 'Always' },
                { icon: '🌍', label: 'Builders Worldwide', value: count > 0 ? count : '50+' },
              ].map((stat, i) => (
                <div key={i} className="paper-card p-3 text-center">
                  <p className="text-lg mb-0.5">{stat.icon}</p>
                  <p className="text-sm font-bold text-white">
                    {typeof stat.value === 'number' && stat.value > 0 ? (
                      <AnimatedCounter value={stat.value} />
                    ) : stat.value}
                  </p>
                  <p className="text-[10px] text-zinc-500">{stat.label}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* Trust line */}
          <FadeIn delay={0.55} y={10}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/[0.05] border border-primary/10 text-primary/60 text-[10px] font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
              </span>
              Built from Nigeria {`🇳🇬`}
            </div>
          </FadeIn>
        </div>

        {/* Username input */}
        <FadeIn delay={0.6} y={10}>
          <div className="flex justify-center mt-6">
            <div className="flex items-center bg-white/[0.03] border border-white/10 rounded-xl px-3 py-2 focus-within:border-primary/40 transition-all shadow-inner shadow-black/20 max-w-xs w-full">
              <span className="text-zinc-500 text-[11px] whitespace-nowrap shrink-0 font-mono">onequestion.space/</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                onKeyDown={e => e.key === 'Enter' && username && handleClaim()}
                placeholder="yourname"
                className="flex-1 bg-transparent text-white ml-1 outline-none placeholder:text-zinc-600 text-[11px] font-mono"
              />
              {username && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  onClick={handleClaim}
                  className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center shrink-0 ml-2 hover:bg-primary-light transition-colors"
                >
                  <ArrowRight className="w-3 h-3 text-black" />
                </motion.button>
              )}
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
