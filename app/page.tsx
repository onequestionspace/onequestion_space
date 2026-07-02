'use client';

import { Hero } from '@/components/Hero';
import { ProblemSection } from '@/components/ProblemSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { BentoSection } from '@/components/BentoSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';
import { FadeInSection } from '@/components/FadeInSection';
import { StatsBar } from '@/components/StatsBar';
import { LiveActivity } from '@/components/LiveActivity';
import { FAQSection } from '@/components/FAQSection';

export default function Home() {
  return (
    <main className='relative'>
      <Hero />
      <StatsBar />
      <FadeInSection delay={0}>
        <ProblemSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <HowItWorksSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <BentoSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <LiveActivity />
      </FadeInSection>
      <FadeInSection delay={0}>
        <TestimonialsSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <PricingSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <FAQSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <CTASection />
      </FadeInSection>
    </main>
  );
}
