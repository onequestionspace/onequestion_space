'use client';

import Link from 'next/link';
import { Check } from 'lucide-react';
import { PRICING_PLANS } from '@/constants';

export function PricingSection() {
  const plans = Object.entries(PRICING_PLANS).map(([key, plan]) => ({
    key,
    ...plan,
  }));

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-pink/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium mb-6">
            Pricing
          </div>

          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Start Free.
            <br />
            <span className="gradient-text">Scale When It Works.</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            No seat-based pricing. No complicated limits. Pay based on how many
            questions your audience actually asks.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">
          {plans.map((plan) => {
            const isFeatured = plan.key === 'pro';

            return (
              <div
                key={plan.key}
                className={`
                  relative rounded-3xl transition-all duration-300
                  ${
                    isFeatured
                      ? 'border-2 border-primary shadow-glow bg-gradient-to-b from-primary/15 to-card scale-105'
                      : 'border border-white/10 bg-card/70 hover:border-primary/30'
                  }
                `}
              >
                {isFeatured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-2 rounded-full text-xs font-bold bg-gradient-primary text-white shadow-glow">
                      MOST POPULAR
                    </span>
                  </div>
                )}

                {plan.comingSoon && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-accent-yellow/15 text-accent-yellow border border-accent-yellow/30">
                      Launching Soon
                    </span>
                  </div>
                )}

                <div className="p-8 h-full flex flex-col">
                  <div className="mb-8">
                    <h3 className="text-2xl font-bold text-white mb-2">
                      {plan.name}
                    </h3>

                    <p className="text-muted-foreground text-sm mb-6">
                      {plan.description}
                    </p>

                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-5xl font-bold text-white">
                        ${plan.price}
                      </span>

                      {plan.price > 0 && (
                        <span className="text-muted-foreground mb-2">
                          /month
                        </span>
                      )}
                    </div>

                    <p className="text-primary font-medium">
                      {plan.messages === 'unlimited'
                        ? 'Unlimited questions'
                        : `${plan.messages.toLocaleString()} questions/month`}
                    </p>
                  </div>

                  <div className="space-y-4 flex-grow">
                    {plan.features.map((feature: string) => (
                      <div
                        key={feature}
                        className="flex items-start gap-3"
                      >
                        <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8">
                    <Link
                      href="/sign-up"
                      className={`
                        w-full inline-flex justify-center items-center
                        rounded-xl px-6 py-4 font-semibold transition-all
                        ${
                          isFeatured
                            ? 'bg-gradient-primary text-white hover:shadow-glow'
                            : plan.comingSoon
                            ? 'bg-white/5 text-muted-foreground border border-white/10'
                            : 'bg-white text-black hover:bg-white/90'
                        }
                      `}
                    >
                      {plan.comingSoon ? 'Join Waitlist' : plan.cta}
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span>✓ 14-day free trial</span>
            <span>✓ No credit card required</span>
            <span>✓ Cancel anytime</span>
            <span>✓ Upgrade when ready</span>
          </div>
        </div>
      </div>
    </section>
  );
}
