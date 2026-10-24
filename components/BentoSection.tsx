'use client';

import { BarChart3, Brain, Globe2, Palette, ShieldCheck, Zap } from 'lucide-react';

const features = [
  { icon: Brain, eyebrow: '01 / Knowledge', title: 'Your work, in context.', text: 'Give your page the notes, links, and answers that make your perspective yours.', className: 'md:col-span-2', accent: 'purple' },
  { icon: BarChart3, eyebrow: '02 / Signals', title: 'See what people need.', text: 'Simple analytics show the questions, visitors, and ideas worth answering next.', className: '', accent: 'yellow' },
  { icon: Palette, eyebrow: '03 / Expression', title: 'Make it feel like you.', text: 'Choose your colors, links, and tone without losing the calm of a great page.', className: '', accent: 'pink' },
  { icon: Zap, eyebrow: '04 / Speed', title: 'Answers, without the loop.', text: 'One clear link replaces the same explanation repeated across DMs and email.', className: '', accent: 'red' },
  { icon: ShieldCheck, eyebrow: '05 / Control', title: 'Choose what to share.', text: 'Only add information you are comfortable publishing, avoid sensitive data, and keep your sources current.', className: '', accent: 'purple' },
  { icon: Globe2, eyebrow: '06 / Anywhere', title: 'One link. Every channel.', text: 'Put your OneQuestion in your bio, portfolio, newsletter, or email signature.', className: 'md:col-span-2', accent: 'yellow' },
];

const accentClasses = {
  purple: 'text-violet-700 bg-violet-50 border-violet-200',
  pink: 'text-pink-700 bg-pink-50 border-pink-200',
  red: 'text-red-700 bg-red-50 border-red-200',
  yellow: 'text-amber-700 bg-amber-50 border-amber-200',
};

export function BentoSection() {
  return (
    <section className="relative border-t border-zinc-200 bg-white px-4 py-20 text-black sm:py-28" aria-labelledby="features-heading">
      <div className="nest-lines pointer-events-none absolute inset-x-0 top-0 h-72 opacity-30" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl">
        <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">The useful middle</p>
            <h2 id="features-heading" className="mt-4 text-4xl font-semibold leading-[0.98] tracking-[-0.05em] sm:text-5xl">More than a link.<br /><span className="text-zinc-400">A place to land.</span></h2>
          </div>
          <p className="max-w-md text-sm leading-7 text-zinc-600 md:justify-self-end">A quiet, personal layer between your work and the people trying to understand it. Built to feel considered, not crowded.</p>
        </div>
        <div className="mt-14 grid gap-3 md:grid-cols-3">
          {features.map(({ icon: Icon, eyebrow, title, text, className, accent }) => (
            <article key={title} className={`home-card group min-h-56 rounded-2xl p-6 transition-transform duration-200 hover:-translate-y-1 sm:p-7 ${className}`}>
              <div className={`flex h-9 w-9 items-center justify-center rounded-full border ${accentClasses[accent as keyof typeof accentClasses]}`}><Icon className="h-4 w-4" /></div>
              <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">{eyebrow}</p>
              <h3 className="mt-2 text-xl font-medium tracking-tight">{title}</h3>
              <p className="mt-2 max-w-sm text-sm leading-6 text-zinc-600">{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
