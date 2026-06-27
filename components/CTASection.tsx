'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';

export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-amber-500/8 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* Raw honest badge */}
        <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-700 text-zinc-400 text-xs font-mono mb-8'>
          📱 built from termux on android · kaduna, nigeria
        </div>

        <h2 className="text-5xl md:text-6xl font-black text-white mb-6 leading-[1.05]">
          Your knowledge.<br />
          <span className="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Your answers.</span><br />
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
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="group inline-flex items-center gap-2 px-10 py-5 bg-amber-500 hover:bg-amber-400 text-black font-black text-xl rounded-2xl transition-all hover:-translate-y-0.5 shadow-lg shadow-amber-500/20"
            >
              Claim your space free
              <span className='group-hover:translate-x-1 transition-transform inline-block'>→</span>
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
