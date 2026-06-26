'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
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

  const [form, setForm] = useState({
    username: '',
    displayName: '',
    bio: '',
    welcomeMessage: '',
    themeColor: '#a855f7',
    vibe: [],
    goalTitle: '',
    goalProgress: 0,
    goalDeadline: '2026-12-31'
  });
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
    if (!profile) return;
    if (profile.bio && profile.welcomeMessage) {
      router.replace('/dashboard/studio');
    }
  }, [profile, router]);

  const checkUsername = async (val: string) => {
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
    if (step === 4) { await updateProfile({ bio: form.bio }); setStep(4.5); return; }
    if (step === 4.5) { await updateProfile({ vibe: form.vibe }); setStep(4.6); return; }
    if (step === 4.6) { await updateProfile({ goals: form.goals }); setStep(5); return; }
    if (step === 5) { await updateProfile({ welcomeMessage: form.welcomeMessage }); setStep(6); return; }
    if (step === 6) { await updateProfile({ themeColor: form.themeColor }); setStep(7); return; }
    if (step === 7) { router.push('/dashboard/studio'); return; }
    setStep(s => s + 1);
  };

  const canNext = () => {
    if (step === 2) return form.username.length >= 3 && usernameAvailable !== false;
    if (step === 3) return form.displayName.length >= 2;
    if (step === 4) return form.bio.length >= 10;
    if (step === 4.5) return form.vibe && form.vibe.length > 0;
    if (step === 4.6) return form.goalTitle && form.goalTitle.length > 3;
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

  const SETUP_STEPS = [2, 3, 4, 4.5, 4.6, 5, 6, 7];
  const isSetupStep = SETUP_STEPS.includes(step);
  const setupIndex = SETUP_STEPS.indexOf(step);
  const setupProgress = isSetupStep ? ((setupIndex + 1) / SETUP_STEPS.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10 overflow-x-hidden">
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient opacity-40" />
        <div className="dot-pattern" />
        <div className="absolute top-1/4 -left-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-primary/8 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="w-full max-w-md mx-auto">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Image src="/logo.png" alt="One Question" className="w-8 h-8 rounded-xl" width={32} height={32} />
          <span className="text-lg font-bold text-white">One Question</span>
        </div>

        {isSetupStep && (
          <div className="mb-6">
            <div className="w-full h-1.5 bg-white/10 rounded-full mb-3">
              <motion.div className="h-1.5 rounded-full bg-gradient-to-r bg-primary" animate={{ width: setupProgress + '%' }} transition={{ duration: 0.4 }} />
            </div>
            <div className="flex items-center justify-between px-1">
              <p className="text-xs text-muted-foreground">Setting up your space · {setupIndex + 1} of {SETUP_STEPS.length}</p>
              <div className="flex gap-1">
                {SETUP_STEPS.map((_, i) => (
                  <motion.div key={i} animate={{ width: i === setupIndex ? 20 : 6 }} className={'h-1.5 rounded-full ' + (i < setupIndex ? 'bg-primary' : i === setupIndex ? 'bg-gradient-to-r bg-primary' : 'bg-white/10')} />
                ))}
              </div>
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.25 }}>

            {step === 0 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">⏱️</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Quick question first</h2>
                  <p className="text-sm text-muted-foreground">We want to show you exactly how much time One Question saves you</p>
                </div>
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-zinc-300 font-medium">Questions you get per week</label>
                      <span className="text-primary font-bold text-sm">{questionsPerWeek}</span>
                    </div>
                    <input type="range" min="1" max="100" value={questionsPerWeek} onChange={e => setQuestionsPerWeek(Number(e.target.value))} className="w-full accent-amber-500" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1</span><span>50</span><span>100+</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-zinc-300 font-medium">Minutes to answer each one</label>
                      <span className="text-primary font-bold text-sm">{minutesPerAnswer} min</span>
                    </div>
                    <input type="range" min="1" max="30" value={minutesPerAnswer} onChange={e => setMinutesPerAnswer(Number(e.target.value))} className="w-full accent-amber-500" />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1"><span>1 min</span><span>15 min</span><span>30 min</span></div>
                  </div>
                  <motion.div className="rounded-2xl p-4 bg-primary/10 border border-primary/30 text-center" animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 0.3 }} key={hoursPerMonth}>
                    <p className="text-xs text-muted-foreground mb-1">You&apos;re spending</p>
                    <p className="text-3xl font-black text-white">{hoursPerMonth} hours</p>
                    <p className="text-xs text-muted-foreground">per month answering the same questions</p>
                  </motion.div>
                </div>
                <button onClick={() => setStep(1)} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2">
                  Show me what that costs me <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.5 }} className="text-5xl mb-4">😮</motion.div>
                  <h2 className="text-2xl font-bold text-white mb-2">Here&apos;s the real cost</h2>
                  <p className="text-sm text-muted-foreground">Based on your numbers</p>
                </div>
                <div className="space-y-3 mb-8">
                  {[
                    { icon: '📅', label: 'Hours lost per month', value: hoursPerMonth + ' hours', color: 'text-orange-400' },
                    { icon: '📆', label: 'Hours lost per year', value: hoursPerYear + ' hours', color: 'text-red-400' },
                    { icon: '🔁', label: 'Same questions answered again', value: 'Over and over', color: 'text-zinc-400' },
                    { icon: '🤖', label: 'With One Question AI', value: '0 hours', color: 'text-green-400' },
                  ].map((item, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-zinc-300">{item.label}</span>
                      </div>
                      <span className={"font-bold text-sm " + item.color}>{item.value}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="rounded-2xl p-4 bg-green-500/10 border border-green-500/30 mb-6 text-center">
                  <p className="text-sm text-green-400 font-medium">One Question gives you <span className="font-black">{hoursPerYear} hours back</span> every year</p>
                  <p className="text-xs text-muted-foreground mt-1">Your AI answers 24/7. You do other things.</p>
                </div>
                <button onClick={() => setStep(2)} className="w-full py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2">
                  Set up my space now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🔥</div>
                  <div>
                    <h2 className="text-xl font-bold text-white">Claim your space</h2>
                    <p className="text-sm text-muted-foreground">Pick your unique URL — once it&apos;s gone it&apos;s gone</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-all">
                    <span className="px-3 text-muted-foreground text-sm whitespace-nowrap">onequestion.space/</span>
                    <input type="text" value={form.username} onChange={e => { const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''); setForm(f => ({ ...f, username: val })); checkUsername(val); }} placeholder="yourname" className="flex-1 bg-transparent py-3 pr-10 text-white focus:outline-none text-sm" autoFocus />
                    <div className="pr-3">
                      {checking && <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                      {!checking && usernameAvailable === true && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check className="w-4 h-4 text-green-400" /></motion.div>}
                      {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                    </div>
                  </div>
                  <AnimatePresence>
                    {usernameAvailable === true && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-green-400">✓ onequestion.space/{form.username} is yours!</motion.p>}
                    {usernameAvailable === false && <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-red-400">That username is taken. Try another one.</motion.p>}
                  </AnimatePresence>
                </div>
                <button onClick={handleNext} disabled={!canNext() || saving} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Claim it</span><ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            )}

            {step === 3 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">👋</div>
                  <div><h2 className="text-xl font-bold text-white">What name should we use?</h2><p className="text-sm text-muted-foreground">Your public display name</p></div>
                </div>
                <input type="text" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all" autoFocus />
                <button onClick={handleNext} disabled={!canNext()} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 4 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">✨</div>
                  <div><h2 className="text-xl font-bold text-white">What makes you interesting?</h2><p className="text-sm text-muted-foreground">One line that makes people want to ask you something</p></div>
                </div>
                <textarea value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 160) }))} placeholder="e.g. Building AI products and sharing what I learn along the way." rows={4} className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all resize-none text-sm" autoFocus />
                <p className="text-xs text-muted-foreground text-right mt-1">{form.bio.length}/160</p>
                <button onClick={handleNext} disabled={!canNext()} className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 4.5 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🎯</div>
                  <div><h2 className="text-xl font-bold text-white">What are you building?</h2><p className="text-sm text-muted-foreground">Help visitors understand your vibe</p></div>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["🚀 AI","🛠️ SaaS","📝 Content","🎨 Design","💼 Freelance","🏗️ Indie Hacker","📚 Education","🎮 Gaming","🌱 Sustainability","🧠 Web3"].map(tag => (
                    <button key={tag} onClick={() => setForm(f => ({...f, vibe: f.vibe?.includes(tag) ? f.vibe.filter(t => t !== tag) : [...(f.vibe||[]), tag]}))}
                      className={"px-3 py-1.5 rounded-full text-xs font-medium transition-all border " + (form.vibe?.includes(tag) ? "bg-primary/20 border-primary/50 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white")}>{tag}</button>
                  ))}
                </div>
                <button onClick={handleNext} disabled={!canNext()} className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 4.6 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🏆</div>
                  <div><h2 className="text-xl font-bold text-white">What&apos;s your 2026 goal?</h2><p className="text-sm text-muted-foreground">Set a public goal to keep yourself accountable</p></div>
                </div>
                <div className="space-y-3">
                  <input type="text" value={form.goalTitle || ""} onChange={e => setForm(f => ({...f, goalTitle: e.target.value}))} placeholder="e.g. Reach 10K users" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary/50 transition-all" autoFocus />
                  <div>
                    <div className="flex justify-between text-sm text-zinc-400 mb-1"><span>Progress</span><span>{form.goalProgress || 0}%</span></div>
                    <input type="range" min="0" max="100" value={form.goalProgress || 0} onChange={e => setForm(f => ({...f, goalProgress: Number(e.target.value)}))} className="w-full accent-primary" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-zinc-500">Deadline</span>
                    <input type="date" value={form.goalDeadline || "2026-12-31"} onChange={e => setForm(f => ({...f, goalDeadline: e.target.value}))} />
                  </div>
                </div>
                <button onClick={handleNext} disabled={!canNext()} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 5 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🤖</div>
                  <div><h2 className="text-xl font-bold text-white">Set your AI greeting</h2><p className="text-sm text-muted-foreground">First thing visitors see on your space</p></div>
                </div>
                <input type="text" value={form.welcomeMessage} onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))} placeholder="Ask me anything about building in public!" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all" autoFocus />
                {form.welcomeMessage && (
                  <div className="mt-4 p-4 rounded-2xl bg-gradient-to-br from-primary/5 to-primary/3 border border-primary/20">
                    <p className="text-xs text-primary font-medium mb-2">✨ Your space preview</p>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center text-sm font-bold text-white" style={{ backgroundColor: form.themeColor }}>
                        {form.displayName?.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">{form.displayName || "Your Name"}</p>
                        <p className="text-xs text-zinc-400 italic">&quot;{form.welcomeMessage}&quot;</p>
                      </div>
                    </div>
                  </div>
                )}
                <button onClick={handleNext} disabled={!canNext()} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  Almost done <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 6 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🎨</div>
                  <div><h2 className="text-xl font-bold text-white">Pick your accent color</h2><p className="text-sm text-muted-foreground">This sets the vibe of your space</p></div>
                </div>
                <div className="flex flex-wrap gap-3 mb-6">
                  {['#a855f7','#3b82f6','#06b6d4','#22c55e','#f97316','#ec4899','#ef4444','#eab308','#ffffff'].map(c => (
                    <button key={c} onClick={() => setForm(f => ({ ...f, themeColor: c }))} className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative" style={{ backgroundColor: c, borderColor: form.themeColor === c ? c : 'transparent', boxShadow: form.themeColor === c ? '0 0 0 3px ' + c + '40' : 'none' }}>
                      {form.themeColor === c && <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow" />}
                    </button>
                  ))}
                  <label className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden relative">
                    <span className="text-xs text-muted-foreground">+</span>
                    <input type="color" value={form.themeColor} onChange={e => setForm(f => ({ ...f, themeColor: e.target.value }))} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                  </label>
                </div>
                <button onClick={handleNext} disabled={!canNext()} className="w-full mt-4 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {step === 7 && (
              <div className="glass rounded-3xl p-8 border border-white/10 text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", duration: 0.6 }} className="text-6xl mb-4">🚀</motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">Your space is ready!</h2>
                <p className="text-sm text-muted-foreground mb-6">onequestion.space/{form.username} is live</p>

                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Your vibe</p>
                    <p className="text-sm text-white font-medium">{form.vibe?.join(" ") || "✨ Personal"}</p>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-muted-foreground">Color</p>
                    <div className="w-6 h-6 rounded-full mt-1" style={{ backgroundColor: form.themeColor }} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  <button onClick={copyLink} className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy your space link"}
                  </button>
                  <button onClick={shareToX} className="w-full py-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-black/60 transition-all">
                    <Share2 className="w-4 h-4" /> Share on X
                  </button>
                </div>

                <button onClick={() => router.push("/dashboard/studio")} className="w-full py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2">
                  Go to dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
