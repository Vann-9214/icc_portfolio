"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { FadeInOnScroll } from "./scroll-animations";

const techStack = [
  { name: "React", icon: "⚛️" },
  { name: "Next.js", icon: "▲" },
  { name: "TypeScript", icon: "TS" },
  { name: "Node.js", icon: "⬢" },
  { name: "Python", icon: "🐍" },
  { name: "Arduino", icon: "◉" },
  { name: "C++", icon: "C++" },
  { name: "Figma", icon: "◈" },
  { name: "PostgreSQL", icon: "🐘" },
  { name: "TailwindCSS", icon: "💨" },
  { name: "Git", icon: "⎇" },
  { name: "Docker", icon: "🐳" },
];

// Split the tech stack into two halves
const firstHalf = techStack.slice(0, 6);
const secondHalf = techStack.slice(6, 12);

function DraggableRow({
  items,
  direction,
}: {
  items: typeof techStack;
  direction: "left" | "right";
}) {
  const constraintsRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 30 });

  // Duplicate items heavily to ensure the loop never runs out of track before resetting
  const duplicatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      ref={constraintsRef}
      className="overflow-hidden cursor-grab active:cursor-grabbing"
    >
      <motion.div
        drag="x"
        dragConstraints={{ left: -2000, right: 0 }}
        dragElastic={0.1}
        style={{ x: springX }}
        className="flex w-max"
        animate={{
          // Use percentage for a perfectly seamless, unbroken loop
          x: direction === "left" ? ["0%", "-50%"] : ["-50%", "0%"],
        }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 30, // Controls the speed of the loop
            ease: "linear",
          },
        }}
        whileDrag={{ animationPlayState: "paused" }}
      >
        {duplicatedItems.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className="flex items-center gap-4 px-8 md:px-12 py-6 mx-3 border border-border rounded-xl bg-white/[0.04] backdrop-blur-xl hover:bg-white/[0.08] transition-colors duration-300 flex-shrink-0 select-none"
          >
            <span className="text-2xl md:text-3xl">{tech.icon}</span>
            <span className="text-lg md:text-xl text-foreground whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TechStackMarquee() {
  return (
    <section className="py-32 md:py-48 overflow-hidden">
      <FadeInOnScroll className="mb-16 px-6 md:px-12 lg:px-24">
        <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
          Tech Stack
        </span>
      </FadeInOnScroll>

      <div className="relative space-y-6">
        {/* Gradient overlays for fade effect */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        {/* Row 1 - moves left with the first half */}
        <DraggableRow items={firstHalf} direction="left" />

        {/* Row 2 - moves right with the second half */}
        <DraggableRow items={secondHalf} direction="right" />
      </div>

      <FadeInOnScroll className="mt-8 px-6 md:px-12 lg:px-24">
        <p className="text-muted-foreground/60 text-xs tracking-wide">
          Drag to explore
        </p>
      </FadeInOnScroll>
    </section>
  );
}
