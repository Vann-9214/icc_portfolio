"use client";

import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { HERO_DATA, SPECIALTIES } from "@/lib/data";
import { ElementVacuumEffect } from "./animations/vacuum-scroll";
import { useLoaderFinished } from "@/hooks/use-loader-finished";

// Staggered fade-in variants for the left column text blocks
const stagger = {
  container: {
    hidden: {},
    show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
  },
  item: {
    hidden: { opacity: 0, y: 60 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const },
    },
  },
};

export function HeroSection() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Hold animations until the intro loader finishes so they sync with the cursor reveal
  const isLoaded = useLoaderFinished();

  // Defer theme reading until after hydration to avoid SSR mismatch
  const { resolvedTheme } = useTheme();
  const [themeMounted, setThemeMounted] = useState(false);
  useEffect(() => { setThemeMounted(true); }, []);
  const isDark = themeMounted && resolvedTheme === "dark";

  // Card colors invert per mode: light bg → black card, dark bg → white card
  const cardBg        = isDark ? "#f0f4ff"                : "#08090f";
  const cardBorder    = isDark ? "rgba(15,66,169,0.14)"   : "rgba(255,255,255,0.07)";
  const cardShadow    = isDark ? "shadow-blue-300/40"      : "shadow-blue-900/60";
  const shadowBoxBg   = isDark ? "bg-[#0F42A9]/20"        : "bg-black/70";
  const blobPurple    = isDark ? "rgba(99,0,255,0.06)"    : "rgba(160,0,255,0.09)";
  const blobCyan      = isDark ? "rgba(15,66,169,0.10)"   : "rgba(0,220,255,0.08)";
  const shimmerLine   = isDark
    ? "linear-gradient(90deg, transparent 0%, rgba(15,66,169,0.25) 50%, transparent 100%)"
    : "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)";
  const glareColor    = isDark ? "rgba(15,66,169,0.045)"  : "rgba(255,255,255,0.055)";
  const imgDropShadow = isDark
    ? "drop-shadow-[0_20px_28px_rgba(15,66,169,0.22)]"
    : "drop-shadow-[0_20px_20px_rgba(255,255,255,0.12)]";

  // Calculates the 3D tilt angle from the mouse position relative to the card center
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

  // Resets the card to flat when the mouse leaves
  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 pt-26 md:pt-22 pb-16 bg-transparent overflow-hidden">
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-10 lg:gap-20 items-center">

          {/* Left Column: Text */}
          <ElementVacuumEffect className="order-2 lg:order-1">
            <motion.div
              variants={stagger.container}
              initial="hidden"
              animate={isLoaded ? "show" : "hidden"}
              className="relative space-y-7 select-none"
            >
              {/* Radial glow behind the text — matches the page bg per theme */}
              <div
                className="absolute pointer-events-none -z-10 dark:[--glow-color:rgba(9,9,11,1)] dark:[--glow-color-mid:rgba(9,9,11,0.7)] [--glow-color:rgba(255,255,255,1)] [--glow-color-mid:rgba(255,255,255,0.7)]"
                style={{
                  inset: "-80px -100px",
                  background:
                    "radial-gradient(ellipse 70% 75% at 42% 48%, var(--glow-color) 25%, var(--glow-color-mid) 55%, transparent 100%)",
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

              {/* Description */}
              <motion.p
                variants={stagger.item}
                className="text-neutral-base text-base md:text-lg leading-relaxed max-w-[42ch]"
              >
                {HERO_DATA.description}
              </motion.p>

              {/* Specialty Pills */}
              <motion.div variants={stagger.item} className="flex flex-wrap gap-2">
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

              {/* Animated horizontal divider */}
              <motion.div variants={stagger.item} className="overflow-hidden">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
                  style={{ originX: 0 }}
                  className="h-px bg-gradient-to-r from-border via-border/50 to-transparent"
                />
              </motion.div>
            </motion.div>
          </ElementVacuumEffect>

          {/* Right Column: 3D Profile Card */}
          <ElementVacuumEffect className="order-1 lg:order-2 w-full max-w-sm lg:max-w-none mx-auto">
            <motion.div
              ref={cardRef}
              initial={{ opacity: 0, scale: 0.93 }}
              animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.93 }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] as const }}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={handleMouseLeave}
              style={{ perspective: "1000px" }}
              data-cursor="interactive"
              className="relative aspect-square w-full select-none"
            >
              {/* Corner bracket accents at each corner of the card */}
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

              {/* 3D tilt wrapper — applies rotateX/Y and subtle scale on hover */}
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
                  willChange: "transform",
                }}
              >
                {/* Rotated shadow box behind the card for depth */}
                <div
                  style={{ transformStyle: "preserve-3d" }}
                  className={`absolute inset-0 rounded-3xl rotate-[3deg] opacity-50 ${shadowBoxBg}`}
                />

                {/* Main card surface */}
                <div
                  className={`absolute inset-0 rounded-2xl overflow-hidden shadow-2xl ${cardShadow} flex items-end justify-center`}
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${cardBorder}`,
                    transformStyle: "preserve-3d",
                    padding: "4rem 2rem 0",
                  }}
                >
                  {/* Shimmer line along the top edge */}
                  <div
                    className="absolute top-0 inset-x-0 h-px pointer-events-none"
                    style={{ background: shimmerLine }}
                  />

                  {/* Ambient color blobs — purple top-right, cyan bottom-left */}
                  <div
                    className="absolute top-1/4 -right-10 w-48 h-48 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${blobPurple} 0%, transparent 70%)`,
                      filter: "blur(24px)",
                    }}
                  />
                  <div
                    className="absolute bottom-1/3 -left-8 w-40 h-40 rounded-full pointer-events-none"
                    style={{
                      background: `radial-gradient(circle, ${blobCyan} 0%, transparent 70%)`,
                      filter: "blur(20px)",
                    }}
                  />

                  {/* Brand-blue bottom wash — only on dark bg (white card) */}
                  {isDark && (
                    <div
                      className="absolute inset-x-0 bottom-0 h-1/3 pointer-events-none"
                      style={{
                        background: "linear-gradient(to top, rgba(15,66,169,0.07) 0%, transparent 100%)",
                      }}
                    />
                  )}

                  {/* Glare highlight that follows mouse tilt */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: `radial-gradient(circle at ${50 + tilt.y * 2.5}% ${50 - tilt.x * 2.5}%, ${glareColor} 0%, transparent 58%)`,
                      borderRadius: "inherit",
                      pointerEvents: "none",
                      transition: isHovered ? "background 0.1s ease-out" : "background 0.65s ease-out",
                      zIndex: 10,
                    }}
                  />

                  {/* Profile image */}
                  <img
                    src="/Profile.svg"
                    alt="Ivan Clement P. Cañete"
                    draggable={false}
                    className={`relative w-full h-full object-contain object-bottom origin-bottom z-0 select-none pointer-events-none ${imgDropShadow}`}
                    style={{ zIndex: 1 }}
                  />
                </div>
              </div>
            </motion.div>
          </ElementVacuumEffect>

        </div>
      </div>
    </section>
  );
}
