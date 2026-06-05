"use client";

import { useEffect, useState } from "react";

export default function AnimatedCounter({
  value,
}: {
  value: number;
}) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let current = 0;

    const increment = value / 40;

    const timer = setInterval(() => {
      current += increment;

      if (current >= value) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 25);

    return () => clearInterval(timer);
  }, [value]);

  return <>{count}</>;
}
