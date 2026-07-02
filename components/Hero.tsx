'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ArrowRight, Sparkles, Zap, Check } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';

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

function FloatingOrb({ className, size, color, delay, duration }: { className?: string; size: number; color: string; delay: number; duration: number }) {
  return (
    <motion.div
      className={`absolute rounded-full ${className || ''}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle at 30% 30%, ${color}80, ${color}20, transparent)`,
        filter: 'blur(40px)',
      }}
      animate={{
        x: [0, 30, -20, 15, 0],
        y: [0, -25, 15, -10, 0],
        scale: [1, 1.1, 0.95, 1.05, 1],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
  );
}

export function Hero() {
  const { isSignedIn, isLoaded } = useAuth();
  const [username, setUsername] = useState('');
  const [pairIndex, setPairIndex] = useState(0);
  const [phase, setPhase] = useState<'typing-q' | 'show-q' | 'typing-a' | 'show-a'>('typing-q');
  const [displayed, setDisplayed] = useState('');

  const { scrollY } = useScroll();
  const heroRef = useRef<HTMLDivElement>(null);

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
    <section ref={heroRef} className='relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-20'>
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/5 via-transparent to-background pointer-events-none" />

      {/* Floating gradient orbs */}
      <FloatingOrb size={600} color="#f59e0b" delay={0} duration={25} className="top-[-10%] left-[-5%] opacity-40" />
      <FloatingOrb size={400} color="#ef4444" delay={2} duration={20} className="bottom-[10%] right-[-5%] opacity-30" />
      <FloatingOrb size={300} color="#facc15" delay={4} duration={18} className="top-[40%] right-[20%] opacity-20" />
      <FloatingOrb size={500} color="#f59e0b" delay={1} duration={22} className="top-[20%] left-[40%] opacity-10" />

      {/* Grid overlay */}
      <div className='absolute inset-0 opacity-[0.03]' style={{
        backgroundImage: 'linear-gradient(rgba(245,158,11,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(245,158,11,0.5) 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Grain */}
      <div className='absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-soft-light' style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='400' height='400' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'repeat',
        backgroundSize: '128px 128px',
      }} />

      <div className='relative z-10 max-w-6xl mx-auto px-4 w-full'>
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 items-center'>

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6'>
              <span className='relative flex h-2 w-2'>
                <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75' />
                <span className='relative inline-flex rounded-full h-2 w-2 bg-amber-500' />
              </span>
              Built from an Android phone · Nigeria
            </div>

            <h1 className='text-5xl md:text-7xl font-black text-white leading-[1.02] tracking-tight mb-6'>
              Your AI.<br />
              Your voice.<br />
              <span className='bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent animate-gradient'>Always on.</span>
            </h1>

            <p className='text-zinc-400 text-lg leading-relaxed mb-6 max-w-md'>
              Upload your knowledge once. Let AI answer every visitor question instantly — in your voice, 24/7.
            </p>

            {/* Social proof */}
            <div className='flex items-center gap-3 mb-8'>
              <div className='flex -space-x-2'>
                {(recentProfiles && recentProfiles.length > 0 ? recentProfiles : [{ initials: "A", avatar: undefined, username: "asym" }]).map((p, i) => (
                  <div key={i} className="relative w-8 h-8 rounded-full border-2 border-background overflow-hidden flex items-center justify-center text-[10px] font-bold text-white ring-2 ring-background" style={{ backgroundColor: ["#f59e0b","#ef4444","#3b82f6","#22c55e","#f97316"][i % 5], zIndex: 5 - i }}>
                    {p.avatar ? <Image src={p.avatar} alt="" width={32} height={32} className="w-full h-full object-cover" /> : p.initials}
                  </div>
                ))}
              </div>
              <div className='flex items-center gap-1.5'>
                <div className='flex'>
                  {[1,2,3,4,5].map(i => (
                    <svg key={i} className='w-3 h-3 text-amber-400' fill='currentColor' viewBox='0 0 20 20'>
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <span className='text-zinc-500 text-xs'><span className='text-white font-semibold'>{count}+</span> spaces live</span>
              </div>
            </div>

            {/* Input */}
            <div className='relative mb-4 max-w-sm'>
              <div className='flex items-center bg-zinc-900/80 border border-zinc-700/50 rounded-2xl px-4 py-3 focus-within:border-amber-500/60 transition-all shadow-lg shadow-amber-500/5 backdrop-blur-sm'>
                <span className='text-zinc-500 text-sm whitespace-nowrap shrink-0 font-mono'>onequestion.space/</span>
                <input
                  type='text'
                  value={username}
                  onChange={e => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                  onKeyDown={e => e.key === 'Enter' && handleClaim()}
                  placeholder='yourname'
                  className='flex-1 bg-transparent text-white ml-1 outline-none placeholder:text-zinc-600 text-sm'
                />
              </div>
            </div>

            {username && (
              <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                className='text-xs text-amber-400/80 mb-2 ml-1'>
                Your space → <span className='font-bold text-amber-400'>onequestion.space/{username}</span>
              </motion.p>
            )}
            {isLoaded && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleClaim}
                className='group relative w-full max-w-sm py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black text-sm flex items-center justify-center gap-2 transition-all hover:shadow-[0_0_30px_rgba(245,158,11,0.4)] overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity' />
                <span className='relative z-10 flex items-center gap-2'>
                  <Sparkles className='w-4 h-4' />
                  Claim your space free
                  <ArrowRight className='w-4 h-4 group-hover:translate-x-1 transition-transform' />
                </span>
              </motion.button>
            )}
            <div className='flex items-center gap-4 mt-4 text-zinc-600 text-xs'>
              <span className='flex items-center gap-1'><Check className='w-3 h-3 text-amber-500' /> Free forever</span>
              <span className='flex items-center gap-1'><Check className='w-3 h-3 text-amber-500' /> No credit card</span>
              <span className='flex items-center gap-1'><Check className='w-3 h-3 text-amber-500' /> 2 min setup</span>
            </div>
          </motion.div>

          {/* Right — live demo */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className='relative'
          >
            <div className='absolute -inset-6 bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-red-500/15 rounded-3xl blur-3xl opacity-60 animate-float-slow' />
            <div className='relative rounded-3xl border border-zinc-800/60 overflow-hidden bg-zinc-950/90 backdrop-blur-sm shadow-[0_0_60px_rgba(245,158,11,0.1)]'>
              <div className='px-4 py-3 border-b border-zinc-800/60 flex items-center gap-2 bg-zinc-900/50'>
                <div className='flex gap-1.5'>
                  <div className='w-3 h-3 rounded-full bg-red-500/70' />
                  <div className='w-3 h-3 rounded-full bg-amber-500/70' />
                  <div className='w-3 h-3 rounded-full bg-green-500/70' />
                </div>
                <span className='text-zinc-500 text-xs mx-auto font-mono'>onequestion.space/asym</span>
                <div className='flex items-center gap-1.5 text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/15'>
                  <span className='w-1 h-1 rounded-full bg-green-400 animate-pulse' />
                  Live
                </div>
              </div>

              <div className='px-5 py-4 border-b border-zinc-800/30 flex items-center gap-3'>
                <div className='w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-black font-black text-sm shadow-lg shadow-amber-500/20'>A</div>
                <div>
                  <p className='text-white text-sm font-bold'>Asym Alwali</p>
                  <p className='text-zinc-500 text-xs'>19yo · Building from Nigeria</p>
                </div>
              </div>

              {/* Chat area */}
              <div className='p-5 space-y-3 min-h-[260px] flex flex-col justify-end'>
                {(phase === 'show-q' || phase === 'typing-a' || phase === 'show-a') && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className='flex justify-end'>
                    <div className='max-w-[80%] px-4 py-2.5 rounded-2xl rounded-br-sm bg-zinc-800 border border-zinc-700/50'>
                      <p className='text-white text-sm'>{TYPING_PAIRS[pairIndex].q}</p>
                    </div>
                  </motion.div>
                )}
                <div className='flex justify-start gap-2.5'>
                  <div className='w-7 h-7 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shrink-0 mt-0.5 shadow-sm'>
                    <Sparkles className='w-3.5 h-3.5 text-black' />
                  </div>
                  <div className='max-w-[80%] px-4 py-2.5 rounded-2xl rounded-tl-sm bg-amber-500/10 border border-amber-500/20'>
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

              <div className='px-5 py-3 border-t border-zinc-800/50 flex items-center gap-3 bg-zinc-900/30'>
                {phase === 'typing-q' ? (
                  <div className='flex-1 text-sm text-white font-mono'>
                    {displayed}
                    <span className='inline-block w-0.5 h-4 bg-white/60 ml-0.5 animate-pulse' />
                  </div>
                ) : (
                  <div className='flex-1 text-sm text-zinc-600'>Ask anything...</div>
                )}
                <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm'>
                  <ArrowRight className='w-3.5 h-3.5 text-black' />
                </div>
              </div>
            </div>

            {/* Floating stat cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className='absolute -bottom-4 -left-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-2xl px-4 py-3 shadow-xl'
            >
              <p className='text-xs text-zinc-500'>Response time</p>
              <div className='flex items-center gap-1.5'>
                <Zap className='w-4 h-4 text-amber-400' />
                <p className='text-white font-black text-lg'>&lt;2s</p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className='absolute -top-4 -right-4 bg-zinc-900/90 backdrop-blur-xl border border-zinc-700/50 rounded-2xl px-4 py-3 shadow-xl'
            >
              <p className='text-xs text-zinc-500'>Built from</p>
              <p className='text-white font-black text-lg'>📱 Phone</p>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
