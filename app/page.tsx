'use client';

import { URLClaimBox } from '@/components/URLClaimBox';
import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { HowItWorks } from '@/components/HowItWorks';
import { ProfilePreview } from '@/components/ProfilePreview';
import { TeamSection } from '@/components/TeamSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';
import { ProductExplainer } from '@/components/ProductExplainer';
import { FadeInSection } from '@/components/FadeInSection';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <URLClaimBox />
      <ProductExplainer />
      <FadeInSection>
        <SocialProof />
      </FadeInSection>
      <FadeInSection delay={100}>
        <HowItWorks />
      </FadeInSection>
      <FadeInSection delay={150}>
        <ProfilePreview />
      </FadeInSection>
      <FadeInSection delay={200}>
        <TeamSection />
      </FadeInSection>
      <FadeInSection delay={250}>
        <PricingSection />
      </FadeInSection>
      <FadeInSection delay={300}>
        <CTASection />
      </FadeInSection>
    </main>
  );
}