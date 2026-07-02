'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowRight, Sparkles } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

const DEMO_QUESTIONS = [
  'How can I work with Asym?',
  'What tools does Asym use to build?',
  'What is One Question?',
  'How do you build without a laptop?',
];

const TYPING_PAIRS = [
  { q: 'How can I work with Asym?', a: 'Book a call through my space and I will get back to you within 24 hours.' },
  { q: 'What tools does Asym use to build?', a: 'Next.js, Convex, Tailwind CSS, and Gemini AI — all from an Android phone.' },
  { q: 'What is One Question?', a: 'An AI-powered personal Q&A platform. Claim your space, upload your knowledge, let AI answer 24/7.' },
  { q: 'How do you build without a laptop?', a: 'Termux on Android. Constraints force better decisions and faster shipping.' },
];

export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();
  const [username, setUsername] = useState('');
  const [pairIndex, setPairIndex] = useState(0);
  const [phase, setPhase] = useState<'typing-q' | 'show-q' | 'typing-a' | 'show-a'>('typing-q');
  const [displayed, setDisplayed] = useState('');

  const { scrollY } = useScroll();
  const orb1Y = useTransform(scrollY, [0, 600], [0, -80]);
  const orb2Y = useTransform(scrollY, [0, 600], [0, 60]);
  const orbOpacity = useTransform(scrollY, [0, 400], [1, 0.6]);

  const recentProfiles = useQuery(api.profiles.getRecentProfiles, { limit: 5 });
  const profilesCount = useQuery(api.profiles.getProfilesCount);
  const count = profilesCount ?? 0;


  useEffect(() => {
    const question = DEMO_QUESTIONS[pairIndex];
    let timeout: ReturnType<typeof setTimeout>;
    let interval: ReturnType<typeof setInterval>;

    if (phase === 'typing-q') {
      let i = 0;
      setTimeout(() => setDisplayed(''), 0);
      interval = setInterval(() => {
        i++;
        setDisplayed(question.slice(0, i));
        if (i >= question.length) {
          clearInterval(interval);
          timeout = setTimeout(() => setPhase('show-q'), 400);
        }
      }, 35);
    } else if (phase === "show-q") {
      setTimeout(() => { setDisplayed(""); setPhase("typing-a"); }, 0);
      const answer = TYPING_PAIRS[pairIndex].a;
      let i = 0;
      interval = setInterval(() => {
        i++;
        setDisplayed(answer.slice(0, i));
        if (i >= answer.length) {
          clearInterval(interval);
          timeout = setTimeout(() => setPhase("show-a"), 2500);
        }
      }, 16);
    } else if (phase === 'show-a') {
      timeout = setTimeout(() => {
        setPairIndex(p => (p + 1) % DEMO_QUESTIONS.length);
        setPhase('typing-q');
      }, 500);
    }
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [phase, pairIndex]);

  const handleClaim = () => {
    const u = username.trim().toLowerCase();
    if (isSignedIn) {
      window.location.href = '/dashboard';
    } else {
      window.location.href = '/sign-up?username=' + u;
    }
  };

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16'>

      {/* Background — amber glow, no purple */}
      <motion.div className='absolute inset-0' style={{ y: orb1Y, opacity: orbOpacity, background: "radial-gradient(ellipse 70% 40% at 50% -10%,rgba(245,158,11,0.15),transparent)" }} />
      <motion.div className="absolute inset-0" style={{ y: orb2Y, opacity: orbOpacity, background: "radial-gradient(ellipse 60% 40% at 85% 30%, rgba(239,68,68,0.12), transparent 60%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 50% 40% at 10% 70%, rgba(250,204,21,0.10), transparent 60%)" }} />
      <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(245,158,11,0.04) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.25) 100%)" }} />
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.4), transparent)" }} />
      <div className='absolute inset-0' style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* Grain texture */}
      <div className='absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-soft-light' style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }} />
      <motion.div className='absolute top-1/3 left-1/4 w-96 h-96 rounded-full blur-[100px] opacity-40' style={{ y: orb1Y, background: 'radial-gradient(circle, rgba(245,158,11,0.5), transparent 70%)' }} />
      <motion.div className='absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full blur-[100px] opacity-30' style={{ y: orb2Y, background: 'radial-gradient(circle, rgba(239,68,68,0.5), transparent 70%)' }} />

      <div className='relative z-10 max-w-5xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

          {/* Left */}
          <div>
            {/* Built from phone badge */}
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6 animate-snap-in'>
              <span className='text-base'>📱</span>
              Built from an Android phone · Nigeria
            </div>

            <h1 className='text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6'>
              Your AI.<br />
              Your voice.<br />
              <span className='bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'>Always on.</span>
            </h1>

            <p className='text-zinc-400 text-lg leading-relaxed mb-3 max-w-md'>
              Upload your knowledge once. Let AI answer every visitor question instantly — in your voice, 24/7.
            </p>

            {/* Social proof pill */}
            <div className='flex items-center gap-2 mb-8'>
              <div className='flex -space-x-2'>
                {(recentProfiles && recentProfiles.length > 0 ? recentProfiles : [{ initials: "A", avatar: undefined, username: "asym" }]).map((p, i) => (
                  <div key={i} className="w-7 h-7 rounded-full border-2 border-background overflow-hidden flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: ["#f59e0b","#ef4444","#3b82f6","#22c55e","#f97316"][i % 5] }}>
                    {p.avatar ? <img src={p.avatar} alt="" className="w-full h-full object-cover" /> : p.initials}
                  </div>
                ))}
              </div>
              <p className='text-zinc-500 text-xs'><span className='text-white font-semibold'>{count}+</span> spaces live</p>
            </div>

            <div className='flex items-center bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 mb-4 focus-within:border-amber-500/50 transition-all max-w-sm'>
              <span className='text-zinc-500 text-sm whitespace-nowrap shrink-0'>onequestion.space/</span>
              <input
                type='text'
                value={username}
                onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                onKeyDown={e => e.key === 'Enter' && handleClaim()}
                placeholder='yourname'
                className='flex-1 bg-transparent text-white ml-1 outline-none placeholder:text-zinc-600 text-sm'
              />
            </div>

            {username && (
              <p className='text-xs text-primary/80 mb-2 ml-1'>
                Your space → <span className='font-bold text-primary'>onequestion.space/{username}</span>
              </p>
            )}
            {isLoaded && (
              <button
                onClick={handleClaim}
                className='group w-full max-w-sm py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-amber-500/20 hover:shadow-[0_0_24px_rgba(245,158,11,0.4)]'
              >
                Claim your space free
                <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
              </button>
            )}
            <p className='text-zinc-600 text-xs mt-3 max-w-sm'>Free forever · No credit card · 2 min setup</p>
          </div>

          {/* Right — live demo */}
          <div className='relative'>
            <div className='absolute -inset-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded-3xl blur-2xl' />
            <div className='relative rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-950 shadow-[0_0_30px_rgba(245,158,11,0.08)]'>

              {/* Terminal-style header bar */}
              <div className='px-4 py-3 border-b border-zinc-800 flex items-center gap-2 bg-zinc-900'>
                <div className='flex gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-red-500/70' />
                  <div className='w-3 h-3 rounded-full bg-amber-500/70' />
                  <div className='w-3 h-3 rounded-full bg-green-500/70' />
                </div>
                <span className='text-zinc-500 text-xs mx-auto font-mono'>onequestion.space/asym</span>
              </div>

              {/* Space header */}
              <div className='px-6 py-4 border-b border-zinc-800/50 flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-sm'>A</div>
                <div>
                  <p className='text-white text-sm font-bold'>Asym Alwali</p>
                  <p className='text-zinc-500 text-xs'>19yo · Building from Nigeria 🇳🇬</p>
                </div>
                <div className='ml-auto flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/15'>
                  <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
                  Live
                </div>
              </div>

              {/* Chat */}
              <div className='p-5 space-y-3 h-[260px] overflow-y-auto flex flex-col justify-end'>
                {(phase === 'show-q' || phase === 'typing-a' || phase === 'show-a') && (
                  <div className='flex justify-end'>
                    <div className='max-w-[75%] px-4 py-2.5 rounded-2xl bg-zinc-800 border border-zinc-700'>
                      <p className='text-white text-sm'>{TYPING_PAIRS[pairIndex].q}</p>
                    </div>
                  </div>
                )}
                <div className='flex justify-start gap-2.5'>
                  <div className='w-7 h-7 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0 mt-0.5'>
                    <Sparkles className='w-3.5 h-3.5 text-amber-400' />
                  </div>
                  <div className='max-w-[75%] px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/20'>
                    {(phase === 'typing-q' || phase === 'show-q') ? (
                      <div className='flex gap-1 py-1'>
                        {[0,1,2].map(i => <div key={i} className='w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce' style={{ animationDelay: i*150 + 'ms' }} />)}
                      </div>
                    ) : (
                      <p className='text-white text-sm leading-relaxed'>
                        {displayed}
                        {phase === 'typing-a' && <span className='inline-block w-0.5 h-4 bg-amber-400 ml-0.5 animate-pulse' />}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Input bar */}
              <div className='px-5 py-4 border-t border-zinc-800 flex items-center gap-3'>
                {phase === 'typing-q' ? (
                  <div className='flex-1 text-sm text-white font-mono'>
                    {displayed}
                    <span className='inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse' />
                  </div>
                ) : (
                  <div className='flex-1 text-sm text-zinc-600'>Ask anything...</div>
                )}
                <div className='w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center'>
                  <ArrowRight className='w-3.5 h-3.5 text-amber-400' />
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <div className='absolute -bottom-4 -left-4 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl animate-slide-up'>
              <p className='text-xs text-zinc-500'>Response time</p>
              <p className='text-white font-black text-lg'>&lt;2s</p>
            </div>
            <div className='absolute -top-4 -right-4 bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 shadow-xl animate-slide-up'>
              <p className='text-xs text-zinc-500'>Built from</p>
              <p className='text-white font-black text-lg'>📱 Phone</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
