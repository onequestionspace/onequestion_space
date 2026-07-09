'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
// framer-motion removed for mobile stability
import { ArrowRight, Check, Crown, Copy, Share2, Sparkles, Brain, MessageSquare } from 'lucide-react';

export default function OnboardingPage() {
  const { isSignedIn, isLoaded, user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
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
    themeColor: '#F5A623',
    vibe: [] as string[],
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
      setForm(prev => ({
        ...prev,
        displayName: user.fullName || user.firstName || '',
        username: user.username || user.emailAddresses?.[0]?.emailAddress?.split('@')[0]?.toLowerCase().replace(/[^a-z0-9_]/g, '') || '',
      }));
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
      setStep(3);
      return;
    }
    if (step === 3) {
      await updateProfile({ displayName: form.displayName }).catch(() => {});
      setStep(4);
      return;
    }
    if (step === 4) {
      await updateProfile({ bio: form.bio }).catch(() => {});
      setStep(5);
      return;
    }
    if (step === 5) {
      if (form.vibe && form.vibe.length > 0) {
        try {
          await fetch('/api/knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'My Focus Areas',
              content: 'I work in: ' + form.vibe.join(', ') + '. These are the areas I focus on and what visitors usually ask me about.',
            }),
          });
        } catch {}
      }
      if (form.goalTitle) {
        try {
          await fetch('/api/knowledge', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              title: 'My Current Goal',
              content: 'I am currently working toward: ' + form.goalTitle + '. Progress: ' + (form.goalProgress || 0) + '%. Target deadline: ' + (form.goalDeadline || '2026-12-31') + '.',
            }),
          });
        } catch {}
      }
      setStep(6);
      return;
    }
    if (step === 6) {
      await updateProfile({ welcomeMessage: form.welcomeMessage }).catch(() => {});
      setStep(7);
      return;
    }
    if (step === 7) {
      router.push('/dashboard/studio');
      return;
    }
    setStep(s => s + 1);
  };

  const canNext = () => {
    if (step === 2) return form.username.length >= 3 && usernameAvailable !== false;
    if (step === 3) return form.displayName.length >= 2;
    if (step === 4) return form.bio.length >= 10;
    if (step === 5) return true;
    if (step === 6) return form.welcomeMessage.length >= 5;
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

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-primary/20 animate-pulse flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary" />
          </div>
          <p className="text-zinc-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isSignedIn) { router.replace('/'); return null; }

  const SETUP_STEPS = [2, 3, 4, 5, 6, 7];
  const isSetupStep = SETUP_STEPS.includes(step);
  const setupIndex = SETUP_STEPS.indexOf(step);
  const setupProgress = isSetupStep ? ((setupIndex + 1) / SETUP_STEPS.length) * 100 : 0;

  const StepIndicator = () => (
    <div className="flex items-center gap-1.5 mb-6 justify-center">
      {SETUP_STEPS.map((_, i) => (
        <div key={i}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            i < setupIndex ? 'bg-primary' : i === setupIndex ? 'bg-primary' : 'bg-white/10'
          }`}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-10">
      <div className="fixed inset-0 pointer-events-none">
        <div className="amber-radial-soft" />
        <div className="faint-grid opacity-30" />
      </div>

      <div className="w-full max-w-md mx-auto relative z-10">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-black" />
          </div>
          <span className="text-lg font-bold text-white">One<span className="text-primary">Question</span></span>
        </div>

          <div>
            {/* Step 0: Welcome */}
            {step === 0 && (
              <div className="paper-card p-8 text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                  <Sparkles className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Upload your knowledge once.<br />Your AI answers forever.</h2>
                <p className="text-sm text-zinc-400 mb-8 leading-relaxed">
                  In the next few minutes, you will create your personal AI space. 
                  Your visitors ask questions. Your AI answers in your voice.
                </p>
                <button onClick={() => setStep(1)}
                  className="w-full py-3.5 rounded-xl bg-primary text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Get Started <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 1: Cost calculator */}
            {step === 1 && (
              <div className="paper-card p-8">
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">⏱️</div>
                  <h2 className="text-xl font-bold text-white mb-2">What is this costing you?</h2>
                  <p className="text-sm text-zinc-400">I used to answer the same questions every day. Let me show you what that costs.</p>
                </div>
                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-zinc-300 font-medium">Questions per week</label>
                      <span className="text-primary font-bold text-sm">{questionsPerWeek}</span>
                    </div>
                    <input type="range" min="1" max="100" value={questionsPerWeek} onChange={e => setQuestionsPerWeek(Number(e.target.value))} className="w-full accent-amber-500" />
                    <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>1</span><span>50</span><span>100+</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <label className="text-sm text-zinc-300 font-medium">Minutes per answer</label>
                      <span className="text-primary font-bold text-sm">{minutesPerAnswer} min</span>
                    </div>
                    <input type="range" min="1" max="30" value={minutesPerAnswer} onChange={e => setMinutesPerAnswer(Number(e.target.value))} className="w-full accent-amber-500" />
                    <div className="flex justify-between text-xs text-zinc-600 mt-1"><span>1 min</span><span>15 min</span><span>30 min</span></div>
                  </div>
                  <div className="rounded-2xl p-4 bg-primary/10 border border-primary/30 text-center">
                    <p className="text-xs text-zinc-400 mb-1">You are spending</p>
                    <p className="text-3xl font-black text-white">{hoursPerMonth} hours</p>
                    <p className="text-xs text-zinc-400">per month answering the same questions</p>
                  </div>
                </div>
                <button onClick={() => setStep(2)}
                  className="w-full mt-6 py-3.5 rounded-xl bg-primary text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Show me the real number <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Step 2: The realization */}
            {step === 2 && (
              <div className="paper-card p-8">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">😮</div>
                  <h2 className="text-xl font-bold text-white mb-2">This is what you are losing every year.</h2>
                  <p className="text-sm text-zinc-400">Based on what you just told me.</p>
                </div>
                <div className="space-y-3 mb-8">
                  {[
                    { icon: '📅', label: 'Hours lost per month', value: hoursPerMonth + 'h', color: 'text-orange-400' },
                    { icon: '📆', label: 'Hours lost per year', value: hoursPerYear + 'h', color: 'text-red-400' },
                    { icon: '🔁', label: 'Same questions repeated', value: 'Over and over', color: 'text-zinc-400' },
                    { icon: '🤖', label: 'With One Question AI', value: '0 hours', color: 'text-green-400' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-sm text-zinc-300">{item.label}</span>
                      </div>
                      <span className={"font-bold text-sm " + item.color}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl p-4 bg-green-500/10 border border-green-500/30 mb-6 text-center">
                  <p className="text-sm text-green-400 font-medium">One Question gives you <span className="font-black">{hoursPerYear} hours back</span> every year</p>
                  <p className="text-xs text-zinc-500 mt-1">Your AI answers 24/7. You do other things.</p>
                </div>
                <button onClick={() => setStep(3)}
                  className="w-full py-3.5 rounded-xl bg-primary text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Set up my space <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Setup Steps */}
            {step >= 3 && step <= 7 && (
              <div className="paper-card p-8">
                <StepIndicator />
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-lg shrink-0">
                    {step === 3 ? '👋' : step === 4 ? '✨' : step === 5 ? '🎯' : step === 6 ? '🤖' : '🎨'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">
                      {step === 3 ? 'Claim your space' :
                       step === 4 ? 'What do people ask you about?' :
                       step === 5 ? 'What are you building?' :
                       step === 6 ? 'What should your AI say first?' :
                       'Pick your accent color'}
                    </h2>
                    <p className="text-xs text-zinc-500">
                      {step === 3 ? 'This is your permanent link.' :
                       step === 4 ? 'Write it like you would say it out loud.' :
                       step === 5 ? 'Your AI will use this to give better answers.' :
                       step === 6 ? 'First thing visitors see on your space.' :
                       'Make it yours.'}
                    </p>
                  </div>
                </div>

                {/* Step 3: Username */}
                {step === 3 && (
                  <div className="space-y-3">
                    <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden focus-within:border-primary/50 transition-all">
                      <span className="px-3 text-zinc-500 text-sm whitespace-nowrap shrink-0">onequestion.space/</span>
                      <input
                        type="text"
                        value={form.username}
                        onChange={e => {
                          const val = e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '');
                          setForm(f => ({ ...f, username: val }));
                          checkUsername(val);
                        }}
                        placeholder="yourname"
                        className="flex-1 bg-transparent py-3 pr-2 text-white focus:outline-none text-sm"
                        autoFocus
                      />
                      <div className="pr-3 shrink-0">
                        {checking && <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />}
                        {!checking && usernameAvailable === true && <Check className="w-4 h-4 text-green-400" />}
                        {!checking && usernameAvailable === false && <span className="text-xs text-red-400">Taken</span>}
                      </div>
                    </div>
                      {usernameAvailable === true && (
                        <p className="text-xs text-green-400">
                          ✓ onequestion.space/{form.username} is yours!
                        </p>
                      )}
                      {usernameAvailable === false && (
                        <p className="text-xs text-red-400">
                          That username is taken. Try another one.
                        </p>
                      )}
                  </div>
                )}

                {/* Step 4: Bio */}
                {step === 4 && (
                  <div className="space-y-2">
                    <textarea
                      value={form.bio}
                      onChange={e => setForm(f => ({ ...f, bio: e.target.value.slice(0, 160) }))}
                      placeholder="e.g. Building AI products and sharing what I learn along the way."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all resize-none text-sm placeholder:text-zinc-600"
                      autoFocus
                    />
                    <p className="text-xs text-zinc-600 text-right">{form.bio.length}/160</p>
                  </div>
                )}

                {/* Step 5: Vibe + Goal */}
                {step === 5 && (
                  <div className="space-y-5">
                    <div>
                      <p className="text-sm text-zinc-300 mb-3">Pick what fits you.</p>
                      <div className="flex flex-wrap gap-2">
                        {["🚀 AI","🛠️ SaaS","📝 Content","🎨 Design","💼 Freelance","🏗️ Indie Hacker","📚 Education","🎮 Gaming","🌱 Sustainability","🧠 Web3"].map(tag => (
                          <button key={tag} onClick={() => setForm(f => ({...f, vibe: f.vibe?.includes(tag) ? f.vibe.filter(t => t !== tag) : [...(f.vibe||[]), tag]}))}
                            className={"px-3 py-1.5 rounded-full text-xs font-medium transition-all border " + (form.vibe?.includes(tag) ? "bg-primary/20 border-primary/50 text-white" : "bg-white/5 border-white/10 text-zinc-400 hover:text-white")}>{tag}</button>
                        ))}
                      </div>
                    </div>
                    <div className="h-px bg-white/[0.06]" />
                    <div>
                      <label className="text-sm text-zinc-300 font-medium block mb-2">What are you working toward? (optional)</label>
                      <input type="text" value={form.goalTitle} onChange={e => setForm(f => ({...f, goalTitle: e.target.value}))} placeholder="e.g. Reach 10K users" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-zinc-500 focus:outline-none focus:border-primary/50 transition-all" />
                    </div>
                  </div>
                )}

                {/* Step 6: Welcome Message */}
                {step === 6 && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={form.welcomeMessage}
                      onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
                      placeholder="Ask me anything about building in public!"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all placeholder:text-zinc-600"
                      autoFocus
                    />
                    {form.welcomeMessage && (
                      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                        <p className="text-xs text-primary font-medium mb-2">Preview</p>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-black shrink-0">
                            {form.displayName?.charAt(0) || "?"}
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">{form.displayName || "Your Name"}</p>
                            <p className="text-xs text-zinc-400 italic">"{form.welcomeMessage}"</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Step 7: Color */}
                {step === 7 && (
                  <div>
                    <p className="text-sm text-zinc-300 mb-4">This color shows up everywhere on your space.</p>
                    <div className="flex flex-wrap gap-3 mb-6">
                      {['#F5A623', '#3b82f6', '#06b6d4', '#22c55e', '#f97316', '#ec4899', '#ef4444', '#eab308', '#a855f7', '#ffffff'].map(c => (
                        <button key={c} onClick={() => setForm(f => ({ ...f, themeColor: c }))}
                          className="w-10 h-10 rounded-full border-2 transition-all hover:scale-110 relative"
                          style={{
                            backgroundColor: c,
                            borderColor: form.themeColor === c ? c : 'transparent',
                            boxShadow: form.themeColor === c ? `0 0 0 3px ${c}40` : 'none'
                          }}>
                          {form.themeColor === c && <Check className="w-4 h-4 absolute inset-0 m-auto text-black drop-shadow" />}
                        </button>
                      ))}
                      <label className="w-10 h-10 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden relative">
                        <span className="text-xs text-zinc-500">+</span>
                        <input type="color" value={form.themeColor} onChange={e => setForm(f => ({ ...f, themeColor: e.target.value }))} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      </label>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleNext}
                  disabled={!canNext() || saving}
                  className="w-full mt-6 py-3.5 rounded-xl bg-primary text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <>{step === 7 ? 'Complete Setup' : 'Continue'} <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <button
                  onClick={() => router.push("/dashboard")}
                  className="w-full mt-2 py-2 text-xs text-zinc-600 hover:text-zinc-400 transition-colors text-center"
                >
                  Skip for now →
                </button>
              </div>
            )}

            {/* Step 8: Celebrate */}
            {step === 8 && (
              <div className="paper-card p-8 text-center">
                <div className="text-6xl mb-4">🚀</div>
                <h2 className="text-2xl font-bold text-white mb-2">You are live!</h2>
                <p className="text-sm text-zinc-400 mb-6">
                  onequestion.space/{form.username} is live right now. Share this link — your AI handles everything from here.
                </p>

                <div className="flex items-center justify-center gap-3 mb-6">
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-zinc-500">Your vibe</p>
                    <p className="text-sm text-white font-medium">{form.vibe?.join(" ") || "✨ Personal"}</p>
                  </div>
                  <div className="px-4 py-3 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-xs text-zinc-500">Color</p>
                    <div className="w-6 h-6 rounded-full mt-1" style={{ backgroundColor: form.themeColor }} />
                  </div>
                </div>

                <div className="flex flex-col gap-3 mb-6">
                  <button onClick={copyLink}
                    className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition-all">
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied!" : "Copy your space link"}
                  </button>
                  <button onClick={shareToX}
                    className="w-full py-3 rounded-xl bg-black/40 border border-white/10 text-white font-medium flex items-center justify-center gap-2 hover:bg-black/60 transition-all">
                    <Share2 className="w-4 h-4" /> Share on X
                  </button>
                </div>

                <button onClick={() => router.push("/dashboard/studio")}
                  className="w-full py-3.5 rounded-xl bg-primary text-black font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all">
                  Take me to my dashboard <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

          </div>
      </div>
    </div>
  );
}
