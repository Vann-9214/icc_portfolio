'use client'

// BUG FIX START - Added useSpring to the import list for ultra-smooth scrolling
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
// BUG FIX END
import { useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

export function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])
  const y = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [80, 0, 0, -80])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      transition={{ delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeInOnScroll({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1])
  const y = useTransform(scrollYProgress, [0, 0.5], [60, 0])

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y }}
      transition={{ delay, duration: 0.8, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ParallaxSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '-20%'])

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  )
}

// NEW ADDITION START
export function ElementVacuumEffect({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    // BUG FIX START - Shortened the off-screen target distance so the vacuum effect finishes much faster
    offset: ["start 120px", "start -40px"] as any
    // BUG FIX END
  });

  const smoothProgress = useSpring(scrollYProgress, {
    // BUG FIX START - Made the spring physics tighter and more responsive (approx 30% snappier)
    stiffness: 150,
    damping: 20,
    // BUG FIX END
    restDelta: 0.001
  });

  const scale = useTransform(smoothProgress, [0, 1], [1, 0.75]);
  const opacity = useTransform(smoothProgress, [0, 0.8, 1], [1, 0.2, 0]); 
  const blur = useTransform(smoothProgress, [0, 1], ["blur(0px)", "blur(16px)"]);
  const y = useTransform(smoothProgress, [0, 1], [0, -60]);

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
// NEW ADDITION END