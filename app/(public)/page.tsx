'use client';

import { Hero } from '@/components/Hero';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { PricingSection } from '@/components/PricingSection';

export default function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <HowItWorksSection />
      <PricingSection />
    </main>
  );
}
