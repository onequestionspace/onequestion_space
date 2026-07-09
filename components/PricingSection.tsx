'use client';
// framer-motion removed for mobile stability
import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { Check, Zap, Sparkles } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

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

  useEffect(() => {
    const t = setInterval(() => {
      setActive(a => (a + 1) % FAQS.length);
    }, 4000);
    return () => clearInterval(t);
  }, [inView]);

  return (
    <div className='mt-12'>
      <p className='text-zinc-500 text-xs uppercase tracking-widest mb-6 font-semibold'>Questions people actually ask</p>
      <div className='relative overflow-hidden rounded-2xl paper-card-static min-h-[140px]'>
          <div
            key={active}
            className='p-6'
          >
            <p className='text-white font-bold text-base mb-3'>{FAQS[active].q}</p>
            <p className='text-zinc-400 text-sm leading-relaxed'>{FAQS[active].a}</p>
          </div>
      </div>
      <div className='flex items-center justify-center gap-2 mt-4'>
        {FAQS.map((_, i) => (
          <button key={i} onClick={() => setActive(i)}
            className={`transition-all duration-300 rounded-full ${i === active ? 'w-6 h-2 bg-primary' : 'w-2 h-2 bg-white/15 hover:bg-white/30'}`} />
        ))}
      </div>
    </div>
  );
}

export function PricingSection() {
  const ref = useRef(null);
  const inView = true;

  return (
    <section className='relative py-24 overflow-hidden' ref={ref}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />

      <div className='relative max-w-3xl mx-auto px-4 sm:px-6'>
        <div className='text-center mb-14'>
          <FadeIn>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold mb-5'>
              <Sparkles className='w-3 h-3' />
              Pricing
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight mb-3'>
              Honest pricing.<br /><span className='gradient-text'>No BS.</span>
            </h2>
            <p className='text-zinc-400 text-sm sm:text-base'>Start free. Pay only when it is worth it to you.</p>
          </FadeIn>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
          <div
            className='paper-card p-7 flex flex-col'
          >
            <div className='mb-6'>
              <p className='text-zinc-400 text-sm font-medium mb-2'>Free</p>
              <div className='flex items-end gap-1 mb-3'>
                <span className='text-4xl font-black text-white'>$0</span>
                <span className='text-zinc-500 mb-1.5'>/month</span>
              </div>
              <p className='text-zinc-500 text-sm'>Perfect to get started. No credit card needed.</p>
            </div>
            <ul className='space-y-2.5 flex-1 mb-6'>
              {FREE_FEATURES.map(f => (
                <li key={f} className='flex items-center gap-3 text-sm text-zinc-300'>
                  <Check className='w-4 h-4 text-zinc-500 shrink-0' />{f}
                </li>
              ))}
            </ul>
            <Link href='/sign-up' className='w-full py-3 rounded-xl border border-white/15 text-white text-sm font-bold text-center hover:bg-white/[0.04] hover:border-white/30 transition-all block'>
              Get started free
            </Link>
          </div>

          <div
            className='relative paper-card p-7 flex flex-col border-primary/30 bg-gradient-to-b from-primary/[0.04] to-transparent'
          >
            <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
              <span className='px-4 py-1 rounded-full text-[10px] font-bold bg-primary text-black shadow-amber-glow'>MOST POPULAR</span>
            </div>
            <div className='mb-6'>
              <p className='text-primary text-sm font-medium mb-2'>Pro</p>
              <div className='flex items-end gap-1 mb-1'>
                <span className='text-4xl font-black text-white'>$9</span>
                <span className='text-zinc-500 mb-1.5'>/month</span>
              </div>
              <p className='text-zinc-500 text-sm'>500 AI answers. Everything unlocked.</p>
            </div>
            <ul className='space-y-2.5 flex-1 mb-5'>
              {PRO_FEATURES.map(f => (
                <li key={f} className='flex items-center gap-3 text-sm text-zinc-300'>
                  <Check className='w-4 h-4 text-primary shrink-0' />{f}
                </li>
              ))}
            </ul>
            <div
              className='mb-4 p-3 rounded-xl bg-primary/[0.06] border border-primary/20'
            >
              <p className='text-primary text-xs font-semibold mb-1'>🇳🇬 Checkout shows Nigerian Naira</p>
              <p className='text-zinc-500 text-xs leading-relaxed'>Your international card works perfectly — Visa, Mastercard, wherever you are. Paystack converts automatically. No hidden fees.</p>
              <p className='text-zinc-600 text-xs mt-1 italic'>Weird? Maybe. Honest? Always. — Asym</p>
            </div>
            <Link href='/sign-up' className='w-full py-3 rounded-xl bg-primary text-black text-sm font-bold text-center hover:bg-primary-light transition-all flex items-center justify-center gap-2 shadow-amber-glow'>
              <Zap className='w-4 h-4' /> Start with Pro
            </Link>
          </div>
        </div>

        <p className='text-center text-zinc-600 text-sm mt-6'>Need more? Buy credits anytime from your dashboard. No commitment.</p>

        <div
          className='mt-10 paper-card p-5'
        >
          <div className='flex items-start gap-4'>
            <img src='/founders/asym.png' alt='Asym' className='w-10 h-10 rounded-full shrink-0 object-cover shadow-sm' />
            <div>
              <p className='text-zinc-400 text-sm leading-relaxed'>
                I built this on an Android phone with no funding, no team, no laptop — just Termux and a lot of late nights in Yobe.
                The $9/month keeps the servers running and helps me keep building.
                If One Question saves you even one hour a month, it is worth it.
              </p>
              <p className='text-primary text-sm font-bold mt-3'>— Asym, 19 · Yobe, Nigeria 🇳🇬</p>
            </div>
          </div>
        </div>

        <FaqCards inView={inView} />
      </div>
    </section>
  );
}
