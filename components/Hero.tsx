'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowRight, Sparkles } from 'lucide-react';

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

  const waitlistData = useQuery(api.waitlist.getWaitlistCount);
  const count = (waitlistData?.count ?? 0) + 247;


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
    } else if (phase === 'show-q') {
      setTimeout(() => { setDisplayed(''); setPhase('typing-a'); }, 0);
      fetch('/api/explore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, history: [] }),
      })
        .then(r => r.json())
        .then(data => {
          const answer = data.answer || 'Let me think about that...';
          let i = 0;
          interval = setInterval(() => {
            i++;
            setDisplayed(answer.slice(0, i));
            if (i >= answer.length) {
              clearInterval(interval);
              timeout = setTimeout(() => setPhase('show-a'), 2500);
            }
          }, 16);
        })
        .catch(() => {
          setDisplayed('One Question lets your AI answer this automatically.');
          timeout = setTimeout(() => setPhase('show-a'), 2000);
        });
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
    window.location.href = isSignedIn ? '/dashboard?username=' + u : '/sign-up?username=' + u;
  };

  return (
    <section className='relative min-h-screen flex items-center justify-center overflow-hidden pt-20 pb-16'>

      {/* Background — amber glow, no purple */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_70%_40%_at_50%_-10%,rgba(245,158,11,0.15),transparent)]' />
      <div className='absolute inset-0' style={{
        backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)',
        backgroundSize: '32px 32px',
      }} />
      {/* Grain texture */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none' style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }} />
      <div className='absolute top-1/3 left-1/4 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl' />
      <div className='absolute bottom-1/3 right-1/4 w-56 h-56 bg-orange-500/8 rounded-full blur-3xl' />

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
                {['A','P','K','M','T'].map((l, i) => (
                  <div key={i} className='w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white' style={{ backgroundColor: ['#f59e0b','#ef4444','#3b82f6','#22c55e','#f97316'][i] }}>
                    {l}
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
                className='group w-full max-w-sm py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black text-sm flex items-center justify-center gap-2 transition-all hover:-translate-y-0.5 active:translate-y-0 shadow-lg shadow-amber-500/20'
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
            <div className='relative rounded-3xl border border-zinc-800 overflow-hidden bg-zinc-950'>

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
              <div className='p-5 space-y-3 min-h-[200px] max-h-[260px] overflow-y-auto flex flex-col justify-end'>
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
