'use client';
import Image from 'next/image';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';

/**
 * Hero Section Component
 * Linktree-inspired minimal design with mesh background
 */
export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 mesh-background mesh-animated" />
      
      {/* Dot pattern overlay */}
      <div className="absolute inset-0 dot-pattern opacity-40" />

      {/* Floating decorative elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-pink/15 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl animate-pulse-slow" />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
          <span className="text-sm text-muted-foreground">Now in Early Access</span>
        </div>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
          Stop answering the
          <br />
          <span className="gradient-text">same question twice</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
          Upload your knowledge once. Let AI answer forever.
          <br className="hidden sm:block" />
          Your personal Q&A page, powered by AI.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          {isLoaded && (
            <>
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="group relative px-8 py-4 bg-gradient-primary text-white font-semibold text-lg rounded-full overflow-hidden transition-all hover:shadow-glow-lg hover:-translate-y-0.5"
              >
                Claim Your Space
              </Link>

              <Link
                href="/waitlist"
                className="px-8 py-4 rounded-full font-semibold text-lg border border-white/20 text-white hover:bg-white/5 transition-all hover:border-primary/50"
              >
                Claim Early Access 
              </Link>
            </>
          )}

        </div>
        {/* Hero Visual - Linktree-style Preview Card */}
        <div className="relative mt-8 max-w-md mx-auto">
          <div className="glass rounded-3xl p-6 card-hover">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-6">
              <Image src="/founders/asym.png" alt="Asym" width={80} height={80} className="w-20 h-20 rounded-full object-cover mb-4 ring-4 ring-white/10" />
              <h3 className="text-white font-bold text-xl">@asym</h3>
              <p className="text-muted-foreground text-sm">Founder at One Question</p>
            </div>

            {/* Links Preview */}
            <div className="space-y-3">
              <div className="bg-white/5 hover:bg-white/10 rounded-xl p-4 border border-white/10 transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">Ask me anything</span>
                  <svg className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              <div className="bg-gradient-primary/20 hover:bg-gradient-primary/30 rounded-xl p-4 border border-primary/30 transition-all cursor-pointer">
                <div className="flex items-center justify-between">
                  <span className="text-white font-medium">AI-Powered Q&A</span>
                  <span className="text-xs bg-primary/30 text-primary-light px-2 py-1 rounded-full">Live</span>
                </div>
              </div>
            </div>
          </div>

          {/* Decorative rings */}
          <div className="absolute -inset-4 border border-primary/10 rounded-[2rem] pointer-events-none" />
          <div className="absolute -inset-8 border border-primary/5 rounded-[2.5rem] pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
