'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

interface ScrollRevealProps {
  children: React.ReactNode
  className?: string
  delay?: number
}

// Fades and slides the element in as it enters the viewport, then fades it out as it leaves
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

// Fades and slides the element in once it reaches the center of the viewport — does not fade out
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

// Applies a slow vertical parallax shift as the element scrolls through the viewport
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
