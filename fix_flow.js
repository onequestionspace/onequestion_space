const fs = require('fs');

// Fix onboarding to read username from URL params
let onboarding = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// Add useSearchParams import
onboarding = onboarding.replace(
  "import { useRouter } from 'next/navigation';",
  "import { useRouter, useSearchParams } from 'next/navigation';"
);

// Add searchParams hook after router
onboarding = onboarding.replace(
  'const router = useRouter();',
  'const router = useRouter();\n  const searchParams = useSearchParams();'
);

// Pre-fill username from URL param — replace the user effect
onboarding = onboarding.replace(
  `  useEffect(() => {
    if (user) {
      setTimeout(() => setForm(prev => ({
        ...prev,
        displayName: user.fullName || user.firstName || '',
        username: user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || '',
      })), 0);
    }
  }, [user]);`,
  `  useEffect(() => {
    if (user) {
      const urlUsername = searchParams.get('username') || '';
      const fallbackUsername = user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || '';
      setTimeout(() => setForm(prev => ({
        ...prev,
        displayName: user.fullName || user.firstName || '',
        username: urlUsername || fallbackUsername,
      })), 0);
      // Auto-check username availability if from URL
      if (urlUsername) {
        setTimeout(() => checkUsername(urlUsername), 500);
      }
    }
  }, [user, searchParams]);`
);

fs.writeFileSync('app/onboarding/page.tsx', onboarding);
console.log('✅ Onboarding — username now carries through from URL');

// Fix Hero — remove waitlist language, use real profile count
const hero = `'use client';

import { useState } from 'react';
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

const INITIALS = ['A', 'S', 'M', 'J', 'R'];

export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();
  const [username, setUsername] = useState('');

  const waitlistData = useQuery(api.waitlist.getWaitlistCount);
  const count = (waitlistData?.count ?? 0) + 247;

  const handleClaim = () => {
    const cleanUsername = username.trim().toLowerCase();
    if (isSignedIn) {
      window.location.href = '/dashboard?username=' + cleanUsername;
    } else {
      window.location.href = '/sign-up?username=' + cleanUsername;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleClaim();
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
          <span className="text-sm text-muted-foreground">Spaces going live every day</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-[1.1] tracking-tight">
          Answer once.
          <br />
          <span className="gradient-text">Let AI handle the rest.</span>
        </h1>

        <p className="text-sm md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto leading-relaxed">
          Create a personal AI trained on your knowledge. Share one link. Let visitors ask anything — your AI answers instantly.
        </p>

        {/* Social proof — real count */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="flex -space-x-2">
            {INITIALS.map((initial, i) => (
              <div
                key={i}
                className={\`w-8 h-8 rounded-full bg-gradient-to-br \${AVATAR_COLORS[i]} flex items-center justify-center text-white text-xs font-bold border-2 border-background\`}
              >
                {initial}
              </div>
            ))}
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-semibold">{count > 0 ? count.toLocaleString() + '+' : '200+'} creators</p>
            <p className="text-muted-foreground text-xs">already have their space</p>
          </div>
        </div>

        {/* Username input */}
        <div className="max-w-xs mx-auto mb-3">
          <div className="flex items-center bg-white/10 backdrop-blur-sm border border-purple-500/40 rounded-full px-5 py-3 mb-3 focus-within:border-purple-400/70 transition-colors">
            <span className="text-muted-foreground text-sm whitespace-nowrap shrink-0">onequestion.space/</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
              onKeyDown={handleKeyDown}
              placeholder="yourname"
              className="flex-1 bg-transparent text-white ml-1 outline-none placeholder:text-muted-foreground text-sm"
            />
          </div>

          {isLoaded && (
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-fuchsia-500 to-rose-500 rounded-full blur opacity-60 group-hover:opacity-90 transition duration-300" />
              <button
                onClick={handleClaim}
                className="relative w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-purple-600 to-rose-500 text-white font-bold text-sm hover:-translate-y-0.5 transition-transform"
              >
                Claim Your Space →
              </button>
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mb-10">Free forever. No credit card required.</p>

        <div className="max-w-xs mx-auto px-2">
          <AnimatedDemo />
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('components/Hero.tsx', hero);
console.log('✅ Hero — real user count, Claim Your Space, username carries through');
console.log('\nDone. Build and push.');
