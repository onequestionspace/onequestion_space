'use client';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';

import Link from 'next/link';
import { Check, Zap } from 'lucide-react';

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
      <div className='relative overflow-hidden rounded-2xl border border-white/8 bg-white/2 min-h-[140px]'>
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
            className='p-6'
          >
            <p className='text-white font-bold text-base mb-3'>{FAQS[active].q}</p>
            <p className='text-zinc-400 text-sm leading-relaxed'>{FAQS[active].a}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className='flex items-center justify-center gap-2 mt-4'>
        {FAQS.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className={'transition-all duration-300 rounded-full ' + (i === active ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/15 hover:bg-white/30')}
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
    <section className='relative py-24 overflow-hidden' ref={ref}>

      <div className='relative z-10 max-w-3xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <p className='text-primary text-sm font-semibold uppercase tracking-widest mb-4'>Pricing</p>
          <h2 className='text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-4'>
            Honest pricing.<br /><span className='text-primary'>No BS.</span>
          </h2>
          <p className='text-zinc-400 text-lg leading-relaxed'>Start free. Pay only when it's worth it to you.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Free */}
          <motion.div initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.5, delay:0.1 }} className='p-8 rounded-3xl border border-white/10 bg-white/3 flex flex-col'>
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
                  <Check className='w-4 h-4 text-zinc-500 shrink-0' />
                  {f}
                </li>
              ))}
            </ul>
            <Link href='/sign-up' className='w-full py-3.5 rounded-2xl border border-white/15 text-white text-sm font-bold text-center hover:bg-white/5 transition-all block'>
              Get started free
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div initial={{ opacity:0, y:30 }} animate={inView?{opacity:1,y:0}:{}} transition={{ duration:0.5, delay:0.25 }} className='relative p-8 rounded-3xl border border-primary/40 bg-gradient-to-b from-primary/10 to-transparent flex flex-col'>
            <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
              <span className='px-4 py-1 rounded-full text-xs font-bold bg-primary text-black'>MOST POPULAR</span>
            </div>
            <div className='mb-8'>
              <p className='text-primary text-sm font-medium mb-2'>Pro</p>
              <div className='flex items-end gap-1 mb-1'>
                <span className='text-5xl font-black text-white'>$9</span>
                <span className='text-zinc-500 mb-2'>/month</span>
              </div>
              <p className='text-zinc-500 text-sm'>500 AI answers. Everything unlocked.</p>
            </div>
            <ul className='space-y-3 flex-1 mb-8'>
              {PRO_FEATURES.map(f => (
                <li key={f} className='flex items-center gap-3 text-sm text-zinc-300'>
                  <Check className='w-4 h-4 text-primary shrink-0' />
                  {f}
                </li>
              ))}
            </ul>
            <Link href='/sign-up' className='w-full py-3.5 rounded-2xl bg-primary text-black text-sm font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 block'>
              <Zap className='w-4 h-4' /> Start with Pro →
            </Link>
          </motion.div>
        </div>

        <p className='text-center text-zinc-600 text-sm mt-8'>Need more? Buy credits anytime from your dashboard. No commitment.</p>

        {/* Asym's personal note */}
        <motion.div initial={{opacity:0,y:20}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.6,delay:0.5}} className='mt-12 p-6 rounded-2xl border border-white/8 bg-white/3'>
          <p className='text-zinc-300 text-sm leading-loose'>
            I built this on an Android phone with no funding, no team, no laptop — just Termux and a lot of late nights in Yobe.
            The $9/month keeps the servers running and helps me keep building.
            If One Question saves you even one hour a month, it's worth it.
          </p>
          <div className='flex items-center gap-3 mt-4'><img src='/founders/asym.png' alt='Asym' className='w-10 h-10 rounded-full border border-white/10 object-cover shrink-0' /><p className='text-primary text-sm font-bold'>— Asym, 19 · Yobe, Nigeria 🇳🇬</p></div>
        </motion.div>

        {/* FAQ */}
        <div className='mt-12 space-y-6'>
          <h3 className='text-xl font-black text-white tracking-tight'>Questions people actually ask</h3>
          {[
            {
              q: 'Is the free plan actually free?',
              a: 'Yes. No credit card, no trial period, no expiry. 50 AI answers a month forever. I hate fake free tiers.'
            },
            {
              q: 'What happens if I hit my limit?',
              a: 'Your space stays live — visitors just see a friendly message that answers are paused. You can buy extra credits or upgrade anytime.'
            },
            {
              q: 'Can I cancel Pro anytime?',
              a: 'Yes. One click. No emails asking why. No retention flow. Just cancel.'
            },
            {
              q: 'Why $9?',
              a: "Honest answer: it covers Gemini API costs, Convex, Vercel, and lets me keep building. It's not a number a VC told me — it's what makes sense."
            },
          ].map((faq, i) => (
            <motion.div key={i} initial={{opacity:0,y:15}} animate={inView?{opacity:1,y:0}:{}} transition={{duration:0.4,delay:0.6+i*0.1}} className='border-b border-white/8 pb-6'>
              <p className='text-white font-bold text-sm mb-2'>{faq.q}</p>
              <p className='text-zinc-400 text-sm leading-relaxed'>{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}