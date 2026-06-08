'use client';

import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { HowItWorks } from '@/components/HowItWorks';
import { ProfilePreview } from '@/components/ProfilePreview';
import { TeamSection } from '@/components/TeamSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';

export default function Home() {
  return (
    <main className="relative">
      <Hero />
      <SocialProof />
      <HowItWorks />
      <ProfilePreview />
      <TeamSection />
      <PricingSection />
      <CTASection />
    </main>
  );
}
