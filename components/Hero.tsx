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
      setDisplayed('');
      setPhase('typing-a');
      // Fetch real answer from Knowledge Explorer
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
      {/* Background */}
      <div className='absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(147,51,234,0.25),transparent)]' />
      <div className='absolute inset-0 dot-pattern opacity-30' />
      <div className='absolute top-1/3 left-1/4 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl' />
      <div className='absolute top-1/3 right-1/4 w-64 h-64 bg-fuchsia-500/10 rounded-full blur-3xl' />

      <div className='relative z-10 max-w-5xl mx-auto px-4'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

          {/* Left — copy */}
          <div>
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-8'>
              <span className='w-1.5 h-1.5 rounded-full bg-primary animate-pulse' />
              {count}+ spaces live
            </div>
            <h1 className='text-5xl md:text-6xl font-black text-white leading-[1.05] tracking-tight mb-6'>
              Your AI.<br />
              Your answers.<br />
              <span className='bg-gradient-to-r from-purple-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent'>Always on.</span>
            </h1>
            <p className='text-zinc-400 text-lg leading-relaxed mb-8 max-w-md'>
              Upload your knowledge once. Let AI answer every visitor question instantly — in your voice, 24/7.
            </p>
            <div className='flex items-center bg-white/5 border border-white/10 rounded-2xl px-4 py-3 mb-4 focus-within:border-primary/50 transition-all max-w-sm'>
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
            {isLoaded && (
              <button
                onClick={handleClaim}
                className='w-full max-w-sm py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:opacity-90 hover:-translate-y-0.5 transition-all shadow-lg shadow-purple-500/20'
              >
                Claim your space <ArrowRight className='w-4 h-4' />
              </button>
            )}
            <p className='text-zinc-600 text-xs mt-3 max-w-sm'>Free forever. No credit card required.</p>
          </div>

          {/* Right — live demo card */}
          <div className='relative'>
            <div className='absolute -inset-4 bg-gradient-to-r from-purple-600/20 to-fuchsia-600/20 rounded-3xl blur-2xl' />
            <div className='relative rounded-3xl border border-white/10 overflow-hidden' style={{ background: 'rgba(15,15,15,0.9)', backdropFilter: 'blur(20px)' }}>
              {/* Space header */}
              <div className='px-6 py-5 border-b border-white/8 flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm'>A</div>
                <div>
                  <p className='text-white text-sm font-semibold'>Asym Alwali</p>
                  <p className='text-zinc-500 text-xs'>onequestion.space/asym</p>
                </div>
                <div className='ml-auto flex flex-col items-end gap-1'>
              <div className='flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/15'>
                  <span className='w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse' />
                  AI Active
                </div>
              <span className='text-zinc-600 text-[10px]'>Knowledge Explorer</span>
              </div>
              </div>
              {/* Chat */}
              <div className='p-5 space-y-3 min-h-[200px] flex flex-col justify-end'>
                {(phase === 'show-q' || phase === 'typing-a' || phase === 'show-a') && (
                  <div className='flex justify-end'>
                    <div className='max-w-[75%] px-4 py-2.5 rounded-2xl bg-white/8 border border-white/8'>
                      <p className='text-white text-sm'>{TYPING_PAIRS[pairIndex].q}</p>
                    </div>
                  </div>
                )}
                <div className='flex justify-start gap-2.5'>
                  <div className='w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5'>
                    <Sparkles className='w-3.5 h-3.5 text-primary' />
                  </div>
                  <div className='max-w-[75%] px-4 py-2.5 rounded-2xl bg-primary/10 border border-primary/20'>
                    {(phase === 'typing-q' || phase === 'show-q') ? (
                      <div className='flex gap-1 py-1'>
                        {[0,1,2].map(i => <div key={i} className='w-1.5 h-1.5 rounded-full bg-primary animate-bounce' style={{ animationDelay: i*150 + 'ms' }} />)}
                      </div>
                    ) : (
                      <p className='text-white text-sm leading-relaxed'>
                        {displayed}
                        {phase === 'typing-a' && <span className='inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse' />}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {/* Input bar */}
              <div className='px-5 py-4 border-t border-white/8 flex items-center gap-3'>
                {phase === 'typing-q' ? (
                  <div className='flex-1 text-sm text-white'>
                    {displayed}
                    <span className='inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse' />
                  </div>
                ) : (
                  <div className='flex-1 text-sm text-zinc-600'>Ask a question...</div>
                )}
                <div className='w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center'>
                  <ArrowRight className='w-3.5 h-3.5 text-primary' />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}