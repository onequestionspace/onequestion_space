const fs = require('fs');

const problem = `'use client';

import { useEffect, useState } from 'react';

const problems = [
  'What do you do?',
  'How can I work with you?',
  'What are your prices?',
  'How do I contact you?',
  'What do you offer?',
  'Can you explain what you do?',
];

function FloatingCard({ text, delay }: { text: string; delay: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="glass rounded-2xl px-4 py-4 border border-white/8 text-left group hover:border-primary/30 transition-all duration-500"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.97)',
        transition: \`opacity 0.6s cubic-bezier(0.22,1,0.36,1) \${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) \${delay}ms\`,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary/60 shrink-0 animate-pulse" />
        <p className="text-sm text-muted-foreground group-hover:text-white/80 transition-colors leading-snug">{text}</p>
      </div>
    </div>
  );
}

export function ProblemSection() {
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
          {problems.map((text, i) => (
            <FloatingCard key={i} text={text} delay={i * 120} />
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

const howItWorks = `'use client';

import { Upload, Link as LinkIcon, Zap, Sparkles } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

const steps = [
  {
    number: 1,
    title: 'Create Your Space',
    description: 'Set up your Q-Page in seconds with a custom username',
    icon: Sparkles,
    color: 'from-primary to-accent-pink',
  },
  {
    number: 2,
    title: 'Upload Knowledge',
    description: 'Share your expertise, documents, and FAQs',
    icon: Upload,
    color: 'from-accent-pink to-accent-red',
  },
  {
    number: 3,
    title: 'Share Your Link',
    description: 'Get a unique URL to share with your audience',
    icon: LinkIcon,
    color: 'from-accent-yellow to-accent-pink',
  },
  {
    number: 4,
    title: 'AI Answers Instantly',
    description: 'Let AI handle visitor questions 24/7',
    icon: Zap,
    color: 'from-primary to-accent-yellow',
  },
];

function StepCard({ step, index, visible }: { step: typeof steps[0]; index: number; visible: boolean }) {
  const Icon = step.icon;
  return (
    <div
      className="relative group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0) scale(1)' : 'translateY(28px) scale(0.96)',
        transition: \`opacity 0.65s cubic-bezier(0.22,1,0.36,1) \${index * 100}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) \${index * 100}ms\`,
      }}
    >
      <div className="glass rounded-2xl p-6 h-full border border-white/10 hover:border-primary/30 transition-colors duration-300">
        <div className={\`w-12 h-12 rounded-xl bg-gradient-to-br \${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300\`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-bold text-primary/70 tracking-widest">0{step.number}</span>
        </div>
        <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
      </div>
    </div>
  );
}

export function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [lineWidth, setLineWidth] = useState(0);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          let start = 0;
          const duration = 900;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            setLineWidth(Math.round(progress * 100));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 dot-pattern opacity-30" />
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It Works
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to launch your AI-powered Q-Page
          </p>

          {/* Animated progress line */}
          <div className="mt-8 max-w-xs mx-auto h-px bg-white/10 relative overflow-hidden rounded-full">
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-accent-pink to-accent-yellow rounded-full"
              style={{
                width: lineWidth + '%',
                transition: 'width 0.05s linear',
              }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <StepCard key={index} step={step} index={index} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
`;

const upload = `'use client';

import { FileText, Brain, Zap } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

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

export function UploadSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative py-24 overflow-hidden" ref={ref}>
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
              <div
                key={i}
                className="glass rounded-2xl p-5 border border-white/10 flex items-start gap-4 text-left relative overflow-hidden group hover:border-white/20 transition-all duration-300"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-20px)',
                  transition: \`opacity 0.6s cubic-bezier(0.22,1,0.36,1) \${i * 150}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) \${i * 150}ms\`,
                }}
              >
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-7xl font-black text-white/[0.04] select-none pointer-events-none leading-none">
                  {step.number}
                </div>
                <div
                  className={\`w-12 h-12 rounded-xl bg-gradient-to-br \${step.color} flex items-center justify-center shrink-0 transition-all duration-500\`}
                  style={{
                    transform: visible ? 'scale(1)' : 'scale(0.7)',
                    transition: \`transform 0.5s cubic-bezier(0.34,1.56,0.64,1) \${i * 150 + 200}ms\`,
                    boxShadow: visible ? '0 0 20px rgba(139,92,246,0.3)' : 'none',
                  }}
                >
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

fs.writeFileSync('components/ProblemSection.tsx', problem);
console.log('✅ ProblemSection — floating DM cards');

fs.writeFileSync('components/HowItWorks.tsx', howItWorks);
console.log('✅ HowItWorks — animated line + staggered cards');

fs.writeFileSync('components/UploadSection.tsx', upload);
console.log('✅ UploadSection — slide-in + icon glow on scroll');

console.log('\nDone. Build and push.');
