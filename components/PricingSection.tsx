'use client';

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

export function PricingSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.08),transparent_70%)]' />
      <div className='relative z-10 max-w-3xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <p className='text-primary text-sm font-semibold uppercase tracking-widest mb-4'>Pricing</p>
          <h2 className='text-4xl md:text-5xl font-extrabold text-white leading-tight mb-4'>
            Simple pricing.<br /><span className='gradient-text'>No surprises.</span>
          </h2>
          <p className='text-zinc-400 text-lg'>Start free. Upgrade when your audience grows.</p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Free */}
          <div className='p-8 rounded-3xl border border-white/10 bg-white/3 flex flex-col'>
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
          </div>

          {/* Pro */}
          <div className='relative p-8 rounded-3xl border border-primary/40 bg-gradient-to-b from-primary/10 to-transparent flex flex-col'>
            <div className='absolute -top-3 left-1/2 -translate-x-1/2'>
              <span className='px-4 py-1 rounded-full text-xs font-bold bg-primary text-white'>MOST POPULAR</span>
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
            <Link href='/sign-up' className='w-full py-3.5 rounded-2xl bg-primary text-white text-sm font-bold text-center hover:opacity-90 transition-all flex items-center justify-center gap-2 block'>
              <Zap className='w-4 h-4' /> Start with Pro
            </Link>
          </div>
        </div>

        <p className='text-center text-zinc-600 text-sm mt-8'>Need more? Buy credits anytime from your dashboard. No commitment.</p>
      </div>
    </section>
  );
}