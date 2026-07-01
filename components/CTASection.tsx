'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';

export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-28 overflow-hidden">
      {/* Oily layered background */}
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(245,158,11,0.12), transparent 70%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 20% 50%, rgba(239,68,68,0.08), transparent 60%)' }} />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 50% 40% at 80% 50%, rgba(250,204,21,0.06), transparent 60%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.3), transparent)' }} />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/20 bg-amber-500/5 text-amber-400/70 text-xs font-mono mb-8'>
          📱 built from termux on android · kaduna, nigeria
        </div>

        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[1.05]">
          Your knowledge.<br />
          <span className="bg-gradient-to-r from-yellow-300 via-amber-400 to-red-400 bg-clip-text text-transparent">Your answers.</span><br />
          Your space.
        </h2>

        <p className="text-lg text-zinc-400 mb-4 max-w-md mx-auto leading-relaxed">
          Claim your space. Upload what you know. Your AI handles the rest — 24/7, in your voice.
        </p>

        <p className="text-sm text-zinc-600 mb-10 max-w-sm mx-auto">
          If one person could build this from a phone — your AI can handle your questions. 🇳🇬
        </p>

        <div className="flex flex-col items-center gap-4 mb-8">
          {isLoaded && (
            <Link href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="group relative inline-flex items-center gap-2 px-10 py-5 text-black font-black text-xl rounded-2xl transition-all hover:-translate-y-0.5 overflow-hidden"
              style={{ background: 'linear-gradient(135deg, #facc15 0%, #f59e0b 40%, #ef4444 100%)' }}>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 40%, #dc2626 100%)' }} />
              <span className="relative z-10">Claim your space free</span>
              <span className='relative z-10 group-hover:translate-x-1 transition-transform inline-block'>→</span>
            </Link>
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
      </div>
    </section>
  );
}
