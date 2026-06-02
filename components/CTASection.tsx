'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';

/**
 * Final CTA Section Component
 * Strong closing call-to-action
 */
export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-pink/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main message */}
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your knowledge.
          <br />
          <span className="gradient-text">Your answers.</span>
          <br />
          Your space.
        </h2>

        {/* Subtext */}
        <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
          Join creators, businesses, and teams who are already saving time with AI-powered Q&A pages.
        </p>

        {/* CTA Button */}
        {isLoaded && (
          <Link
            href={isSignedIn ? '/dashboard' : '/sign-up'}
            className="inline-block px-10 py-5 bg-gradient-primary text-white font-bold text-xl rounded-full transition-all hover:shadow-glow-lg hover:-translate-y-1"
          >
            Claim Your Space Now
          </Link>
        )}

        {/* Trust badges */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6 text-muted-foreground text-sm">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-primary" />
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-accent-pink" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-accent-yellow" />
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
