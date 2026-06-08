'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '@/constants';

/**
 * Pricing Section Component
 * Displays all pricing tiers with message-based billing
 */
export function PricingSection() {
  const plans = Object.entries(PRICING_PLANS).map(([key, plan]) => ({
    key,
    ...plan,
  }));

  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pay for what you use. Scale as you grow. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-3">
          {plans.map((plan) => (
            <div
              key={plan.key}
              className={`relative rounded-2xl transition-all overflow-hidden group ${
                plan.highlighted
                  ? 'lg:col-span-1 md:col-span-2 lg:scale-105 bg-gradient-to-b from-primary/20 to-background border-2 border-primary/50 shadow-glow'
                  : 'bg-white/5 border border-white/10 hover:border-white/20'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <span className="bg-gradient-primary text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Coming Soon overlay */}
              {plan.comingSoon && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
                  <span className="bg-accent-yellow/20 text-accent-yellow px-4 py-2 rounded-full font-semibold text-sm border border-accent-yellow/50">
                    Coming Soon
                  </span>
                </div>
              )}

              <div className="p-6 h-full flex flex-col">
                {/* Plan name */}
                <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-xs mb-4">{plan.description}</p>

                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-muted-foreground text-sm">/month</span>
                  </div>
                  <p className="text-muted-foreground text-xs mt-2">
                    {typeof plan.messages === 'number'
                      ? `${plan.messages.toLocaleString()} messages`
                      : 'Unlimited messages'}
                  </p>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.comingSoon ? '#' : plan.key === 'free' ? '/sign-up' : '/sign-up'}
                  onClick={(e) => {
                    if (plan.comingSoon) {
                      e.preventDefault();
                    }
                  }}
                  className={`w-full py-2.5 rounded-lg font-semibold text-center mb-6 transition-all text-sm ${
                    plan.highlighted
                      ? 'bg-gradient-primary text-white hover:shadow-glow-lg'
                      : plan.comingSoon
                        ? 'bg-white/5 text-muted-foreground cursor-not-allowed'
                        : 'border border-white/20 text-white hover:bg-white/5 hover:border-primary/50'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-3 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-2">
                      <Check
                        className={`w-4 h-4 flex-shrink-0 mt-0.5 ${
                          plan.highlighted ? 'text-primary' : 'text-accent-yellow'
                        }`}
                      />
                      <span className="text-muted-foreground text-xs leading-tight">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <p className="text-muted-foreground mb-4">
            All plans include a 14-day free trial. No credit card required. Cancel anytime.
          </p>
          <p className="text-sm text-muted-foreground/70">
            Questions? <Link href="#contact" className="text-primary hover:underline">Contact our sales team</Link>
          </p>
        </div>
      </div>
    </section>
  );
}
