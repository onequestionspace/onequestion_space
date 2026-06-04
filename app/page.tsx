'use client';

import { URLClaimBox } from '@/components/URLClaimBox';
import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { HowItWorks } from '@/components/HowItWorks';
import { ProfilePreview } from '@/components/ProfilePreview';
import { TeamSection } from '@/components/TeamSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';

/**
 * Homepage
 * Clean, modern landing page with Linktree-inspired design
 */
export default function Home() {
  return (
    <main className="relative">
      {/* URL Claim Box */}
      <URLClaimBox />

      {/* Hero Section */}
      <Hero />

      {/* Social Proof */}
      <SocialProof />

      {/* How It Works */}
      <HowItWorks />

      {/* Profile Preview */}
      <ProfilePreview />

      {/* Team Section */}
      <TeamSection />

      {/* Pricing Section */}
      <PricingSection />

      {/* Final CTA */}
      <CTASection />
    </main>
  );
}
