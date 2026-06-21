'use client';

import { useState } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useUser, SignInButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Crown, Zap, Users, MessageSquare, Star, ArrowRight, Check } from 'lucide-react';

const PERKS = [
  { icon: Crown, text: 'Free Pro access — forever' },
  { icon: Star, text: 'Your name in the product as a founder' },
  { icon: MessageSquare, text: 'Direct line to Asym — shape the roadmap' },
  { icon: Zap, text: 'Early access to every new feature' },
  { icon: Users, text: 'Private Discord community — founders only' },
];

export default function FoundingPage() {
  const { user, isSignedIn, isLoaded } = useUser();
  const spotsLeft = useQuery(api.founding.getSpotsLeft);
  const members = useQuery(api.founding.getFoundingMembers);
  const isFounder = useQuery(
    api.founding.isFoundingMember,
    isSignedIn && user?.id ? { userId: user.id } : 'skip'
  );
  const claimSpot = useMutation(api.founding.claimFoundingSpot);

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
      const displayName = user.fullName || user.username || 'Founder';

      const result = await claimSpot({
        userId: user.id,
        username,
        displayName,
      });

      if (result.success) {
        setClaimed(true);
        setSpotNumber(result.spotNumber ?? null);
      } else if (result.reason === 'already_claimed') {
        setClaimed(true);
      } else if (result.reason === 'full') {
        setError('All founding spots have been claimed. Join the waitlist instead.');
      }
    } catch (e) {
      setError('Something went wrong. Try again.');
    }
    setClaiming(false);
  };

  const spotsArray = Array.from({ length: 5 }, (_, i) => {
    const member = members?.find(m => m.spotNumber === i + 1);
    return { number: i + 1, member };
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-20 pb-24">
        <div className="max-w-lg mx-auto px-4">

          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-xs font-medium mb-6">
              <Crown className="w-3.5 h-3.5" />
              Only 5 spots. Ever.
            </div>
            <h1 className="text-4xl font-black text-white mb-4 leading-tight">
              Be a Founding<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-pink-500">Member</span>
            </h1>
            <p className="text-muted-foreground text-base leading-relaxed">
              One Question is being built in public by a 19-year-old from Nigeria on an Android phone. Join as a founder and help shape what it becomes.
            </p>
          </div>

          {/* Spots tracker */}
          <div className="glass rounded-2xl p-5 border border-white/10 mb-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-white">Founding spots</p>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary/10 text-primary font-medium">
                {spotsLeft ?? '...'} of 5 left
              </span>
            </div>
            <div className="flex gap-2">
              {spotsArray.map(({ number, member }) => (
                <div
                  key={number}
                  className={"flex-1 h-12 rounded-xl border flex items-center justify-center transition-all " + (member ? "border-primary/40 bg-primary/10" : "border-white/10 bg-white/3")}
                >
                  {member ? (
                    <div className="text-center">
                      <p className="text-xs font-bold text-yellow-400">👑 #{number}</p>
                      <p className="text-xs text-white/60 truncate px-1">{member.displayName.split(' ')[0]}</p>
                    </div>
                  ) : (
                    <p className="text-xs text-zinc-600">#{number}</p>
                  )}
                </div>
              ))}
            </div>
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
            ) : claimed || isFounder ? (
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3">
                  <Check className="w-6 h-6 text-primary" />
                </div>
                <p className="text-white font-bold mb-1">
                  {spotNumber ? `You are Founder #${spotNumber}` : 'You are a Founding Member'}
                </p>
                <p className="text-muted-foreground text-sm mb-4">Welcome to the inner circle. We will be in touch.</p>
                <div className="flex flex-col gap-3">
                  <a
                    href="https://discord.gg/JuQJQRTDYP"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-indigo-500 text-white text-sm font-bold hover:opacity-90 transition-opacity"
                  >
                    Join the Founders Discord
                  </a>
                  <Link href="/dashboard" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-white/10 text-white text-sm font-medium hover:bg-white/20 transition-colors">
                    Go to Dashboard <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : spotsLeft === 0 ? (
              <div className="text-center">
                <p className="text-white font-bold mb-2">All spots claimed</p>
                <p className="text-muted-foreground text-sm mb-4">You missed the founding round but you can still join the waitlist.</p>
                <Link href="/" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-white text-sm font-medium hover:opacity-90 transition-opacity">
                  Join Waitlist <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ) : !isSignedIn ? (
              <div className="text-center">
                <p className="text-white font-semibold mb-2">Claim your founding spot</p>
                <p className="text-muted-foreground text-xs mb-4">Sign in to claim. One click. No form.</p>
                <SignInButton mode="modal" forceRedirectUrl="/founding">
                  <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-pink-500 text-white font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                    <Crown className="w-4 h-4" />
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
                  <Crown className="w-4 h-4" />
                  {claiming ? 'Claiming...' : 'Claim my founding spot'}
                </button>
                <p className="text-center text-xs text-muted-foreground mt-2">Free forever. No credit card.</p>
              </div>
            )}
          </div>

          {/* Footer note */}
          <div className="glass rounded-2xl p-4 border border-white/10 mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white mb-0.5">Join the Discord</p>
              <p className="text-xs text-muted-foreground">Founders + community. Building in public together.</p>
            </div>
            <a
              href="https://discord.gg/JuQJQRTDYP"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-full bg-indigo-500 text-white text-xs font-bold hover:opacity-90 transition-opacity shrink-0"
            >
              Join
            </a>
          </div>

          <div className="glass rounded-2xl p-4 border border-white/10 mb-6 text-center">
            <p className="text-sm text-white font-medium mb-1">Missed the founding round?</p>
            <p className="text-xs text-muted-foreground mb-3">50 early adopter spots are open — 50% off Pro forever.</p>
            <a href="/early" className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-medium hover:bg-primary/20 transition-colors">
              Claim Early Adopter spot →
            </a>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Built by <a href="https://x.com/Asym_Alwali" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@Asym_Alwali</a> · Yobe, Nigeria · Android only
          </p>

        </div>
      </main>
    </div>
  );
}
