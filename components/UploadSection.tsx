'use client';

import { FileText, Brain, Zap } from 'lucide-react';

export function UploadSection() {
  const steps = [
    {
      icon: FileText,
      number: '01',
      title: 'Upload Your Knowledge',
      description: 'Add your FAQs, documents, bio, pricing, anything you want your AI to know about you.',
      color: 'from-primary to-pink',
    },
    {
      icon: Brain,
      number: '02',
      title: 'AI Learns Your Voice',
      description: 'Your AI studies everything you upload and learns to answer in your style and tone.',
      color: 'from-pink to-accent-red',
    },
    {
      icon: Zap,
      number: '03',
      title: 'Answers Instantly Forever',
      description: 'Every visitor gets an instant accurate answer. You never have to repeat yourself again.',
      color: 'from-accent-yellow to-primary',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-20" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          Upload once.
          <br />
          <span className="text-white">Answer forever.</span>
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Your knowledge does not disappear when you close your laptop. It lives in your space and works while you sleep.
        </p>
        <div className="space-y-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div key={i} className="glass rounded-2xl p-5 border border-white/10 flex items-start gap-4 text-left relative overflow-hidden group hover:border-white/20 transition-all duration-300">
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl font-black text-white/[0.04] select-none pointer-events-none leading-none">
                  {step.number}
                </div>
                <div className={'w-12 h-12 rounded-xl bg-gradient-to-br ' + step.color + ' flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300'}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-white font-bold mb-1">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
