'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

/**
 * Final CTA Section Component
 * Closing call-to-action with strong messaging
 */
export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-20 bg-cyber-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-cyber-purple/10 to-transparent"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyber-purple/20 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main message */}
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Your knowledge.
          <br />
          <span className="bg-gradient-to-r from-cyber-purple via-cyber-yellow to-cyber-red bg-clip-text text-transparent">
            Your answers.
          </span>
          <br />
          Your space.
        </h2>

        {/* Subtext */}
        <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto">
          Join creators, businesses, and teams who are already saving time with AI-powered Q&A pages.
        </p>

        {/* CTA Button */}
        {isLoaded && (
          <Link
            href={isSignedIn ? '/dashboard' : '/sign-up'}
            className="inline-block group relative px-10 py-5 bg-gradient-to-r from-cyber-purple to-cyber-red text-white font-bold text-xl rounded-xl overflow-hidden transition-all hover:shadow-glow-purple-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyber-red to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <span className="relative">Claim Your Space Now</span>
          </Link>
        )}

        {/* Trust badges */}
        <div className="mt-16 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 text-gray-400 text-sm">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-cyber-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Free 14-day trial</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-cyber-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-cyber-purple" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span>Cancel anytime</span>
          </div>
        </div>
      </div>
    </section>
  );
}
