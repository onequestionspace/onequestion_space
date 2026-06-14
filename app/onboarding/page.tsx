'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, User, AtSign, MessageSquare, Brain, Rocket, Star } from 'lucide-react';

const steps = [
  { id: 'username', title: 'Claim your space', subtitle: 'Pick your unique URL — once it is gone it is gone', icon: AtSign, emoji: '🔥' },
  { id: 'name', title: 'What should we call you?', subtitle: 'This is your public display name', icon: User, emoji: '👋' },
  { id: 'bio', title: 'Tell the world about yourself', subtitle: 'One line that makes people want to ask you something', icon: Brain, emoji: '✨' },
  { id: 'welcome', title: 'Set your AI greeting', subtitle: 'First thing visitors see — make it irresistible', icon: MessageSquare, emoji: '🤖' },
];

const MOTIVATIONAL = [
  'Your space is almost ready.',
  'People are going to love this.',
  'You are about to save hours every week.',
  'One last thing and you are live.',
];

export default function OnboardingPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
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

  const checkUsername = async (val) => {
    if (!val || val.length < 3) { setUsernameAvailable(null); return; }
    setChecking(true);
    try {
      const res = await fetch('/api/check-username?username=' + val);
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
      setLaunched(true);
      setTimeout(() => router.push('/dashboard'), 2500);
    } catch (e) {
      console.error(e);
      setSaving(false);
    }
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

  if (launched) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', duration: 0.6 }}
        className="text-center"
      >
        <div className="text-8xl mb-6">🚀</div>
        <h1 className="text-3xl font-bold text-white mb-2">Your space is live!</h1>
        <p className="text-muted-foreground mb-2">onequestion.space/{form.username}</p>
        <p className="text-sm text-primary">Taking you to your dashboard...</p>
      </motion.div>
    </div>
  );

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-40" />
        <div className="dot-pattern" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.png" alt="One Question" className="w-8 h-8 rounded-xl" />
          <span className="text-lg font-bold text-white">One Question</span>
        </div>

        <div className="w-full h-1.5 bg-white/10 rounded-full mb-3">
          <motion.div
            className="h-1.5 rounded-full bg-gradient-to-r from-primary to-pink"
            animate={{ width: progress + '%' }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <div className="flex items-center justify-between mb-8 px-1">
          <p className="text-xs text-muted-foreground">{MOTIVATIONAL[step]}</p>
          <p className="text-xs text-muted-foreground">{step + 1} / {steps.length}</p>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="glass rounded-3xl p-8 border border-white/10 mb-4"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="text-3xl">{current.emoji}</div>
              <div>
                <h2 className="text-xl font-bold text-white">{current.title}</h2>
                <p className="text-sm text-muted-foreground">{current.subtitle}</p>
              </div>
            </div>

            {step === 0 && (
              <div className="space-y-3">
                <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-all">
                  <span className="px-3 text-muted-foreground text-sm whitespace-nowrap">onequestion.space/</span>
                  <input
                    type="text"
                    value={form.username}
                    onChange={e => {
                      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                      setForm(f => ({ ...f, username: val }));
                      checkUsername(val);
                    }}
                    placeholder="yourname"
                    className="flex-1 bg-transparent py-3 pr-10 text-white focus:outline-none text-sm"
                    autoFocus
                  />
                  <div className="pr-3">
                    {checking && <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                    {!checking && usernameAvailable === true && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <Check className="w-4 h-4 text-green-400" />
                      </motion.div>
                    )}
                    {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                  </div>
                </div>
                <AnimatePresence>
                  {usernameAvailable === true && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-400 flex items-center gap-1">
                      <Star className="w-3 h-3" /> onequestion.space/{form.username} is yours!
                    </motion.p>
                  )}
                  {usernameAvailable === false && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">
                      That username is taken. Try another one.
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            )}

            {step === 1 && (
              <input
                type="text"
                value={form.displayName}
                onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
                placeholder="Your full name"
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                autoFocus
              />
            )}

            {step === 2 && (
              <div className="space-y-2">
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 160) }))}
                  placeholder="e.g. Building AI products and sharing what I learn along the way."
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all resize-none text-sm"
                  autoFocus
                />
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">Make it interesting — this is what people see first</p>
                  <p className="text-xs text-muted-foreground">{form.bio.length}/160</p>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3">
                <input
                  type="text"
                  value={form.welcomeMessage}
                  onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
                  placeholder="Ask me anything about building in public!"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all"
                  autoFocus
                />
                <div className="glass rounded-2xl p-4 border border-primary/20 bg-primary/5">
                  <p className="text-xs text-primary mb-1">Preview</p>
                  <p className="text-sm text-white">{form.welcomeMessage || 'Ask me anything about building in public!'}</p>
                </div>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!canNext() || saving}
              className="w-full mt-8 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold flex items-center justify-center gap-2 hover:shadow-glow-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {saving ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {step === steps.length - 1 ? (
                    <><Rocket className="w-4 h-4" /> Launch my space</>
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </>
              )}
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-2">
          {steps.map((s, i) => (
            <motion.div
              key={s.id}
              animate={{ width: i === step ? 24 : 8 }}
              className={'h-2 rounded-full transition-colors ' + (i < step ? 'bg-primary' : i === step ? 'bg-gradient-to-r from-primary to-pink' : 'bg-white/10')}
            />
          ))}
        </div>
      </div>
    </div>
  );
}