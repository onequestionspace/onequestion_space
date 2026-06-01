'use client';

import { Hero } from '@/components/Hero';
import { SocialProof } from '@/components/SocialProof';
import { HowItWorks } from '@/components/HowItWorks';
import { ProfilePreview } from '@/components/ProfilePreview';
import { TeamSection } from '@/components/TeamSection';
import { PricingSection } from '@/components/PricingSection';
import { CTASection } from '@/components/CTASection';

/**
 * Homepage
 * Premium MVP landing page with cyberpunk theme
 */
export default function Home() {
  return (
    <main className="bg-cyber-black">
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
