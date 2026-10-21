'use client';

import { Hero } from '@/components/Hero';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { PricingSection } from '@/components/PricingSection';
import { BentoSection } from '@/components/BentoSection';

export default function Home() {
  return (
    <main className="nest-background relative overflow-hidden">
      <Hero />
      <BentoSection />
      <HowItWorksSection />
      <PricingSection />
    </main>
  );
}
