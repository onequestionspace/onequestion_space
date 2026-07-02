'use client';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Zap, Sparkles } from 'lucide-react';

const FREE_FEATURES = [
  '50 AI answers per month',
  'Custom space page',
  'Knowledge base upload',
  'Basic analytics',
  'Space customization',
];

const PRO_FEATURES = [
  '500 AI answers per month',
  'Everything in Free',
  'Advanced analytics',
  'Priority AI processing',
  'Remove One Question branding',
  'Buy extra credits anytime',
];

const FAQS = [
  { q: 'Is the free plan actually free?', a: 'Yes. No credit card, no trial period, no expiry. 50 AI answers a month forever. I hate fake free tiers.' },
  { q: 'What happens if I hit my limit?', a: 'Your space stays live — visitors just see a friendly message that answers are paused. You can buy extra credits or upgrade anytime.' },
  { q: 'Can I cancel Pro anytime?', a: 'Yes. One click. No emails asking why. No retention flow. Just cancel.' },
  { q: 'Why $9?', a: "Honest answer: it covers Gemini API costs, Convex, Vercel, and lets me keep building. It's not a number a VC told me — it's what makes sense." },
  { q: 'Why does a 19-year-old from Nigeria get to build this?', a: 'Honestly I ask myself that too sometimes. But the problem was real, the tools existed, and nobody else was building exactly this. So here we are.' },
];

function FaqCards({ inView }: { inView: boolean }) {
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setActive(a => (a + 1) % FAQS.length);
    }, 4000);
    return () => clearInterval(t);
  }, [inView]);

  const go = (i: number) => {
    setDir(i > active ? 1 : -1);
    setActive(i);
  };

  return (
    <div className='mt-12'>
      <p className='text-zinc-500 text-xs uppercase tracking-widest mb-6 font-semibold'>Questions people actually ask</p>
      <div className='relative overflow-hidden rounded-2xl chalk-card min-h-[160px] shadow-sm'>
        <AnimatePresence mode='wait' custom={dir}>
          <motion.div
            key={active}
            custom={dir}
            variants={{
              enter: (d: number) => ({ x: d * 60, opacity: 0 }),
              center: { x: 0, opacity: 1 },
              exit: (d: number) => ({ x: d * -60, opacity: 0 }),
            }}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className='p-6 absolute inset-0'
          >
            <p className='chalk-heading font-bold text-base mb-3'>{FAQS[active].q}</p>
            <p className='chalk-sub text-sm leading-relaxed'>{FAQS[active].a}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='flex items-center justify-center gap-2 mt-4'>
        {FAQS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={'transition-all duration-300 rounded-full ' + (i === active ? 'w-6 h-2 bg-amber-500' : 'w-2 h-2 bg-white/15 hover:bg-white/30')}
          />
        ))}
      </div>
    </div>
  );
}

export function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section className='relative py-28 overflow-hidden' ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent" />
      <div className='relative z-10 max-w-3xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6'>
              <Sparkles className='w-3 h-3' />
              Pricing
            </div>
            <h2 className='text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-4'>
              Honest pricing.<br /><span className='bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'>No BS.</span>
            </h2>
            <p className='text-zinc-400 text-lg leading-relaxed'>Start free. Pay only when it is worth it to you.</p>
          </motion.div>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className='p-8 rounded-3xl border border-white/10 bg-white/[0.03] flex flex-col hover:border-white/20 transition-all duration-300'
          >
            <div className='mb-8'>
              <p className='text-zinc-400 text-sm font-medium mb-2'>Free</p>
              <div className='flex items-end gap-1 mb-4'>
                <span className='text-5xl font-black text-white'>$0</span>
                <span className='text-zinc-500 mb-2'>/month</span>
              </div>
              <p className='text-zinc-500 text-sm'>Perfect to get started. No credit card needed.</p>
            </div>
            <ul className='space-y-3 flex-1 mb-8'>
              {FREE_FEATURES.map(f => (
                <li key={f} className='flex items-center gap-3 text-sm text-zinc-300'>
                  <Check className='w-4 h-4 text-zinc-500 shrink-0' />{f}
                </li>
              ))}
            </ul>
            <Link href='/sign-up' className='w-full py-3.5 rounded-2xl border border-white/15 text-white text-sm font-bold text-center hover:bg-white/5 hover:border-white/30 transition-all block'>
              Get started free
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className='relative p-8 rounded-3xl border border-amber-500/40 bg-gradient-to-b from-amber-500/10 to-transparent flex flex-col hover:border-amber-500/60 transition-all duration-300 animate-border-glow'
          >
            <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
              <span className='px-4 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-lg'>MOST POPULAR</span>
            </div>
            <div className='mb-8'>
              <p className='text-amber-500 text-sm font-medium mb-2'>Pro</p>
              <div className='flex items-end gap-1 mb-1'>
                <span className='text-5xl font-black text-white'>$9</span>
                <span className='text-zinc-500 mb-2'>/month</span>
              </div>
              <p className='text-zinc-500 text-sm'>500 AI answers. Everything unlocked.</p>
            </div>
            <ul className='space-y-3 flex-1 mb-6'>
              {PRO_FEATURES.map(f => (
                <li key={f} className='flex items-center gap-3 text-sm text-zinc-300'>
                  <Check className='w-4 h-4 text-amber-500 shrink-0' />{f}
                </li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.35 }}
              className='mb-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm'
            >
              <p className='text-amber-400 text-xs font-semibold mb-1'>🇳🇬 Checkout shows Nigerian Naira — here is why:</p>
              <p className='text-zinc-500 text-xs leading-relaxed'>I am based in Nigeria and Paystack is what keeps this running. Your international card works perfectly — Visa, Mastercard, wherever you are. Paystack converts automatically. No hidden fees.</p>
              <p className='text-zinc-600 text-xs mt-1 italic'>Weird? Maybe. Honest? Always. — Asym</p>
            </motion.div>
            <Link href='/sign-up' className='w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-black text-sm font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20'>
              <Zap className='w-4 h-4' /> Start with Pro →
            </Link>
          </motion.div>
        </div>

        <p className='text-center text-zinc-600 text-sm mt-8'>Need more? Buy credits anytime from your dashboard. No commitment.</p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className='mt-12 p-6 rounded-2xl chalk-card shadow-sm'
        >
          <div className='flex items-start gap-4'>
            <img src='/founders/asym.png' alt='Asym' className='w-10 h-10 rounded-full border border-black/5 shrink-0 object-cover shadow-sm' />
            <div>
              <p className='chalk-sub text-sm leading-loose'>
                I built this on an Android phone with no funding, no team, no laptop — just Termux and a lot of late nights in Yobe.
                The $9/month keeps the servers running and helps me keep building.
                If One Question saves you even one hour a month, it is worth it.
              </p>
              <p className='text-amber-600 text-sm font-bold mt-3'>— Asym, 19 · Yobe, Nigeria 🇳🇬</p>
            </div>
          </div>
        </motion.div>

        <FaqCards inView={inView} />
      </div>
    </section>
  );
}
