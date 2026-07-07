'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Link2 } from 'lucide-react';
import { FadeIn } from '@/components/motion/FadeIn';

const steps = [
  {
    number: '01',
    title: 'Upload Knowledge',
    desc: 'Upload PDFs, documents, links, notes, articles — anything you want your AI to know about you.',
    detail: 'The more you upload, the smarter it gets.',
    icon: Sparkles,
  },
  {
    number: '02',
    title: 'AI Learns',
    desc: 'Your AI processes everything you upload. It learns your voice, your expertise, your style.',
    detail: 'Vector embeddings for precise answers.',
    icon: Brain,
  },
  {
    number: '03',
    title: 'Visitors Ask',
    desc: 'Share your space link. Visitors arrive and ask anything about you, your work, your expertise.',
    detail: 'Works 24/7, any device, any timezone.',
    icon: Link2,
  },
  {
    number: '04',
    title: 'AI Answers Instantly',
    desc: 'Your AI responds in your voice — instantly, accurately, every time. You never repeat yourself.',
    detail: 'You never answer the same question twice again.',
    icon: Brain,
  },
];

export function HowItWorksSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(245,166,35,0.15), transparent)' }} />
      <div className="absolute inset-0 amber-radial-soft pointer-events-none" />

      <div className='relative max-w-4xl mx-auto px-4 sm:px-6'>
        <div className='text-center mb-14'>
          <FadeIn>
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[11px] font-bold mb-5'>
              How it works
            </div>
            <h2 className='text-3xl sm:text-4xl md:text-5xl font-black text-white leading-tight tracking-tight'>
              Up and running<br />
              <span className='gradient-text'>in under 5 minutes.</span>
            </h2>
          </FadeIn>
        </div>

        {/* Timeline */}
        <div className='relative'>
          {/* Vertical line */}
          <div className='hidden md:block absolute left-[31px] top-6 bottom-6 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent' />

          <div className='space-y-8'>
            {steps.map((step, i) => (
              <FadeIn key={i} delay={i * 0.1} y={20}>
                <div className='flex items-start gap-5'>
                  {/* Number */}
                  <div className='relative z-10 w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0'>
                    <div className='w-8 h-8 rounded-xl bg-primary flex items-center justify-center'>
                      <step.icon className='w-4 h-4 text-black' />
                    </div>
                  </div>

                  {/* Content */}
                  <div className='flex-1 pt-2'>
                    <div className='text-[10px] font-bold text-primary/50 font-mono tracking-widest mb-1'>{step.number}</div>
                    <h3 className='text-lg font-bold text-white mb-1'>{step.title}</h3>
                    <p className='text-zinc-400 text-sm leading-relaxed mb-2'>{step.desc}</p>
                    <p className='text-primary text-xs font-medium flex items-center gap-1'>
                      <span className='w-1 h-1 rounded-full bg-primary' />
                      {step.detail}
                    </p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>

        <FadeIn delay={0.3}>
          <div className='mt-10 p-5 rounded-2xl border border-primary/15 bg-gradient-to-r from-primary/[0.04] to-transparent flex items-center gap-4'>
            <div className='text-3xl shrink-0'>🇳🇬</div>
            <div>
              <p className='text-white font-bold text-sm mb-1'>Built under real constraints.</p>
              <p className='text-zinc-500 text-xs leading-relaxed'>One Question was built entirely from an Android phone using Termux — no laptop, no funding, no office. If we could build this under those constraints, your AI can handle your questions.</p>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
