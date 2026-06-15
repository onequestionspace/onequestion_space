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
      <FadeInSection delay={0}>
        <ProblemSection />
      </FadeInSection>
      <FadeInSection delay={60}>
        <SolutionSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <UploadSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <AnalyticsSection />
      </FadeInSection>
      <FadeInSection delay={60}>
        <ProfilesSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <TeamSection />
      </FadeInSection>
      <FadeInSection delay={0}>
        <PricingSection />
      </FadeInSection>
      <FadeInSection delay={80}>
        <CTASection />
      </FadeInSection>
    </main>
  );
}
