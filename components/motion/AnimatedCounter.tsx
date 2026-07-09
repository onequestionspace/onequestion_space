'use client';

import { useEffect, useState } from 'react';

export function AnimatedCounter({ value, className = '' }: { value: number; className?: string }) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    setDisplay(value);
  }, [value]);

  return <span className={className}>{display.toLocaleString()}</span>;
}
