'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Zap, Star, Users, MessageSquare, ArrowRight, Check, Crown } from 'lucide-react';

const PERKS = [
  { icon: Zap, text: '50% off Pro — forever' },
  { icon: Star, text: 'Early Adopter badge on your space' },
  { icon: Users, text: 'Discord community access' },
  { icon: MessageSquare, text: 'Direct feedback line to the founders' },
];

export default function EarlyPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const spotsLeft = useQuery(api.earlyAdopters.getSpotsLeft);
  const isEarlyAdopter = useQuery(
    api.earlyAdopters.isEarlyAdopter,
    isSignedIn && user?.id ? { userId: user.id } : 'skip'
  );
  const isFounder = useQuery(
    api.founding.isFoundingMember,
    isSignedIn && user?.id ? { userId: user.id } : 'skip'
  );
  const claimSpot = useMutation(api.earlyAdopters.claimEarlyAdopterSpot);

  const [claiming, setClaiming] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [spotNumber, setSpotNumber] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleClaim = async () => {
    if (!user) return;
    setClaiming(true);
    setError('');
    try {
      const profile = await fetch('/api/profile').then(r => r.json());
      const username = profile?.username || user.username || user.id;
      const displayName = user.fullName || user.username || 'Early Adopter';

      const result = await claimSpot({ userId: user.id, username, displayName });

      if (result.success) {
        setClaimed(true);
        setSpotNumber(result.spotNumber ?? null);
      } else if (result.reason === 'already_claimed') {
        setClaimed(true);
      } else if (result.reason === 'full') {
        setError('All early adopter spots have been claimed.');
      }
    } catch (e) {
      setError('Something went wrong. Try again.');
    }
    setClaiming(false);
  };

  const pctClaimed = spotsLeft !== undefined ? Math.round(((50 - spotsLeft) / 50) * 100) : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-20 pb-24">
        <div className="max-w-lg mx-auto px-4">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-6">
              <Zap className="w-3.5 h-3.5" />
              50 spots. First come first served.
            </div>
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Early Adopter<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">Program</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              The founding round is closed. But you can still get in early and shape what One Question becomes.
            </p>
          </div>

          {/* Founding closed notice */}
          <div className="glass rounded-2xl p-4 border border-yellow-500/20 bg-yellow-500/5 mb-6 flex items-center gap-3">
            <Crown className="w-5 h-5 text-yellow-400 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-white">Founding round closed</p>
              <p className="text-xs text-muted-foreground">All 5 founding spots were claimed in 24 hours.</p>
            </div>
          </div>

          {/* Spots progress */}
          <div className="glass rounded-2xl p-5 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-white">Early adopter spots</p>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {spotsLeft ?? '...'} of 50 left
              </span>
            </div>
            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-pink-500 rounded-full transition-all"
                style={{ width: pctClaimed + '%' }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{50 - (spotsLeft ?? 50)} of 50 claimed</p>
          </div>

          {/* Perks */}
          <div className="glass rounded-2xl p-5 border border-white/10 mb-6">
            <p className="text-sm font-semibold text-white mb-4">What you get</p>
            <div className="space-y-3">
              {PERKS.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <p className="text-sm text-white/80">{perk.text}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="glass rounded-2xl p-5 border border-white/10 mb-6">
            {!isLoaded ? (
              <div className="h-12 rounded-xl bg-white/5 animate-pulse" />
            ) : isFounder ? (
              <div className="text-center">
                <Crown className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-white font-bold mb-1">You are a Founding Member</p>
                <p className="text-muted-foreground text-sm mb-4">You already have the highest tier. Thank you for believing early.</p>
                <Link href="/dashboard" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Go to Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : claimed || isEarlyAdopter ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <p className="text-white font-bold mb-1">
                  {spotNumber ? `You are Early Adopter #${spotNumber}` : 'You are an Early Adopter'}
                </p>
                <p className="text-muted-foreground text-sm mb-4">Welcome. Your badge is live on your space.</p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://discord.gg/JuQJQRTDYP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Join the Discord
                  </a>
                  <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : spotsLeft === 0 ? (
              <div className="text-center">
                <p className="text-white font-bold mb-2">All spots claimed</p>
                <p className="text-muted-foreground text-sm mb-4">Join the waitlist to be notified of next opportunities.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Join Waitlist <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : !isSignedIn ? (
              <div className="text-center">
                <p className="text-white font-semibold mb-2">Claim your early adopter spot</p>
                <p className="text-muted-foreground text-xs mb-4">Sign in to claim. One click. No form.</p>
                <SignInButton mode="modal" forceRedirectUrl="/early">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Sign in to claim spot
                  </button>
                </SignInButton>
              </div>
            ) : (
              <div>
                {error && <p className="text-red-400 text-xs mb-3 text-center">{error}</p>}
                <button
                  onClick={handleClaim}
                  disabled={claiming}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  {claiming ? 'Claiming...' : 'Claim my early adopter spot'}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-2">50% off Pro forever. No credit card.</p>
              </div>
            )}
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Built by <a href="https://x.com/Asym_Alwali" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Asym_Alwali</a> · Yobe, Nigeria · Android only
          </p>

        </div>
      </main>
    </div>
  );
}
