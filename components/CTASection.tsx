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

        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Join creators, businesses, and teams already saving time with AI-powered Q&A pages.
        </p>

        <div className="flex flex-col items-center gap-4 mb-8">
          {isLoaded && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="relative inline-block px-10 py-5 bg-primary text-white font-bold text-xl rounded-full transition-all hover:-translate-y-0.5"
              >
                Claim Your Space Now
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-accent-yellow shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
