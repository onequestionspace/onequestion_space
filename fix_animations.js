const fs = require('fs');

// Fix 1: Upgrade FadeInSection
const fadeIn = `'use client';

import { useEffect, useRef, useState } from 'react';

export function FadeInSection({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: React.ReactNode; 
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.08, rootMargin: '-40px 0px' }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: \`opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1), transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)\`,
        transitionDelay: delay + 'ms',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(36px)',
        willChange: 'opacity, transform',
      }}
    >
      {children}
    </div>
  );
}
`;

// Fix 2: page.tsx with staggered delays
const page = `'use client';

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
`;

fs.writeFileSync('components/FadeInSection.tsx', fadeIn);
console.log('✅ FadeInSection upgraded');

fs.writeFileSync('app/page.tsx', page);
console.log('✅ page.tsx stagger delays fixed');

console.log('\nDone. Build and push.');
