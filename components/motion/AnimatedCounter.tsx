'use client';

import { useEffect, useState } from 'react';

export function AnimatedCounter({ value, className = '' }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    setTimeout(() => {
    setDisplay(value);
      }, 0);
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
