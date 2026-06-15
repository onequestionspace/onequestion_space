'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Check, Sparkles, User, AtSign, MessageSquare, Brain, Rocket, Upload, Camera, Share2, Copy } from 'lucide-react';

const steps = [
  { id: 'username', title: 'Claim your space', subtitle: 'Pick your unique URL — once it is gone it is gone', emoji: '🔥' },
  { id: 'name', title: 'What should we call you?', subtitle: 'Your public display name', emoji: '👋' },
  { id: 'bio', title: 'Tell the world about yourself', subtitle: 'One line that makes people want to ask you something', emoji: '✨' },
  { id: 'welcome', title: 'Set your AI greeting', subtitle: 'First thing visitors see on your space', emoji: '🤖' },
  { id: 'photo', title: 'Add your photo', subtitle: 'Makes your space feel personal and trustworthy', emoji: '📸' },
  { id: 'knowledge', title: 'Teach your AI', subtitle: 'Upload what you know so your AI can answer for you', emoji: '🧠' },
  { id: 'done', title: 'Your space is live!', subtitle: 'Share your link and start receiving questions', emoji: '🚀' },
];

export default function OnboardingPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadingKnowledge, setUploadingKnowledge] = useState(false);
  const [knowledgeSaved, setKnowledgeSaved] = useState(false);
  const fileInputRef = useRef(null);

  const profile = useQuery(api.profiles.current);
  const createProfile = useMutation(api.profiles.createIfMissing);
  const updateProfile = useMutation(api.profiles.update);

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    welcomeMessage: '',
    avatar: '',
  });

  const [knowledge, setKnowledge] = useState({
    title: '',
    content: '',
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

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'avatar');
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.url) {
        setForm(f => ({ ...f, avatar: data.url }));
        await updateProfile({ avatar: data.url });
      }
    } catch (e) { console.error(e); }
    setUploadingPhoto(false);
  };

  const handleKnowledgeSave = async () => {
    if (!knowledge.title.trim() || !knowledge.content.trim()) return;
    setUploadingKnowledge(true);
    try {
      await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: knowledge.title, content: knowledge.content }),
      });
      setKnowledgeSaved(true);
    } catch (e) { console.error(e); }
    setUploadingKnowledge(false);
  };

  const handleNext = async () => {
    if (step === 0) {
      setSaving(true);
      try {
        await createProfile({ username: form.username });
        await updateProfile({ username: form.username });
      } catch (e) { console.error(e); }
      setSaving(false);
      setStep(1);
      return;
    }
    if (step === 1) {
      await updateProfile({ displayName: form.displayName });
      setStep(2);
      return;
    }
    if (step === 2) {
      await updateProfile({ bio: form.bio });
      setStep(3);
      return;
    }
    if (step === 3) {
      await updateProfile({ welcomeMessage: form.welcomeMessage });
      setStep(4);
      return;
    }
    if (step === 4) {
      setStep(5);
      return;
    }
    if (step === 5) {
      setStep(6);
      return;
    }
    router.push('/dashboard');
  };

  const canNext = () => {
    if (step === 0) return form.username.length >= 3 && usernameAvailable !== false;
    if (step === 1) return form.displayName.length >= 2;
    if (step === 2) return form.bio.length >= 10;
    if (step === 3) return form.welcomeMessage.length >= 5;
    if (step === 4) return true;
    if (step === 5) return knowledgeSaved || true;
    return true;
  };

  const copyLink = () => {
    navigator.clipboard.writeText('https://onequestion.space/' + form.username);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isLoaded) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="animate-pulse text-muted-foreground">Loading...</div>
    </div>
  );

  if (!isSignedIn) { router.replace('/'); return null; }

  const current = steps[step];
  const progress = ((step + 1) / steps.length) * 100;
  const isDone = step === 6;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-40" />
        <div className="dot-pattern" />
      </div>

      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-8">
          <img src="/logo.png" alt="One Question" className="w-8 h-8 rounded-xl" />
          <span className="text-lg font-bold text-white">One Question</span>
        </div>

        {!isDone && (
          <>
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-3">
              <motion.div
                className="h-1.5 rounded-full bg-gradient-to-r from-primary to-pink"
                animate={{ width: progress + '%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
            <div className="flex items-center justify-between mb-6 px-1">
              <p className="text-xs text-muted-foreground">Step {step + 1} of {steps.length - 1}</p>
              <div className="flex gap-1">
                {steps.slice(0, -1).map((s, i) => (
                  <motion.div
                    key={s.id}
                    animate={{ width: i === step ? 20 : 6 }}
                    className={'h-1.5 rounded-full ' + (i < step ? 'bg-primary' : i === step ? 'bg-gradient-to-r from-primary to-pink' : 'bg-white/10')}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: isDone ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {isDone ? (
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                  className="text-7xl mb-6"
                >
                  🚀
                </motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">Your space is live!</h1>
                <p className="text-muted-foreground mb-8">Share your link and start receiving questions.</p>

                <div className="glass rounded-2xl p-5 border border-primary/30 mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Your space</p>
                  <p className="text-primary font-bold text-lg mb-4">onequestion.space/{form.username}</p>
                  <button
                    onClick={copyLink}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold flex items-center justify-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? 'Copied!' : 'Copy your link'}
                  </button>
                </div>

                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition-all"
                >
                  Go to dashboard
                </button>
              </div>
            ) : (
              <div className="glass rounded-3xl p-8 border border-white/10">
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
                        {!checking && usernameAvailable === true && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-4 h-4 text-green-400" /></motion.div>}
                        {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                      </div>
                    </div>
                    <AnimatePresence>
                      {usernameAvailable === true && (
                        <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-400">
                          ✓ onequestion.space/{form.username} is yours!
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
                    <p className="text-xs text-muted-foreground text-right">{form.bio.length}/160</p>
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
                    {form.welcomeMessage && (
                      <div className="glass rounded-2xl p-4 border border-primary/20 bg-primary/5">
                        <p className="text-xs text-primary mb-1">Preview</p>
                        <p className="text-sm text-white">{form.welcomeMessage}</p>
                      </div>
                    )}
                  </div>
                )}

                {step === 4 && (
                  <div className="space-y-4">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary to-pink flex items-center justify-center">
                        {form.avatar ? (
                          <img src={form.avatar} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-3xl font-bold text-white">{form.displayName?.[0] || 'A'}</span>
                        )}
                      </div>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingPhoto}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-white text-sm hover:bg-white/10 transition-all"
                      >
                        {uploadingPhoto ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Camera className="w-4 h-4" />}
                        {uploadingPhoto ? 'Uploading...' : 'Upload photo'}
                      </button>
                    </div>
                    <p className="text-center text-xs text-muted-foreground">You can skip this and add it later from settings</p>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Tell your AI what you know. It will use this to answer questions from visitors.</p>
                    <input
                      type="text"
                      value={knowledge.title}
                      onChange={e => setKnowledge(k => ({ ...k, title: e.target.value }))}
                      placeholder="e.g. About me"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all text-sm"
                    />
                    <textarea
                      value={knowledge.content}
                      onChange={e => setKnowledge(k => ({ ...k, content: e.target.value }))}
                      placeholder="Write anything you want your AI to know about you. Who you are, what you do, how to contact you, your expertise..."
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all resize-none text-sm"
                    />
                    {knowledgeSaved ? (
                      <div className="flex items-center gap-2 text-green-400 text-sm">
                        <Check className="w-4 h-4" />
                        Knowledge saved! Your AI is ready.
                      </div>
                    ) : (
                      <button
                        onClick={handleKnowledgeSave}
                        disabled={uploadingKnowledge || !knowledge.title.trim() || !knowledge.content.trim()}
                        className="w-full py-3 rounded-xl border border-primary/30 text-primary text-sm font-medium hover:bg-primary/10 transition-all disabled:opacity-40 flex items-center justify-center gap-2"
                      >
                        {uploadingKnowledge ? <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /> : <Upload className="w-4 h-4" />}
                        {uploadingKnowledge ? 'Saving...' : 'Save to AI'}
                      </button>
                    )}
                  </div>
                )}

                <button
                  onClick={handleNext}
                  disabled={!canNext() || saving}
                  className="w-full mt-8 py-3.5 px-6 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold flex items-center justify-center gap-2 hover:shadow-glow-primary transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : step === 5 ? (
                    <><Rocket className="w-4 h-4" /> Launch my space</>
                  ) : (
                    <>Continue <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                {(step === 4 || step === 5) && (
                  <button
                    onClick={handleNext}
                    className="w-full mt-2 py-2 text-xs text-muted-foreground hover:text-white transition-colors"
                  >
                    Skip for now
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}