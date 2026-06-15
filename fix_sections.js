const fs = require('fs');

const problem = `'use client';

export function ProblemSection() {
  const problems = [
    { text: 'What do you do?' },
    { text: 'How can I work with you?' },
    { text: 'What are your prices?' },
    { text: 'How do I contact you?' },
    { text: 'What do you offer?' },
    { text: 'Can you explain what you do?' },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(239,68,68,0.04),transparent_70%)]" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
          You keep answering the
          <br />
          <span className="gradient-text">same questions.</span>
          <br />
          Every. Single. Day.
        </h2>
        <p className="text-muted-foreground text-lg mb-12">
          Your inbox is full. Your DMs never stop. You are repeating yourself to every new person who finds you.
        </p>

        <div className="grid grid-cols-2 gap-3 mb-12">
          {problems.map((p, i) => (
            <div
              key={i}
              className="glass rounded-2xl px-4 py-4 border border-white/8 text-left group hover:border-red-500/30 transition-all duration-300"
              style={{
                opacity: 0.5 + i * 0.1,
              }}
            >
              <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors leading-snug">{p.text}</p>
            </div>
          ))}
        </div>

        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 to-pink/40 rounded-2xl blur-md" />
          <div className="relative glass rounded-2xl px-8 py-5 border border-white/20">
            <p className="text-white font-bold text-xl">There is a better way.</p>
            <p className="text-muted-foreground text-sm mt-1">One space. Every question answered. Automatically.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

const upload = `'use client';

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
`;

const cta = `'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Check } from 'lucide-react';

export function CTASection() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/15 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/25 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-72 h-72 bg-accent-pink/20 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-4 text-center">
        <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-[1.05]">
          Your knowledge.
          <br />
          <span className="gradient-text">Your answers.</span>
          <br />
          Your space.
        </h2>

        <p className="text-lg text-muted-foreground mb-10 max-w-md mx-auto">
          Join creators, businesses, and teams already saving time with AI-powered Q&A pages.
        </p>

        <div className="flex flex-col items-center gap-4 mb-8">
          {isLoaded && (
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-primary via-pink to-accent-pink rounded-full blur-md opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <Link
                href={isSignedIn ? '/dashboard' : '/sign-up'}
                className="relative inline-block px-10 py-5 bg-gradient-to-r from-primary to-pink text-white font-bold text-xl rounded-full transition-all hover:-translate-y-0.5"
              >
                Claim Your Space Now
              </Link>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-muted-foreground text-sm">
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-primary shrink-0" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-accent-pink shrink-0" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-accent-yellow shrink-0" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
`;

fs.writeFileSync('components/ProblemSection.tsx', problem);
console.log('✅ ProblemSection upgraded');

fs.writeFileSync('components/UploadSection.tsx', upload);
console.log('✅ UploadSection upgraded');

fs.writeFileSync('components/CTASection.tsx', cta);
console.log('✅ CTASection upgraded');

console.log('\nDone. Ready to build.');
