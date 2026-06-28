const fs = require('fs');
let c = fs.readFileSync('app/onboarding/page.tsx', 'utf8');

// Fix handleNext to show errors and fix step 3
c = c.replace(
  `  const handleNext = async () => {
    if (step === 2) {
      setSaving(true);
      try {
        await createProfile({ username: form.username });
        await updateProfile({ username: form.username });
        } catch (e) { console.error(e); }
      setSaving(false);
      setStep(3); return;
    }
    if (step === 3) { await updateProfile({ displayName: form.displayName }); setStep(4); return; }`,
  `  const handleNext = async () => {
    if (step === 2) {
      setSaving(true);
      try {
        await createProfile({ username: form.username });
        await updateProfile({ username: form.username });
        setStep(3);
      } catch (e) {
        console.error(e);
        alert('Could not claim username. Try a different one.');
      }
      setSaving(false);
      return;
    }
    if (step === 3) {
      setSaving(true);
      try {
        await updateProfile({ displayName: form.displayName });
        setStep(4);
      } catch (e) {
        console.error(e);
        alert('Could not save. Please try again.');
      }
      setSaving(false);
      return;
    }`
);

// Fix the counter — it shows wrong number, SETUP_STEPS starts at index 0 for step 2
// The display says "2 of 8" when on step 3 (displayName) which is correct
// But visually confusing — let's make it clearer
c = c.replace(
  `<p className="text-xs text-muted-foreground">Setting up your space · {setupIndex + 1} of {SETUP_STEPS.length}</p>`,
  `<p className="text-xs text-muted-foreground">Step {setupIndex + 1} of {SETUP_STEPS.length}</p>`
);

// Fix button on step 3 to show saving state
c = c.replace(
  `            {step === 3 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl"> 👋</div>
                  <div><h2 className="text-xl font-bold text-white">What do people call you?</h2><p className="text-sm text-muted-foreground">This shows on your space exactly as you write it.</p></div>
                </div>
                <input type="text" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all" autoFocus />                 <button onClick={handleNext} disabled={!canNext()} className="w-full mt-6 py-3.5 rounded-xl bg-gradient-to-r bg-primary text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}`,
  `            {step === 3 && (
              <div className="glass rounded-3xl p-8 border border-white/10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="text-3xl">👋</div>
                  <div><h2 className="text-xl font-bold text-white">What do people call you?</h2><p className="text-sm text-muted-foreground">This shows on your space exactly as you write it.</p></div>
                </div>
                <input type="text" value={form.displayName} onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 transition-all" autoFocus />
                <button onClick={handleNext} disabled={!canNext() || saving} className="w-full mt-6 py-3.5 rounded-xl bg-primary text-black font-black flex items-center justify-center gap-2 disabled:opacity-50">
                  {saving ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <>Continue <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            )}`
);

fs.writeFileSync('app/onboarding/page.tsx', c);
console.log('done');
