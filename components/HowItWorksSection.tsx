'use client';

const steps = [
  {
    number: '01',
    title: 'Claim your space',
    desc: 'Pick your username. Your personal AI page lives at onequestion.space/you — forever.',
    detail: 'Takes 30 seconds. No setup required.',
  },
  {
    number: '02',
    title: 'Train your AI',
    desc: 'Upload your bio, FAQs, projects, services, anything you want your AI to know about you.',
    detail: 'The more you upload, the smarter it gets.',
  },
  {
    number: '03',
    title: 'Share one link',
    desc: 'Send visitors to your space. They ask. Your AI answers instantly — in your voice, 24/7.',
    detail: 'You never answer the same question twice again.',
  },
];

export function HowItWorksSection() {
  return (
    <section className='relative py-24 overflow-hidden'>
      <div className='absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.06),transparent_70%)]' />
      <div className='relative z-10 max-w-4xl mx-auto px-4'>
        <div className='text-center mb-16'>
          <p className='text-primary text-sm font-semibold uppercase tracking-widest mb-4'>How it works</p>
          <h2 className='text-4xl md:text-5xl font-extrabold text-white leading-tight'>
            Up and running<br /><span className='gradient-text'>in under 5 minutes.</span>
          </h2>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {steps.map((step, i) => (
            <div key={i} className='relative p-8 rounded-3xl border border-white/8 bg-white/3 hover:border-primary/30 hover:bg-white/5 transition-all group'>
              <div className='text-5xl font-black text-white/5 group-hover:text-white/8 transition-colors mb-6 font-mono'>{step.number}</div>
              <h3 className='text-xl font-bold text-white mb-3'>{step.title}</h3>
              <p className='text-zinc-400 text-sm leading-relaxed mb-3'>{step.desc}</p>
              <p className='text-primary text-xs font-medium'>{step.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}