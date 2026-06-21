const fs = require('fs');

let onboarding = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// ── 1. Add themeColor to form state ─────────────────────────────────────────
onboarding = onboarding.replace(
  `const [form, setForm] = useState({ username: '', displayName: '', bio: '', welcomeMessage: '' });`,
  `const [form, setForm] = useState({ username: '', displayName: '', bio: '', welcomeMessage: '', themeColor: '#a855f7' });`
);

// ── 2. Update handleNext to handle new steps ─────────────────────────────────
onboarding = onboarding.replace(
  `    if (step === 5) { await updateProfile({ welcomeMessage: form.welcomeMessage }); setStep(6); return; }
    if (step === 7) { router.push('/dashboard'); return; }`,
  `    if (step === 5) { await updateProfile({ welcomeMessage: form.welcomeMessage }); setStep(6); return; }
    if (step === 6) { await updateProfile({ themeColor: form.themeColor }); setStep(7); return; }
    if (step === 7) { setStep(8); return; }
    if (step === 8) { setStep(9); return; }
    if (step === 9) { setStep(10); return; }
    if (step === 10) { router.push('/dashboard'); return; }`
);

// ── 3. Update SETUP_STEPS to include new steps ───────────────────────────────
onboarding = onboarding.replace(
  `const SETUP_STEPS = [2, 3, 4, 5];`,
  `const SETUP_STEPS = [2, 3, 4, 5, 6];`
);

// ── 4. Replace step 6 (pricing) with theme picker ───────────────────────────
onboarding = onboarding.replace(
  `            {step === 6 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-5xl mb-3">🚀</motion.div>
                  <h2 className="text-2xl font-bold text-white mb-1">Your space is ready</h2>
                  <p className="text-sm text-muted-foreground">One last thing — choose how you want to use it</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white">Free</span>
                      <span className="text-xs text-muted-foreground">What you have now</span>
                    </div>
                    <div className="space-y-1.5">
                      {['50 AI answers/month', '1 knowledge upload', 'Basic analytics'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-zinc-400"><Check className="w-3.5 h-3.5 text-zinc-500" />{f}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 border border-primary/40 bg-primary/10 relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-pink text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" /> PRO
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white">Pro</span>
                      <span className="text-primary font-bold text-sm">$9/month</span>
                    </div>
                    <div className="space-y-1.5">
                      {['Unlimited AI answers', 'Unlimited knowledge uploads', 'Full analytics + insights', 'Custom theme & colors', 'Priority AI responses'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-white"><Check className="w-3.5 h-3.5 text-primary" />{f}</div>
                      ))}
                    </div>
                    <button onClick={() => router.push('/dashboard/billing')} className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold text-sm flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" /> Upgrade to Pro
                    </button>
                  </div>
                </div>
                <button onClick={() => setStep(7)} className="w-full py-3 rounded-xl border border-white/10 text-zinc-400 text-sm hover:bg-white/5 transition-all">
                  Start with free for now
                </button>
              </div>
            )}`,
  `            {step === 6 && (
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
                <div className="rounded-2xl p-4 border border-white/10 mb-6 flex items-center gap-3" style={{ backgroundColor: form.themeColor + '15', borderColor: form.themeColor + '30' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: form.themeColor + '25' }}>
                    <Sparkles className="w-4 h-4" style={{ color: form.themeColor }} />
                  </div>
                  <p className="text-sm text-white/80">Preview — your space will use this color</p>
                </div>
                <button onClick={handleNext} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold flex items-center justify-center gap-2">
                  Looks good <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}`
);

