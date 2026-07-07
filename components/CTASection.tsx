'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { FadeIn } from '@/components/motion/FadeIn';

export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 amber-radial pointer-events-none" />
      <div className="absolute inset-0 grain opacity-[0.02] pointer-events-none mix-blend-soft-light" />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.3), transparent)' }} />

      <motion.div className='absolute top-20 left-[20%] w-64 h-64 rounded-full blur-[100px] opacity-20 animate-float'
        style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.5), transparent 70%)' }} />

      <div className="relative max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <FadeIn y={20}>
          <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/10 text-primary/70 text-[10px] font-mono mb-8'>
            <span className='relative flex h-1.5 w-1.5'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75' />
              <span className='relative inline-flex rounded-full h-1.5 w-1.5 bg-primary' />
            </span>
            built from termux on android · nigeria
          </div>

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-5 leading-[1.02] tracking-tight">
            Your knowledge.<br />
            <span className="gradient-text">Your answers.</span><br />
            Your space.
          </h2>

          <p className="text-base text-zinc-400 mb-5 max-w-md mx-auto leading-relaxed">
            Claim your space. Upload what you know. Your AI handles the rest — 24/7, in your voice.
          </p>

          <p className="text-xs text-zinc-600 mb-8 max-w-sm mx-auto">
            If one person could build this from a phone — your AI can answer your questions. 🇳🇬
          </p>

          {isLoaded && (
            <FadeIn y={16}>
              <div className="flex flex-col items-center gap-6 mb-8">
                <Link href={isSignedIn ? '/dashboard' : '/sign-up'}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 text-black font-black text-lg rounded-2xl transition-all hover:-translate-y-0.5 overflow-hidden shadow-amber-glow-lg"
                  style={{ background: 'linear-gradient(135deg, #F5A623 0%, #D9901A 100%)' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #F7B955 0%, #F5A623 100%)' }} />
                  <Sparkles className="relative w-5 h-5" />
                  <span className="relative">Claim your space free</span>
                  <ArrowRight className='relative w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Link>

                <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-500 text-sm">
                  {['Free forever plan', 'No credit card required', 'Cancel anytime'].map(item => (
                    <div key={item} className="flex items-center gap-1.5">
                      <Check className="w-4 h-4 text-primary shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          )}
        </FadeIn>
      </div>
    </section>
  );
}
