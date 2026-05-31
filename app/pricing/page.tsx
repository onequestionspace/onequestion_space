'use client';

import { PRICING_PLANS } from '@/constants';

/**
 * Pricing Page
 * Display pricing plans and features
 */
export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that works best for you</p>
        </div>

        {/* TODO: Implement pricing cards with features comparison */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(PRICING_PLANS).map(([key, plan]) => (
            <div key={key} className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">{plan.name}</h2>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                {typeof plan.price === 'number' ? `₦${plan.price}` : plan.price}
                {typeof plan.price === 'number' && <span className="text-lg text-gray-600">/month</span>}
              </p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="mr-3">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
