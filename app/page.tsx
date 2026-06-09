'use client';

import { Hero } from '@/components/Hero';
import { ProblemSection } from '@/components/ProblemSection';
import { SolutionSection } from '@/components/SolutionSection';
import { UploadSection } from '@/components/UploadSection';
import { AnalyticsSection } from '@/components/AnalyticsSection';
import { ProfilesSection } from '@/components/ProfilesSection';
import { TeamSection } from '@/components/TeamSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';
import { FadeInSection } from '@/components/FadeInSection';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <FadeInSection>
        <ProblemSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <SolutionSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <UploadSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <AnalyticsSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <ProfilesSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <TeamSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <PricingSection />
      </FadeInSection>
      <FadeInSection delay={100}>
        <CTASection />
      </FadeInSection>
    </main>
  );
}