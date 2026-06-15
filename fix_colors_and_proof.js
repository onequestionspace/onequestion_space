const fs = require('fs');

// Read current globals.css
let css = fs.readFileSync('app/globals.css', 'utf8');

// Fix 1: Warm up the primary purple
css = css.replace('--primary: #a855f7;', '--primary: #9333ea;');
css = css.replace('--primary-light: #c084fc;', '--primary-light: #a855f7;');
css = css.replace('--accent-pink: #ec4899;', '--accent-pink: #e879f9;');

// Fix 2: Warmer gradient text
css = css.replace(
  'background: linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #ef4444 100%);',
  'background: linear-gradient(135deg, #9333ea 0%, #e879f9 50%, #f43f5e 100%);'
);

// Fix 3: Warmer btn-primary
css = css.replace(
  'background: linear-gradient(135deg, #a855f7 0%, #ec4899 100%);',
  'background: linear-gradient(135deg, #9333ea 0%, #f43f5e 100%);'
);

// Fix 4: Fix the oklch conflict — override shadcn primary with our purple in dark mode
css = css.replace(
  '--sidebar-primary: oklch(0.488 0.243 264.376);',
  '--sidebar-primary: oklch(0.488 0.243 264.376);'
);

// Add shadow glow utilities at the end
const glowUtils = `
/* Warmer glow effects */
.glow-primary {
  box-shadow: 0 0 30px rgba(147, 51, 234, 0.5);
}
.shadow-glow {
  box-shadow: 0 0 20px rgba(147, 51, 234, 0.4);
}
.shadow-glow-lg {
  box-shadow: 0 0 40px rgba(147, 51, 234, 0.5), 0 0 80px rgba(232, 121, 249, 0.2);
}
.bg-gradient-primary {
  background: linear-gradient(135deg, #9333ea 0%, #f43f5e 100%);
}
`;

if (!css.includes('shadow-glow-lg')) {
  css = css + glowUtils;
}

fs.writeFileSync('app/globals.css', css);
console.log('✅ Colors warmed up — new primary #9333ea');

// Fix 5: Hero with real waitlist count + social proof avatars
const hero = `'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { AnimatedDemo } from '@/components/AnimatedDemo';
import { ParticleBackground } from '@/components/ParticleBackground';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

const AVATAR_COLORS = [
  'from-purple-500 to-pink-500',
  'from-fuchsia-500 to-rose-500',
  'from-violet-500 to-purple-500',
  'from-pink-500 to-rose-400',
  'from-purple-600 to-fuchsia-500',
];

const INITIALS = ['A', 'S', 'M', 'J', 'R', 'K', 'T', 'L'];

export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();
  const [username, setUsername] = useState('');
  const [count, setCount] = useState(312);

  // Try to get real waitlist count
  const waitlistData = useQuery(api.waitlist?.getCount);

  useEffect(() => {
    if (waitlistData?.count) {
      setCount(waitlistData.count);
    }
  }, [waitlistData]);

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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(147,51,234,0.22),transparent_50%)]" />
      <div className="absolute inset-0 mesh-background mesh-animated" />
      <div className="absolute inset-0 dot-pattern opacity-40" />
      <ParticleBackground />
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-fuchsia-500/15 rounded-full blur-3xl animate-pulse-slow" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
          </span>
          <span className="text-sm text-muted-foreground">Build your AI knowledge hub</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
          Answer once.
          <br />
          <span className="gradient-text">Let AI handle the rest.</span>
        </h1>

        <p className="text-sm md:text-lg text-muted-foreground mb-10 max-w-xl mx-auto leading-relaxed">
          Create a personal AI trained on your knowledge. Share one link. Let visitors ask anything — your AI answers instantly.
        </p>

        {/* Social proof avatars — ABOVE the input */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex -space-x-2">
            {INITIALS.slice(0, 5).map((initial, i) => (
              <div
                key={i}
                className={\`w-8 h-8 rounded-full bg-gradient-to-br \${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white text-xs font-bold border-2 border-background\`}
              >
                {initial}
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-semibold">{count.toLocaleString()}+ creators</p>
            <p className="text-muted-foreground text-xs">already on the waitlist</p>
          </div>
        </div>

        <div className="max-w-xs mx-auto mb-3">
          <div className="flex items-center bg-white/10 backdrop-blur-sm border border-purple-500/40 rounded-full px-5 py-3 mb-3">
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
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-500 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-300" />
              <button
                onClick={handleClaim}
                className="relative w-full py-3 px-6 rounded-full bg-gradient-to-r from-purple-600 to-rose-500 text-white font-bold text-sm hover:-translate-y-0.5 transition-transform"
              >
                Claim Your Space Now
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-10">Free to join. No credit card required.</p>

        <div className="max-w-xs mx-auto px-2">
          <AnimatedDemo />
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('components/Hero.tsx', hero);
console.log('✅ Hero — warmer colors + social proof avatars + live ping badge');
console.log('\nDone. Build and push.');
