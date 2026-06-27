'use client';

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

export function HowItWorksSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='relative z-10 max-w-4xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <p className='text-amber-400 text-sm font-bold uppercase tracking-widest mb-4'>How it works</p>
          <h2 className='text-4xl md:text-5xl font-black text-white leading-tight tracking-tight'>
            Up and running<br />
            <span className='bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent'>in under 5 minutes.</span>
          </h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {steps.map((step, i) => (
            <div key={i} className='relative p-8 rounded-3xl border border-zinc-800 bg-zinc-950 hover:border-amber-500/30 transition-all group'>
              <div className='text-4xl mb-4'>{step.icon}</div>
              <div className='text-xs font-black text-amber-500/50 font-mono mb-3 tracking-widest'>{step.number}</div>
              <h3 className='text-xl font-bold text-white mb-3'>{step.title}</h3>
              <p className='text-zinc-400 text-sm leading-relaxed mb-3'>{step.desc}</p>
              <p className='text-amber-400 text-xs font-bold'>{step.detail}</p>
            </div>
          ))}
        </div>

        {/* Constraint story */}
        <div className='mt-12 p-6 rounded-3xl border border-zinc-800 bg-zinc-950 flex items-center gap-4'>
          <div className='text-4xl shrink-0'>🇳🇬</div>
          <div>
            <p className='text-white font-bold text-sm mb-1'>Built under real constraints.</p>
            <p className='text-zinc-400 text-xs leading-relaxed'>One Question was built entirely from an Android phone using Termux — no laptop, no funding, no office. If we could build this under those constraints, your AI can handle your questions.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
