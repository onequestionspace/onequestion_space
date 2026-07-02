'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Check, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/5 to-transparent" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(245,158,11,0.15), transparent 70%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 50%, rgba(239,68,68,0.10), transparent 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 50%, rgba(250,204,21,0.08), transparent 60%)' }} />

      <motion.div className='absolute top-20 left-[20%] w-64 h-64 rounded-full blur-[100px] opacity-20 animate-float-slow'
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.6), transparent 70%)' }} />
      <motion.div className='absolute bottom-20 right-[20%] w-48 h-48 rounded-full blur-[80px] opacity-15'
        style={{ background: 'radial-gradient(circle, rgba(239,68,68,0.5), transparent 70%)' }}
        animate={{ y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />

      <div className='absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-soft-light' style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 width=%27400%27 height=%27400%27%3E%3Cfilter id=%27n%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.85%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27400%27 height=%27400%27 filter=%27url(%2523noise)%27 opacity=%271%27/%3E%3C/svg%3E")',
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400/70 text-xs font-mono mb-8 backdrop-blur-sm'>
            <span className='relative flex h-2 w-2'>
              <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75' />
              <span className='relative inline-flex rounded-full h-2 w-2 bg-amber-500' />
            </span>
            built from termux on android · nigeria
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 leading-[1.02] tracking-tight">
            Your knowledge.<br />
            <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-red-400 bg-clip-text text-transparent animate-gradient">Your answers.</span><br />
            Your space.
          </h2>

          <p className="text-lg text-zinc-400 mb-6 max-w-md mx-auto leading-relaxed">
            Claim your space. Upload what you know. Your AI handles the rest — 24/7, in your voice.
          </p>

          <p className="text-sm text-zinc-600 mb-10 max-w-sm mx-auto">
            If one person could build this from a phone — your AI can handle your questions. 🇳🇬
          </p>

          <div className="flex flex-col items-center gap-6 mb-8">
            {isLoaded && (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <Link href={isSignedIn ? '/dashboard' : '/sign-up'}
                  className="group relative inline-flex items-center gap-3 px-10 py-5 text-black font-black text-xl rounded-2xl transition-all hover:-translate-y-0.5 overflow-hidden shadow-2xl"
                  style={{ background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 40%, #ef4444 100%)' }}>
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #dc2626 100%)' }} />
                  <div className="absolute -inset-full opacity-0 group-hover:opacity-30 transition-all duration-700 bleed-amber blur-xl" />
                  <Sparkles className="relative z-10 w-5 h-5" />
                  <span className="relative z-10">Claim your space free</span>
                  <ArrowRight className='relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Link>
              </motion.div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-zinc-500 text-sm">
              {['Free forever plan', 'No credit card required', 'Cancel anytime'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
