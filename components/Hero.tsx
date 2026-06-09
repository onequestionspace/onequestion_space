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
      window.location.href = `/dashboard?username=${cleanUsername}`;
    } else {
      window.location.href = `/sign-up?username=${cleanUsername}`;
    }
  };

  return (
    <section className="relative flex items-center justify-center overflow-hidden pt-12 pb-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(139,92,246,0.20),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.15),transparent_50%)]" />

      <div className="absolute inset-0 mesh-background mesh-animated" />
      <div className="absolute inset-0 dot-pattern opacity-40" />

      <div className="absolute top-1/4 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-accent-pink/15 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-accent-yellow/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="w-2 h-2 rounded-full bg-accent-yellow animate-pulse" />
          <span className="text-sm text-muted-foreground">
            ⚡ Build your AI knowledge hub
          </span>
        </div>

        <h1 className="text-3xl md:text-6xl font-bold text-white mb-4 leading-tight tracking-tight break-words">
          Answer once.
          <br />
          <span className="gradient-text">
            Let AI handle the rest.
          </span>
        </h1>

        <p className="text-lg md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed px-4 overflow-hidden">
          Create a personal AI trained on your knowledge. Share one link where visitors can ask anything about your work, products, or expertise.
        </p>

        <div className="max-w-2xl mx-auto mb-6">
          <div className="glass rounded-2xl p-2 border border-primary/30">

            <div className="flex flex-col sm:flex-row gap-2">

              <div className="flex-1 flex items-center px-3 py-3 bg-white/5 rounded-xl min-w-0">
                <span className="text-muted-foreground text-sm sm:text-base whitespace-nowrap shrink-0">
                  onequestion.space/
                </span>

                <input
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(
                      e.target.value
                        .toLowerCase()
                        .replace(/[^a-z0-9_-]/g, '')
                    )
                  }
                  placeholder="yourname"
                  className="flex-1 bg-transparent text-white ml-1 outline-none placeholder:text-muted-foreground"
                />
              </div>

              {isLoaded && (
                <button
                  onClick={handleClaim}
                  className="px-6 py-4 bg-gradient-primary text-white font-semibold rounded-xl hover:shadow-glow-lg transition-all hover:-translate-y-0.5"
                >
                  Claim Your Space
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-8">
          Your AI knowledge hub lives at your personal URL.
        </div>

        <div className="relative max-w-2xl mx-auto">
            <AnimatedDemo />
            <div className="absolute -inset-4 border border-primary/10 rounded-[2rem] pointer-events-none" />
            <div className="absolute -inset-8 border border-primary/5 rounded-[2.5rem] pointer-events-none" />
          </div>
        </div>
      </section>
    );
}
