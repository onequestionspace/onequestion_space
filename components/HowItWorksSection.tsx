'use client';

import { motion } from 'framer-motion';
import { Sparkles, Brain, Link2 } from 'lucide-react';

const steps = [
  {
    number: '01',
    title: 'Claim your space',
    desc: 'Pick your username. Your personal AI page lives at onequestion.space/you — forever.',
    detail: 'Takes 30 seconds. No setup required.',
    icon: Sparkles,
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    number: '02',
    title: 'Train your AI',
    desc: 'Upload your bio, FAQs, projects, services — anything you want your AI to know about you.',
    detail: 'The more you upload, the smarter it gets.',
    icon: Brain,
    gradient: 'from-orange-500 to-red-500',
  },
  {
    number: '03',
    title: 'Share one link',
    desc: 'Send visitors to your space. They ask. Your AI answers instantly — in your voice, 24/7.',
    detail: 'You never answer the same question twice again.',
    icon: Link2,
    gradient: 'from-red-500 to-amber-500',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HowItWorksSection() {
  return (
    <section className='relative py-28 overflow-hidden'>
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-amber-500/3 to-transparent" />
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(245,158,11,0.06), transparent 70%)' }} />

      <div className='relative z-10 max-w-4xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className='inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold mb-6'>
              How it works
            </div>
            <h2 className='text-4xl md:text-6xl font-black text-white leading-tight tracking-tight'>
              Up and running<br />
              <span className='bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent'>in under 5 minutes.</span>
            </h2>
          </motion.div>
        </div>

        <div className='relative'>
          <div className='hidden md:block absolute top-24 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-0.5 bg-gradient-to-r from-amber-500/0 via-amber-500/40 to-amber-500/0' />

          <motion.div
            className='grid grid-cols-1 md:grid-cols-3 gap-6'
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            {steps.map((step, i) => (
              <motion.div
                key={i}
                variants={cardVariants}
                className='relative p-8 rounded-3xl border border-white/[0.06] bg-white/[0.02] hover:border-amber-500/30 transition-all group overflow-hidden'
              >
                <div className='absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity' />
                <div className='absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700'
                  style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.4), transparent 70%)' }} />

                <div className='relative z-10'>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                    <step.icon className='w-6 h-6 text-black' />
                  </div>
                  <div className='text-xs font-black text-amber-500/60 font-mono mb-3 tracking-widest'>{step.number}</div>
                  <h3 className='text-xl font-bold text-white mb-3'>{step.title}</h3>
                  <p className='text-zinc-400 text-sm leading-relaxed mb-4'>{step.desc}</p>
                  <p className='text-amber-400 text-xs font-bold flex items-center gap-1'>
                    <span className='w-1 h-1 rounded-full bg-amber-400' />
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
          className='mt-12 p-6 rounded-3xl border border-amber-500/20 bg-gradient-to-r from-amber-500/5 to-transparent flex items-center gap-4 backdrop-blur-sm'
        >
          <div className='text-4xl shrink-0'>🇳🇬</div>
          <div>
            <p className='text-white font-bold text-sm mb-1'>Built under real constraints.</p>
            <p className='text-zinc-500 text-xs leading-relaxed'>One Question was built entirely from an Android phone using Termux — no laptop, no funding, no office. If we could build this under those constraints, your AI can handle your questions.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
