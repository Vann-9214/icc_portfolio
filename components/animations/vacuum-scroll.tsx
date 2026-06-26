'use client'

import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { useRef } from 'react'


// ScrollReveal, FadeInOnScroll, and ParallaxSection live in standard-scroll.tsx.
// Re-export them here so existing imports of vacuum-scroll still work.
export { ScrollReveal, FadeInOnScroll, ParallaxSection } from './standard-scroll'

// Shrinks, blurs, and fades the element as it scrolls toward the top of the viewport,
// creating a "vacuum" effect that makes room for the next section
export function ElementVacuumEffect({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 120px", "start -40px"] as any
  });

  // Spring smoothing makes the vacuum effect feel physical rather than linear
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 150,
    damping: 20,
    restDelta: 0.001
  });

  const scale   = useTransform(smoothProgress, [0, 1], [1, 0.75]);
  const opacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 0.2, 0]);
  const blur    = useTransform(smoothProgress, [0, 1], ["blur(0px)", "blur(16px)"]);
  const y       = useTransform(smoothProgress, [0, 1], [0, -60]);

  return (
    <motion.div
      ref={ref}
      style={{
        scale,
        opacity,
        filter: blur,
        y,
        transformOrigin: "top center",
        width: "100%",
        willChange: "transform, opacity, filter"
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
