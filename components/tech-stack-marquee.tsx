'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { FadeInOnScroll } from './scroll-animations'

const techStack = [
  { name: 'React', icon: '⚛️' },
  { name: 'Next.js', icon: '▲' },
  { name: 'TypeScript', icon: 'TS' },
  { name: 'Node.js', icon: '⬢' },
  { name: 'Python', icon: '🐍' },
  { name: 'Arduino', icon: '◉' },
  { name: 'C++', icon: 'C++' },
  { name: 'Figma', icon: '◈' },
  { name: 'PostgreSQL', icon: '🐘' },
  { name: 'TailwindCSS', icon: '💨' },
  { name: 'Git', icon: '⎇' },
  { name: 'Docker', icon: '🐳' },
]

// Duplicate for seamless loop
const duplicatedStack = [...techStack, ...techStack, ...techStack]

function DraggableRow({ items, direction }: { items: typeof techStack; direction: 'left' | 'right' }) {
  const constraintsRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 300, damping: 30 })

  return (
    <div ref={constraintsRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
      <motion.div
        drag="x"
        dragConstraints={{ left: -2000, right: 2000 }}
        dragElastic={0.1}
        style={{ x: springX }}
        className="flex"
        animate={{
          x: direction === 'left' ? [0, -1200] : [-1200, 0],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: 'loop',
            duration: 40,
            ease: 'linear',
          },
        }}
        whileDrag={{ animationPlayState: 'paused' }}
      >
        {items.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-4 px-8 md:px-12 py-6 mx-3 border border-border rounded-xl bg-card/50 backdrop-blur-sm hover:bg-muted/50 transition-colors duration-300 flex-shrink-0 select-none"
          >
            <span className="text-2xl md:text-3xl">{tech.icon}</span>
            <span className="text-lg md:text-xl text-foreground whitespace-nowrap">{tech.name}</span>
          </div>
        ))}
      </motion.div>
    </div>
  )
}

export function TechStackMarquee() {
  return (
    <section className="py-32 md:py-48 overflow-hidden">
      <FadeInOnScroll className="mb-16 px-6 md:px-12 lg:px-24">
        <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">Tech Stack</span>
      </FadeInOnScroll>
      
      <div className="relative space-y-6">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        {/* Row 1 - moves left */}
        <DraggableRow items={duplicatedStack} direction="left" />
        
        {/* Row 2 - moves right */}
        <DraggableRow items={duplicatedStack} direction="right" />
      </div>
      
      <FadeInOnScroll className="mt-8 px-6 md:px-12 lg:px-24">
        <p className="text-muted-foreground/60 text-xs tracking-wide">Drag to explore</p>
      </FadeInOnScroll>
    </section>
  )
}
