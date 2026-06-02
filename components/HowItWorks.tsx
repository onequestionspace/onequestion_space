'use client';

import { Upload, Link as LinkIcon, Zap, Sparkles } from 'lucide-react';

/**
 * How It Works Section Component
 * Minimal step-by-step process
 */
export function HowItWorks() {
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

  return (
    <section id="how-it-works" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 dot-pattern opacity-30" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            How It <span className="gradient-text">Works</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Four simple steps to launch your AI-powered Q-Page
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="relative group">
                {/* Card */}
                <div className="glass rounded-2xl p-6 h-full card-hover">
                  {/* Step number */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Content */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium text-muted-foreground">Step {step.number}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-px bg-gradient-to-r from-primary/50 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
