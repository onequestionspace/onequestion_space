'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedDemo } from '@/components/AnimatedDemo';

export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();
  const [username, setUsername] = useState('');

  const handleClaim = () => {
    const cleanUsername = username.trim().toLowerCase();
    if (isSignedIn) {
      window.location.href = '/dashboard?username=' + cleanUsername;
    } else {
      window.location.href = '/sign-up?username=' + cleanUsername;
    }
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-16 pb-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.20),transparent_50%)]" />
      <div className="absolute inset-0 mesh-background mesh-animated" />
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-pink/15 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
          <span className="text-sm text-muted-foreground">Build your AI knowledge hub</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-white mb-4 leading-tight tracking-tight overflow-hidden">
          Answer once.
          <br />
          <span className="gradient-text">Let AI handle the rest.</span>
        </h1>

        <p className="text-sm md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed overflow-hidden w-full">
          Create a personal AI trained on your knowledge. Share one link. Let visitors ask anything — your AI answers instantly.
        </p>

        <div className="max-w-md mx-auto mb-3">
          <div className="flex items-center bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-5 py-3 mb-3">
            <span className="text-muted-foreground text-sm whitespace-nowrap shrink-0">onequestion.space/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              placeholder="yourname"
              className="flex-1 bg-transparent text-white ml-1 outline-none placeholder:text-muted-foreground text-sm"
            />
          </div>
          {isLoaded && (
            <button
              onClick={handleClaim}
              className="w-full py-3 px-6 rounded-full bg-gradient-to-r from-primary to-pink text-white font-bold text-base hover:shadow-glow-lg transition-all hover:-translate-y-0.5"
            >
              Claim Your Space Now
            </button>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-10">Free to join. No credit card required.</p>

        <div className="max-w-sm mx-auto">
          <AnimatedDemo />
        </div>
      </div>
    </section>
  );
}