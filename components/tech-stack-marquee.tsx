"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { FadeInOnScroll } from "./scroll-animations";
import { TECH_STACK } from "@/lib/data";

const halfPoint = Math.ceil(TECH_STACK.length / 2);
const firstHalf = TECH_STACK.slice(0, halfPoint);
const secondHalf = TECH_STACK.slice(halfPoint);

function normalizeX(val: number, width: number): number {
  if (width === 0) return val;
  let n = val % width;
  if (n > 0) n -= width;
  return n;
}

function DraggableRow({
  items,
  direction,
}: {
  items: typeof TECH_STACK;
  direction: "left" | "right";
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [contentWidth, setContentWidth] = useState(0);
  const x = useMotionValue(0);
  const isDragging = useRef(false);
  // Track LAST pointer position, not origin — gives us incremental deltas
  const lastPointerX = useRef(0);

  const duplicatedItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    if (innerRef.current) {
      const width = innerRef.current.scrollWidth / 4;
      setContentWidth(width);
      if (direction === "right") x.set(-width);
    }
  }, [direction, x]);

  useAnimationFrame((_, delta) => {
    if (contentWidth === 0 || isDragging.current) return;
    const speed = delta * 0.04;
    const moved = direction === "left" ? x.get() - speed : x.get() + speed;
    x.set(normalizeX(moved, contentWidth));
  });

  // KEY FIX: pointer events give incremental deltaX, not absolute-from-origin.
  // After any teleport, the next move just adds a small delta from the new spot.
  // Framer Motion's drag prop causes snap-back because it tracks from drag origin.
  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = true;
      lastPointerX.current = e.clientX;
      // Capture keeps events flowing even if pointer leaves the element (fast drag)
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || contentWidth === 0) return;
      const deltaX = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      x.set(normalizeX(x.get() + deltaX, contentWidth));
    },
    [contentWidth, x],
  );

  const stopDragging = useCallback(() => {
    isDragging.current = false;
  }, []);

  return (
    <div
      className="overflow-hidden cursor-grab active:cursor-grabbing select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
    >
      <motion.div
        ref={innerRef}
        className="flex w-max"
        style={{ x }}
        // No drag prop — we handle it manually above
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
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

        <DraggableRow items={firstHalf} direction="left" />
        <DraggableRow items={secondHalf} direction="right" />
      </div>
    </section>
  );
}
