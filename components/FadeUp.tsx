'use client';

// framer-motion removed for mobile stability

interface FadeUpProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function FadeUp({ children, delay = 0, className }: FadeUpProps) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
