'use client';

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
        transition: `opacity 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 100}ms, transform 0.65s cubic-bezier(0.22,1,0.36,1) ${index * 100}ms`,
      }}
    >
      <div className="glass rounded-2xl p-6 h-full border border-white/10 hover:border-primary/30 transition-colors duration-300">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
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