// ── 5. Replace step 7 (share) with train AI ──────────────────────────────────
onboarding = onboarding.replace(
  `            {step === 7 && (
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }} className="text-7xl mb-6"> 🎉</motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">You&apos;re live!</h1>
                <p className="text-muted-foreground mb-8">Share your space. Let your AI do the work.</p>
                <div className="glass rounded-2xl p-5 border border-primary/30 mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Your space</p>
                  <p className="text-primary font-bold text-lg mb-4">onequestion.space/{form.username}</p>
                  <div className="flex gap-2">
                    <button onClick={copyLink} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold flex items-center justify-center gap-2">
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </button>
                    <button onClick={shareToX} className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                      <Share2 className="w-4 h-4" /> Share on X
                    </button>
                  </div>
                </div>
                <button onClick={() => router.push('/dashboard')} className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition-all">
                  Go to dashboard →
                </button>
              </div>
            )}`,
  `            {step === 7 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">🧠</div>
                  <div><h2 className="text-xl font-bold text-white">Train your AI</h2><p className="text-sm text-muted-foreground">Your AI needs to know about you to answer questions</p></div>
                </div>
                <div className="space-y-3 mb-6">
                  {['Who you are and what you do', 'Your projects and services', 'FAQs people ask you', 'How to contact or work with you'].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                      <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ backgroundColor: form.themeColor + '25', color: form.themeColor }}>{i + 1}</div>
                      <p className="text-sm text-white/80">{item}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/dashboard/train')} className="w-full py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 mb-3" style={{ backgroundColor: form.themeColor }}>
                  <Sparkles className="w-4 h-4" /> Train my AI now
                </button>
                <button onClick={handleNext} className="w-full py-2.5 rounded-xl border border-white/10 text-zinc-400 text-sm hover:bg-white/5 transition-all">
                  Skip for now
                </button>
              </div>
            )}

            {step === 8 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">👥</div>
                  <div><h2 className="text-xl font-bold text-white">Join the community</h2><p className="text-sm text-muted-foreground">Builders helping builders. You belong here.</p></div>
                </div>
                <div className="rounded-2xl p-5 border border-indigo-500/30 bg-indigo-500/10 mb-6">
                  <p className="text-white font-semibold mb-1">One Question Discord</p>
                  <p className="text-sm text-muted-foreground mb-4">Get help, share your space, watch the product get built in real time, give feedback directly to the founders.</p>
                  <a href="https://discord.gg/JuQJQRTDYP" target="_blank" rel="noopener noreferrer" className="w-full py-3 rounded-xl bg-indigo-500 text-white font-bold text-sm flex items-center justify-center gap-2">
                    Join Discord
                  </a>
                </div>
                <button onClick={handleNext} className="w-full py-2.5 rounded-xl border border-white/10 text-zinc-400 text-sm hover:bg-white/5 transition-all">
                  Continue
                </button>
              </div>
            )}

            {step === 9 && (
              <div className="text-center">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', duration: 0.6 }} className="text-7xl mb-6">🎉</motion.div>
                <h1 className="text-3xl font-bold text-white mb-2">You&apos;re live!</h1>
                <p className="text-muted-foreground mb-8">Share your space. Let your AI do the work.</p>
                <div className="glass rounded-2xl p-5 border border-white/10 mb-4" style={{ borderColor: form.themeColor + '30' }}>
                  <p className="text-xs text-muted-foreground mb-2">Your space</p>
                  <p className="font-bold text-lg mb-4" style={{ color: form.themeColor }}>onequestion.space/{form.username}</p>
                  <div className="flex gap-2">
                    <button onClick={copyLink} className="flex-1 py-3 rounded-xl text-white font-bold flex items-center justify-center gap-2" style={{ backgroundColor: form.themeColor }}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copied!' : 'Copy link'}
                    </button>
                    <button onClick={shareToX} className="flex-1 py-3 rounded-xl border border-white/10 text-white font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                      <Share2 className="w-4 h-4" /> Share on X
                    </button>
                  </div>
                </div>
                <button onClick={handleNext} className="w-full py-3 rounded-xl border border-white/10 text-white text-sm hover:bg-white/5 transition-all">
                  Continue →
                </button>
              </div>
            )}

            {step === 10 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="text-center mb-6">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring' }} className="text-5xl mb-3">🚀</motion.div>
                  <h2 className="text-2xl font-bold text-white mb-1">One last thing</h2>
                  <p className="text-sm text-muted-foreground">Choose your plan</p>
                </div>
                <div className="space-y-3 mb-6">
                  <div className="rounded-2xl p-4 border border-white/10 bg-white/5">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white">Free</span>
                      <span className="text-xs text-muted-foreground">What you have now</span>
                    </div>
                    <div className="space-y-1.5">
                      {['50 AI answers/month', '1 knowledge upload', 'Basic analytics'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-zinc-400"><Check className="w-3.5 h-3.5 text-zinc-500" />{f}</div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl p-4 border border-primary/40 bg-primary/10 relative overflow-hidden">
                    <div className="absolute top-3 right-3 bg-gradient-to-r from-primary to-pink text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Crown className="w-3 h-3" /> PRO
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-white">Pro</span>
                      <span className="text-primary font-bold text-sm">$9/month</span>
                    </div>
                    <div className="space-y-1.5">
                      {['Unlimited AI answers', 'Unlimited knowledge uploads', 'Full analytics + insights', 'Custom theme & colors', 'Priority AI responses'].map(f => (
                        <div key={f} className="flex items-center gap-2 text-sm text-white"><Check className="w-3.5 h-3.5 text-primary" />{f}</div>
                      ))}
                    </div>
                    <button onClick={() => router.push('/dashboard/billing')} className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-primary to-pink text-white font-bold text-sm flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4" /> Upgrade to Pro
                    </button>
                  </div>
                </div>
                <button onClick={() => router.push('/dashboard')} className="w-full py-3 rounded-xl border border-white/10 text-zinc-400 text-sm hover:bg-white/5 transition-all">
                  Start with free for now
                </button>
              </div>
            )}`
);

fs.writeFileSync('app/onboarding/page.tsx', onboarding);
console.log('✓ Onboarding updated with theme, train AI, Discord, share, pricing steps');
