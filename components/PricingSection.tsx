'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';

/**
 * Pricing Section Component
 * Clean Linktree-style pricing cards
 */
export function PricingSection() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: [
        '50 questions/month',
        'Basic AI responses',
        'Public profile',
        'Community support',
      ],
      cta: 'Get Started',
      highlighted: false,
      gradient: '',
    },
    {
      name: 'Pro',
      price: '29',
      description: 'For serious creators',
      features: [
        'Unlimited questions',
        'Advanced AI responses',
        'Custom domain',
        'Analytics dashboard',
        'Priority support',
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      gradient: 'from-primary via-accent-pink to-accent-red',
    },
    {
      name: 'Business',
      price: '99',
      description: 'For teams and enterprises',
      features: [
        'Everything in Pro',
        'Team access',
        'Private spaces',
        'Advanced analytics',
        'Dedicated support',
        'Custom integrations',
      ],
      cta: 'Contact Sales',
      highlighted: false,
      gradient: '',
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Choose the plan that works best for you
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl transition-all ${
                plan.highlighted
                  ? 'md:scale-105 bg-gradient-to-b from-primary/20 to-background border border-primary/50 shadow-glow'
                  : 'glass card-hover'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 h-full flex flex-col">
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-muted-foreground ml-2">/month</span>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.name === 'Business' ? '#contact' : '/sign-up'}
                  className={`w-full py-3 rounded-full font-semibold text-center mb-8 transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-primary text-white hover:shadow-glow-lg'
                      : 'border border-white/20 text-white hover:bg-white/5 hover:border-primary/50'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <Check className={`w-5 h-5 flex-shrink-0 mt-0.5 ${plan.highlighted ? 'text-primary' : 'text-accent-yellow'}`} />
                      <span className="text-muted-foreground text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional info */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
