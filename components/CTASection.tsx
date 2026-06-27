'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';

export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72  rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.05]">
          Your knowledge.
          <br />
          <span className="gradient-text">Your answers.</span>
          <br />
          Your space.
        </h2>

        <p className="text-lg text-zinc-400 mb-10 max-w-md mx-auto leading-relaxed">
          Claim your space. Upload what you know. Your AI handles the rest — 24/7, in your voice.
        </p>

        <div className="flex flex-col items-center gap-4 mb-8">
          {isLoaded && (
            <Link
              href={isSignedIn ? '/dashboard' : '/sign-up'}
              className="inline-block px-10 py-5 bg-primary text-black font-black text-xl rounded-2xl transition-all hover:-translate-y-0.5 hover:bg-primary/90 shadow-lg shadow-primary/20"
            >
              Claim your space free →
            </Link>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Free forever plan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
