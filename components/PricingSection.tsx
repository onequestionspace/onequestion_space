'use client';

import Link from 'next/link';

/**
 * Pricing Section Component
 * Display pricing tiers with features
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
    },
  ];

  return (
    <section className="relative py-20 bg-cyber-black overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyber-purple rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyber-red rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-400">Choose the plan that works best for you</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative group rounded-2xl transition-all ${
                plan.highlighted
                  ? 'md:scale-105 bg-gradient-to-b from-cyber-purple/20 to-cyber-black border border-cyber-purple/50 shadow-glow-purple-lg'
                  : 'bg-cyber-gray border border-cyber-purple/20 hover:border-cyber-purple/50 hover:shadow-glow-purple'
              }`}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-cyber-purple to-cyber-red text-white px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="p-8 h-full flex flex-col">
                {/* Plan name */}
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-gray-400 text-sm mb-6">{plan.description}</p>

                {/* Price */}
                <div className="mb-8">
                  <span className="text-5xl font-bold text-white">${plan.price}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>

                {/* CTA Button */}
                <Link
                  href={plan.name === 'Business' ? '#contact' : '/sign-up'}
                  className={`w-full py-3 rounded-lg font-bold text-center mb-8 transition-all ${
                    plan.highlighted
                      ? 'bg-gradient-to-r from-cyber-purple to-cyber-red text-white hover:shadow-glow-purple-lg'
                      : 'border-2 border-cyber-purple text-cyber-purple hover:bg-cyber-purple/10'
                  }`}
                >
                  {plan.cta}
                </Link>

                {/* Features */}
                <div className="space-y-4 flex-1">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start space-x-3">
                      <svg className="w-5 h-5 text-cyber-purple flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ or additional info */}
        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-4">All plans include a 14-day free trial. No credit card required.</p>
        </div>
      </div>
    </section>
  );
}
