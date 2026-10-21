'use client';

import { Hero } from '@/components/Hero';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { PricingSection } from '@/components/PricingSection';

export default function Home() {
  return (
    <main className="nest-background relative overflow-hidden">
      <Hero />
      <HowItWorksSection />
      <PricingSection />
    </main>
  );
}
