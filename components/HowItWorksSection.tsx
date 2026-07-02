'use client';

import { motion } from 'framer-motion';

const steps = [
  {
    number: '01',
    title: 'Claim your space',
    desc: 'Pick your username. Your personal AI page lives at onequestion.space/you — forever.',
    detail: 'Takes 30 seconds. No setup required.',
    icon: '⚡',
  },
  {
    number: '02',
    title: 'Train your AI',
    desc: 'Upload your bio, FAQs, projects, services — anything you want your AI to know about you.',
    detail: 'The more you upload, the smarter it gets.',
    icon: '🧠',
  },
  {
    number: '03',
    title: 'Share one link',
    desc: 'Send visitors to your space. They ask. Your AI answers instantly — in your voice, 24/7.',
    detail: 'You never answer the same question twice again.',
    icon: '🔗',
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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export function HowItWorksSection() {
  return (
    <section className='relative py-24 overflow-hidden chalk-section-cool'>
      <div className="absolute top-0 left-0 right-0 h-px section-divider" />
      <div className='relative z-10 max-w-4xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <p className='text-amber-600 text-sm font-bold uppercase tracking-widest mb-4'>How it works</p>
          <h2 className='text-4xl md:text-5xl font-black chalk-heading leading-tight tracking-tight'>
            Up and running<br />
            <span className='bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent'>in under 5 minutes.</span>
          </h2>
        </div>
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
              className='relative p-8 rounded-3xl border border-zinc-700 bg-[#0a0208] hover:border-amber-500/40 transition-all group shadow-xl shadow-black/20'
            >
              <div className='text-4xl mb-4'>{step.icon}</div>
              <div className='text-xs font-black text-amber-400/70 font-mono mb-3 tracking-widest'>{step.number}</div>
              <h3 className='text-xl font-bold text-white mb-3'>{step.title}</h3>
              <p className='text-zinc-400 text-sm leading-relaxed mb-3'>{step.desc}</p>
              <p className='text-amber-400 text-xs font-bold'>{step.detail}</p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className='mt-12 p-6 rounded-3xl border border-zinc-700 bg-[#0a0208] flex items-center gap-4 shadow-xl shadow-black/20'
        >
          <div className='text-4xl shrink-0'>🇳🇬</div>
          <div>
            <p className='text-white font-bold text-sm mb-1'>Built under real constraints.</p>
            <p className='text-zinc-400 text-xs leading-relaxed'>One Question was built entirely from an Android phone using Termux — no laptop, no funding, no office. If we could build this under those constraints, your AI can handle your questions.</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
