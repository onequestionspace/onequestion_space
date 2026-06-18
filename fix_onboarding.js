const fs = require('fs');

const part1 = `'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Crown, Copy, Share2, Sparkles } from 'lucide-react';

export default function OnboardingPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);

  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const updateProfile = useMutation(api.profiles.update);

  const [form, setForm] = useState({ username: '', displayName: '', bio: '', welcomeMessage: '' });
  const [questionsPerWeek, setQuestionsPerWeek] = useState(10);
  const [minutesPerAnswer, setMinutesPerAnswer] = useState(5);
  const hoursPerMonth = Math.round((questionsPerWeek * 4 * minutesPerAnswer) / 60);
  const hoursPerYear = hoursPerMonth * 12;

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
    if (profile && profile.bio && profile.welcomeMessage) {
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
    if (step === 2) {
      setSaving(true);
      try {
        await createProfile({ username: form.username });
        await updateProfile({ username: form.username });
      } catch (e) { console.error(e); }
      setSaving(false);
      setStep(3); return;
    }
    if (step === 3) { await updateProfile({ displayName: form.displayName }); setStep(4); return; }
    if (step === 4) { await updateProfile({ bio: form.bio }); setStep(5); return; }
    if (step === 5) { await updateProfile({ welcomeMessage: form.welcomeMessage }); setStep(6); return; }
    if (step === 7) { router.push('/dashboard'); return; }
    setStep(s => s + 1);
  };

  const canNext = () => {
    if (step === 2) return form.username.length >= 3 && usernameAvailable !== false;
    if (step === 3) return form.displayName.length >= 2;
    if (step === 4) return form.bio.length >= 10;
    if (step === 5) return form.welcomeMessage.length >= 5;
    return true;
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://onequestion.space/' + form.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareToX = () => {
    const text = encodeURIComponent('Just set up my AI Q&A space on @onequestion_space — ask me anything at onequestion.space/' + form.username);
    window.open('https://x.com/intent/tweet?text=' + text, '_blank');
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );

  if (!isSignedIn) { router.replace('/'); return null; }

  const SETUP_STEPS = [2, 3, 4, 5];
  const isSetupStep = SETUP_STEPS.includes(step);
  const setupIndex = SETUP_STEPS.indexOf(step);
  const setupProgress = isSetupStep ? ((setupIndex + 1) / SETUP_STEPS.length) * 100 : 0;
`;

fs.writeFileSync('app/onboarding/page.tsx', part1);
console.log('Part 1 written');
