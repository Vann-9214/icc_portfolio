"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useMotionValue, useAnimationFrame } from "framer-motion";
import { FadeInOnScroll } from "./animations/standard-scroll";
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
  const lastPointerX = useRef(0);

  const velocityHistory = useRef<number[]>([]);
  const coastVelocity = useRef(0);
  const isCoasting = useRef(false);

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

    if (isCoasting.current) {
      coastVelocity.current *= 0.91;
      if (Math.abs(coastVelocity.current) < 0.25) {
        isCoasting.current = false;
        coastVelocity.current = 0;
      } else {
        x.set(normalizeX(x.get() + coastVelocity.current, contentWidth));
        return;
      }
    }

    const speed = delta * 0.04;
    const moved = direction === "left" ? x.get() - speed : x.get() + speed;
    x.set(normalizeX(moved, contentWidth));
  });

  const handlePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      isDragging.current = true;
      isCoasting.current = false;
      coastVelocity.current = 0;
      velocityHistory.current = [];
      lastPointerX.current = e.clientX;
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging.current || contentWidth === 0) return;
      const deltaX = e.clientX - lastPointerX.current;
      lastPointerX.current = e.clientX;
      velocityHistory.current.push(deltaX);
      if (velocityHistory.current.length > 6) velocityHistory.current.shift();
      x.set(normalizeX(x.get() + deltaX, contentWidth));
    },
    [contentWidth, x],
  );

  const stopDragging = useCallback(() => {
    if (velocityHistory.current.length > 0) {
      const avg =
        velocityHistory.current.reduce((a, b) => a + b, 0) /
        velocityHistory.current.length;
      if (Math.abs(avg) > 0.5) {
        coastVelocity.current = avg * 2.8;
        isCoasting.current = true;
      }
    }
    velocityHistory.current = [];
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
      <motion.div ref={innerRef} className="flex w-max" style={{ x }}>
        {duplicatedItems.map((tech, index) => (
          <div
            key={`${tech.name}-${index}`}
            className={[
              "flex items-center gap-4 px-8 md:px-12 py-6 mx-3 rounded-xl flex-shrink-0 select-none",
              "relative overflow-hidden",
              "border border-white/60 bg-white/[0.04] shadow-sm",
              "transition-all duration-150 ease-out",
              "hover:border-white/90 hover:bg-white/[0.09] hover:shadow-[0_0_0_1px_rgba(255,255,255,0.15),0_4px_24px_rgba(255,255,255,0.06)]",
              "active:scale-[0.97]",
            ].join(" ")}
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
            />
            <span className="text-2xl md:text-3xl inline-block">
              {tech.icon}
            </span>
            <span className="text-lg md:text-xl text-foreground/80 whitespace-nowrap">
              {tech.name}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TechStackMarquee() {
  const blurMask = {
    maskImage:
      "linear-gradient(to bottom, transparent, black 32px, black calc(100% - 32px), transparent)",
    WebkitMaskImage:
      "linear-gradient(to bottom, transparent, black 32px, black calc(100% - 32px), transparent)",
  };

  return (
    <section className="relative py-32 md:py-48 overflow-hidden">
      {/* ── Text header blur — same fade-mask trick, no hard edges ── */}
      <div
        className="relative mb-20 py-8 backdrop-blur-sm bg-white/[0.01]"
        style={blurMask}
      >
        <FadeInOnScroll className="relative px-6 md:px-12 lg:px-24">
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none select-none absolute -top-3 left-0 text-[5rem] md:text-[8rem] font-black tracking-tighter leading-none text-white/[0.028]"
            >
              STACK
            </span>

            <div className="mb-3 flex items-center gap-3">
              <span className="text-sm tracking-[0.3em] uppercase text-muted-foreground">
                Tech Stack
              </span>
            </div>

            <div className="flex flex-col space-y-3 max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground bg-clip-text bg-gradient-to-b from-foreground via-foreground to-foreground/70">
                Engineered with a world-class production stack.
              </h2>
              <p className="text-muted-foreground text-sm md:text-base max-w-lg pt-1">
                Seamless interactive performance across modern technologies,
                frameworks, and deployment architectures.
              </p>
            </div>
          </div>
        </FadeInOnScroll>
      </div>

      {/* ── Rows blur — unchanged ── */}
      <div
        className="relative space-y-6 backdrop-blur-sm bg-white/[0.01] py-8"
        style={blurMask}
      >
        <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-28 bg-gradient-to-r from-background to-transparent md:w-72" />
        <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-28 bg-gradient-to-l from-background to-transparent md:w-72" />

        <DraggableRow items={firstHalf} direction="left" />
        <DraggableRow items={secondHalf} direction="right" />
      </div>
    </section>
  );
}
