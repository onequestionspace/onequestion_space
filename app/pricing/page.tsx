'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { PRICING_PLANS } from '@/constants';
import { Check, Sparkles } from 'lucide-react';

/**
 * Pricing Page
 * Display pricing plans and features with new brand design
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Background mesh */}
      <div className="fixed inset-0 -z-10">
        <div className="mesh-gradient" />
        <div className="dot-pattern" />
      </div>

      <main className="pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" />
              Simple Pricing
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Choose Your{' '}
              <span className="bg-gradient-to-r from-primary via-pink to-accent bg-clip-text text-transparent">
                Perfect Plan
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade as you grow. No hidden fees, cancel anytime.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {Object.entries(PRICING_PLANS).map(([key, plan], index) => {
              const isPopular = index === 1;
              return (
                <div
                  key={key}
                  className={`relative glass-card rounded-2xl p-8 transition-all duration-300 hover:scale-[1.02] ${
                    isPopular 
                      ? 'border-2 border-primary shadow-glow-primary' 
                      : 'border border-border'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-primary to-pink text-white text-sm font-semibold">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <h2 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h2>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-foreground">
                        {typeof plan.price === 'number' ? `₦${plan.price.toLocaleString()}` : plan.price}
                      </span>
                      {typeof plan.price === 'number' && (
                        <span className="text-muted-foreground">/month</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/waitlist"
                    className={`block w-full py-3 px-6 rounded-full font-semibold text-center transition-all duration-300 ${
                      isPopular
                        ? 'bg-gradient-to-r from-primary to-pink text-white hover:shadow-glow-primary'
                        : 'bg-card border border-border text-foreground hover:bg-primary hover:text-white hover:border-primary'
                    }`}
                  >
                    Get Started
                  </Link>
                </div>
              );
            })}
          </div>

          {/* FAQ or additional info */}
          <div className="mt-20 text-center">
            <p className="text-muted-foreground">
              Have questions?{' '}
              <Link href="/#team" className="text-primary hover:underline">
                Contact our team
              </Link>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
