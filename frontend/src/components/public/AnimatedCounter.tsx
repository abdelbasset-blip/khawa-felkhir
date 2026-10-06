import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 1.8,
  suffix = "",
  prefix = "",
  className = "",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-20px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }

    const totalSteps = 60;
    const stepTime = (duration * 1000) / totalSteps;
    const stepValue = end / totalSteps;

    const timer = setInterval(() => {
      start += stepValue;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [isInView, value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString("fr-FR")}
      {suffix}
    </span>
  );
};
