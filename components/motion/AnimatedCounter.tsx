"use client";

import { useEffect, useState, useRef } from "react";

export default function AnimatedCounter({
  value,
  suffix = "",
  prefix = "",
}: {
  value: number;
  suffix?: string;
  prefix?: string;
}) {
  const [count, setCount] = useState(value);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [ready, setReady] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          setCount(0);
          let current = 0;
          const increment = Math.max(1, Math.floor(value / 40));
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, 25);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, hasAnimated, ready]);

  return (
    <span ref={ref}>
      {prefix}{count}{suffix}
    </span>
  );
}
