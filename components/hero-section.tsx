"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { HERO_DATA, SPECIALTIES } from "@/lib/data";
// NEW ADDITION START
import {ElementVacuumEffect} from "./animations/vacuum-scroll";
// NEW ADDITION END

// Controls the staggered fade-in effect for the left column text and buttons
const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  },
  item: {
    hidden: { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
};

export function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Calculates the 3D tilt effect based on mouse position over the profile card
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const nx = (e.clientX - cx) / (rect.width / 2);
    const ny = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: -ny * 13, y: nx * 13 });
  }

  // Resets the profile card flat when the mouse leaves the area
  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 pt-26 md:pt-22 pb-16 bg-transparent overflow-hidden">
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-10 lg:gap-20 items-center">
          
          {/* Left Column: Text */}
          {/* NEW ADDITION START - Wrapped text column with vacuum effect and moved grid ordering here */}
          <ElementVacuumEffect className="order-2 lg:order-1">
          {/* NEW ADDITION END */}
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate="show"
              // BUG FIX START - Removed order classes from inner div as they are handled by wrapper
              className="relative space-y-7 select-none"
              // BUG FIX END
            >
              {/* Soft background glow effect behind the text */}
              <div
                className="absolute pointer-events-none -z-10"
                style={{
                  inset: "-80px -100px",
                  background:
                    "radial-gradient(ellipse 70% 75% at 42% 48%, rgba(255,255,255,1) 25%, rgba(255,255,255,0.7) 55%, transparent 100%)",
                  filter: "blur(18px)",
                }}
              />

              {/* Name & Role */}
              <motion.div variants={stagger.item} className="space-y-3">
                <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.05] tracking-tight text-brand-blue-dark">
                  <span className="text-primary-base">
                    {HERO_DATA.name.first}
                  </span>
                  <br />
                  <span className="text-brand-blue-dark">
                    {HERO_DATA.name.last}
                  </span>
                </h1>
                <div className="flex items-center gap-3 pt-1">
                  <span className="block h-px w-6 bg-neutral-base shrink-0" />
                  <p className="text-xs font-mono tracking-[0.2em] text-neutral-base uppercase">
                    {HERO_DATA.role}
                  </p>
                </div>
              </motion.div>

              {/* Personal Description */}
              <motion.p
                variants={stagger.item}
                className="text-neutral-base text-base md:text-lg leading-relaxed max-w-[42ch]"
              >
                {HERO_DATA.description}
              </motion.p>

              {/* Specialties Pills (Hardware, Software, Game Dev, IoT) */}
              <motion.div
                variants={stagger.item}
                className="flex flex-wrap gap-2"
              >
                {SPECIALTIES.map((s) => (
                  <span
                    key={s.label}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-mono tracking-wide ${s.style}`}
                  >
                    <s.icon className="w-3 h-3 shrink-0" />
                    {s.label}
                  </span>
                ))}
              </motion.div>

              {/* Horizontal Animated Divider Line */}
              <motion.div variants={stagger.item} className="overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{
                    duration: 1,
                    delay: 0.55,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  style={{ originX: 0 }}
                  className="h-px bg-gradient-to-r from-border via-border/50 to-transparent"
                />
              </motion.div>
            </motion.div>
          {/* NEW ADDITION START */}
          </ElementVacuumEffect>
          {/* NEW ADDITION END */}

          {/* Right Column: 3D Profile Card */}
          {/* NEW ADDITION START - Wrapped 3D card with vacuum effect and moved sizing/ordering here */}
          <ElementVacuumEffect className="order-1 lg:order-2 w-full max-w-sm lg:max-w-none mx-auto">
          {/* NEW ADDITION END */}
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 1,
                delay: 0.1,
                ease: [0.22, 1, 0.36, 1] as const,
              }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: "1000px" }}
              data-cursor="interactive"
              // BUG FIX START - Removed layout properties that were transferred to the ElementVacuumEffect wrapper
              className="relative aspect-square w-full select-none"
              // BUG FIX END
            >
              {/* Corner Tech Bracket Accents */}
              {[
                "top-0 left-0 border-t border-l rounded-tl-md",
                "top-0 right-0 border-t border-r rounded-tr-md",
                "bottom-0 left-0 border-b border-l rounded-bl-md",
                "bottom-0 right-0 border-b border-r rounded-br-md",
              ].map((cls, i) => (
                <div
                  key={i}
                  className={`absolute w-5 h-5 border-primary/40 z-20 pointer-events-none ${cls}`}
                  style={{ margin: "-6px" }}
                />
              ))}

              {/* 3D Tilt Wrapper */}
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isHovered ? 1.025 : 1})`,
                  transition: isHovered
                    ? "transform 0.1s ease-out"
                    : "transform 0.65s cubic-bezier(0.22,1,0.36,1)",
                  transformStyle: "preserve-3d",
                  position: "relative",
                }}
              >
                {/* Offset Decorative Background Card (The rotated shadow box) */}
                <div
                  style={{ transformStyle: "preserve-3d" }}
                  className="absolute inset-0 bg-black rounded-3xl rotate-[3deg] opacity-50"
                />

                {/* Main Foreground Card Surface */}
                <div
                  className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl shadow-blue-900/60 flex items-end justify-center bg-black"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    transformStyle: "preserve-3d",
                    padding: "4rem 2rem 0",
                  }}
                >
                  {/* Top Edge Shimmer Effect */}
                  <div
                    className="absolute top-0 inset-x-0 h-px pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                    }}
                  />

                  {/* Ambient Color Blobs inside the card */}
                  <div
                    className="absolute top-1/4 -right-10 w-48 h-48 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(160,0,255,0.08) 0%, transparent 70%)",
                      filter: "blur(24px)",
                    }}
                  />
                  <div
                    className="absolute bottom-1/3 -left-8 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(0,220,255,0.07) 0%, transparent 70%)",
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Interactive Light Glare that moves with the mouse */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at ${50 + tilt.y * 2.5}% ${50 - tilt.x * 2.5}%, rgba(255,255,255,0.055) 0%, transparent 58%)`,
                      borderRadius: "inherit",
                      pointerEvents: "none",
                      transition: isHovered
                        ? "background 0.1s ease-out"
                        : "background 0.65s ease-out",
                      zIndex: 10,
                    }}
                  />

                  {/* Profile Image Subject */}
                  <img
                    src="/Profile.svg"
                    alt="Ivan Clement P. Cañete"
                    draggable={false}
                    className="relative w-full h-full object-contain object-bottom origin-bottom drop-shadow-[0_20px_20px_rgba(255,255,255,0.15)] z-0 select-none pointer-events-none"
                    style={{ zIndex: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          {/* NEW ADDITION START */}
          </ElementVacuumEffect>
          {/* NEW ADDITION END */}

        </div>
      </div>
    </section>
  );
}