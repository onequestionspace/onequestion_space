'use client';

import { FadeIn } from '@/components/motion/FadeIn';

export function FadeInSection({
  children,
  delay = 0,
  className = ''
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <FadeIn delay={delay / 1000} className={className}>
      {children}
    </FadeIn>
  );
}
