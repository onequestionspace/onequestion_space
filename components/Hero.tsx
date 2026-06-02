'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hero Section Component
 * Premium hero with gradient background and dual CTA
 */
export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated background gradients */}
      <div className="absolute inset-0 bg-cyber-black">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyber-purple/20 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyber-purple/10 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
          Stop answering the
          <br />
          <span className="bg-gradient-to-r from-cyber-purple via-cyber-yellow to-cyber-red bg-clip-text text-transparent">
            same question twice
          </span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
          Upload your knowledge once. Let AI answer forever.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {isLoaded && (
            <>
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="group relative px-8 py-4 bg-gradient-to-r from-cyber-purple to-cyber-red text-white font-bold text-lg rounded-xl overflow-hidden transition-all hover:shadow-glow-purple-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-red to-cyber-purple opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <span className="relative">Claim Your Space</span>
              </Link>

              <Link
                href="/waitlist"
                className="px-8 py-4 border-2 border-cyber-purple text-cyber-purple font-bold text-lg rounded-xl hover:bg-cyber-purple/10 transition-all hover:shadow-glow-purple"
              >
                Join Waitlist
              </Link>
            </>
          )}
        </div>

        {/* Hero Visual - Mockup */}
        <div className="relative mt-16">
          <div className="bg-gradient-to-b from-cyber-purple/10 to-transparent rounded-2xl border border-cyber-purple/30 p-8 backdrop-blur-sm">
            <div className="bg-cyber-gray rounded-lg p-6 space-y-4">
              {/* Profile Header */}
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyber-purple to-cyber-red"></div>
                <div className="text-left">
                  <p className="text-white font-bold">@creator</p>
                  <p className="text-gray-400 text-sm">Ask me anything</p>
                </div>
              </div>

              {/* Question Box */}
              <div className="bg-cyber-black/50 rounded-lg p-4 border border-cyber-purple/20">
                <p className="text-gray-400 text-sm">What&apos;s your best productivity tip?</p>
              </div>

              {/* AI Answer */}
              <div className="bg-cyber-purple/10 rounded-lg p-4 border border-cyber-purple/30">
                <p className="text-gray-300 text-sm">
                  <span className="text-cyber-purple font-semibold">AI Answer:</span> Focus on deep work blocks with the Pomodoro technique...
                </p>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-20 h-20 border border-cyber-purple/20 rounded-full"></div>
          <div className="absolute -bottom-4 -left-4 w-32 h-32 border border-cyber-purple/10 rounded-full"></div>
        </div>
      </div>
    </section>
  );
}
