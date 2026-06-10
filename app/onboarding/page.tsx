'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, User, AtSign, MessageSquare, Brain } from 'lucide-react';

const steps = [
  { id: 'username', title: 'Claim your space', subtitle: 'This is your unique URL on One Question', icon: AtSign },
  { id: 'name', title: 'What should we call you?', subtitle: 'This is your public display name', icon: User },
  { id: 'bio', title: 'Tell visitors about yourself', subtitle: 'A short bio shown on your space', icon: Brain },
  { id: 'welcome', title: 'Set your welcome message', subtitle: 'First thing visitors see when they land', icon: MessageSquare },
];

export default function OnboardingPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const updateProfile = useMutation(api.profiles.update);

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    welcomeMessage: '',
  });

  useEffect(() => {
    if (user) {
      setTimeout(() => setForm(prev => ({
        ...prev,
        displayName: user.fullName || user.firstName || '',
        username: user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || '',
      })), 0);
    }
  }, [user]);

  useEffect(() => {
    if (profile && profile.bio) {
      router.replace('/dashboard');
    }
  }, [profile, router]);

  const checkUsername = async (val: string) => {
    if (!val || val.length < 3) { setUsernameAvailable(null); return; }
    setChecking(true);
    try {
      const res = await fetch(`/api/check-username?username=${val}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch { setUsernameAvailable(null); }
    setChecking(false);
  };

  const handleNext = async () => {
    if (step < steps.length - 1) {
      setStep(s => s + 1);
      return;
    }
    setSaving(true);
    try {
      await createProfile({ username: form.username });
      await updateProfile({
        username: form.username,
        displayName: form.displayName,
        bio: form.bio,
        welcomeMessage: form.welcomeMessage,
      });
      router.push('/dashboard');
    } catch (e) {
      console.error(e);
    }
    setSaving(false);
  };

  const canNext = () => {
    if (step === 0) return form.username.length >= 3 && usernameAvailable !== false;
    if (step === 1) return form.displayName.length >= 2;
    if (step === 2) return form.bio.length >= 10;
    return true;
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );

  if (!isSignedIn) { router.replace('/'); return null; }

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-40" />
        <div className="dot-pattern" />
      </div>

      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-10">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-pink flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-foreground">One Question</span>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1 bg-border rounded-full mb-8">
          <motion.div
            className="h-1 rounded-full bg-gradient-to-r from-primary to-pink"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s.id} className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-primary w-6' : i < step ? 'bg-primary/50' : 'bg-border'}`} />
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
            className="glass-card rounded-3xl p-8 border border-border"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <current.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{current.title}</h2>
                <p className="text-sm text-muted-foreground">{current.subtitle}</p>
              </div>
            </div>

            {/* Username step */}
            {step === 0 && (
              <div className="space-y-3">
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">onequestion.space/</span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                      setForm(f => ({ ...f, username: val }));
                      checkUsername(val);
                    }}
                    placeholder="yourname"
                    className="w-full pl-36 pr-10 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    {checking && <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                    {!checking && usernameAvailable === true && <Check className="w-4 h-4 text-green-500" />}
                    {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                  </div>
                </div>
                {usernameAvailable === false && <p className="text-xs text-red-400">This username is taken. Try another one.</p>}
                {usernameAvailable === true && <p className="text-xs text-green-500">Available!</p>}
              </div>
            )}

            {/* Display name step */}
            {step === 1 && (
              <input
                type="text"
                value={form.displayName}
                onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                autoFocus
              />
            )}

            {/* Bio step */}
            {step === 2 && (
              <div className="space-y-2">
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="e.g. Building AI products and sharing what I learn along the way."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground text-right">{form.bio.length}/160</p>
              </div>
            )}

            {/* Welcome message step */}
            {step === 3 && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.welcomeMessage}
                  onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
                  placeholder="Ask me anything about building in public!"
                  className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">This appears at the top of your space as an AI greeting.</p>
              </div>
            )}

            {/* Next button */}
            <button
              onClick={handleNext}
              disabled={!canNext() || saving}
              className="w-full mt-8 py-3 px-6 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold flex items-center justify-center gap-2 hover:shadow-glow-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {step === steps.length - 1 ? 'Launch my space' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Step {step + 1} of {steps.length}
        </p>
      </div>
    </div>
  );
}
