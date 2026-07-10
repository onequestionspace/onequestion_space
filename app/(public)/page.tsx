'use client';

import { Hero } from '@/components/Hero';
import { ProblemSection } from '@/components/ProblemSection';
import { HowItWorksSection } from '@/components/HowItWorksSection';
import { BentoSection } from '@/components/BentoSection';
import { TestimonialsSection } from '@/components/TestimonialsSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';
import { FadeInSection } from '@/components/FadeInSection';
import { LiveActivity } from '@/components/LiveActivity';
import { FAQSection } from '@/components/FAQSection';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <FadeInSection><ProblemSection /></FadeInSection>
      <div id="how-it-works"><FadeInSection><HowItWorksSection /></FadeInSection></div>
      <FadeInSection><BentoSection /></FadeInSection>
      <FadeInSection><LiveActivity /></FadeInSection>
      <FadeInSection><TestimonialsSection /></FadeInSection>
      <FadeInSection><PricingSection /></FadeInSection>
      <FadeInSection><FAQSection /></FadeInSection>
      <FadeInSection><CTASection /></FadeInSection>
    </main>
  );
}
