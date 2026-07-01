'use client';

import { Hero } from '@/components/Hero';
import { ProblemSection } from '@/components/ProblemSection';
import { BentoSection } from '@/components/BentoSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';
import { FadeInSection } from '@/components/FadeInSection';

export default function Home() {
  return (
    <main className='relative'>
      <Hero />
      <FadeInSection delay={0}>
        <ProblemSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <BentoSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <HowItWorksSection />
      </FadeInSection>
      <FadeInSection delay={0}>
      </FadeInSection>
      <FadeInSection delay={0}>
        <PricingSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <CTASection />
      </FadeInSection>
    </main>
  );
}