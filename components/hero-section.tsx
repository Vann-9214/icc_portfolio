"use client";

import { motion } from "framer-motion";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Download, ArrowDown, Cpu, Code2, Gamepad2, Wifi } from "lucide-react";
import { useRef, useState } from "react";

const SPECIALTIES = [
  {
    label: "Hardware",
    icon: Cpu,
    style: "text-amber-700 border-amber-700/30 bg-amber-700/10",
    dot: "bg-amber-700",
  },
  {
    label: "Software",
    icon: Code2,
    style: "text-blue-700 border-blue-700/30 bg-blue-700/10",
    dot: "bg-blue-700",
  },
  {
    label: "Game Dev",
    icon: Gamepad2,
    style: "text-purple-700 border-purple-700/30 bg-purple-700/10",
    dot: "bg-purple-700",
  },
  {
    label: "IoT",
    icon: Wifi,
    style: "text-teal-700 border-teal-700/30 bg-teal-700/10",
    dot: "bg-teal-700",
  },
];

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

  function handleMouseLeave() {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6 md:px-12 lg:px-24 pt-20 pb-16 bg-transparent overflow-hidden">
      <div className="w-full max-w-6xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-[1fr_420px] xl:grid-cols-[1fr_480px] gap-10 lg:gap-20 items-center">
          <motion.div
            /* ── Left Column ── */
            variants={stagger.container}
            initial="hidden"
            animate="show"
            className="relative space-y-7 order-2 lg:order-1 select-none"
          >
            <div
              /* Soft glow behind left column — filter:blur on own pixels, no hard clip edge */
              className="absolute pointer-events-none -z-10"
              style={{
                inset: "-80px -100px",
                background:
                  "radial-gradient(ellipse 70% 75% at 42% 48%, rgba(255,255,255,1) 25%, rgba(255,255,255,0.7) 55%, transparent 100%)",
                filter: "blur(18px)",
              }}
            />

            <motion.div /* Name + role */ variants={stagger.item} className="space-y-3">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-serif leading-[1.05] tracking-tight">
                <span /* COLOR UPDATE: Applied primary orange */ className="text-primary-base">Ivan Clement</span>
                <br />
                <span /* COLOR UPDATE: Applied complementary dark blue */ className="text-primary-secondary">Cañete</span>
              </h1>
              <div className="flex items-center gap-3 pt-1">
                <span /* COLOR UPDATE: Switched to neutral black */ className="block h-px w-6 bg-neutral-base shrink-0" />
                <p /* COLOR UPDATE: Switched to neutral black */ className="text-xs font-mono tracking-[0.2em] text-neutral-base uppercase">
                  Computer Engineering Student
                </p>
              </div>
            </motion.div>

            <motion.p
              /* Description */
              /* COLOR UPDATE: Switched description text to neutral black */
              variants={stagger.item}
              className="text-neutral-base text-base md:text-lg leading-relaxed max-w-[42ch]"
            >
              Building complex systems from the ground up — engineering
              everything from physical circuits to polished web interfaces.
            </motion.p>

            <motion.div
              /* Specialty pills */
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

            <motion.div /* Divider */ variants={stagger.item} className="overflow-hidden">
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

            <motion.div
              /* Action Buttons */
              variants={stagger.item}
              className="flex flex-wrap gap-3"
            >
              <a
                /* COLOR UPDATE: Switched button text to neutral black */
                href="https://github.com/Vann-9214"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 border border-border rounded-full text-neutral-base text-sm hover:border-neutral-base/30 hover:bg-neutral-base/[0.06] hover:shadow-sm active:scale-[0.97] transition-all duration-200 backdrop-blur-xl bg-white/[0.04]"
              >
                <GitHubLogoIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                @Vann-9214
              </a>
              <a
                /* COLOR UPDATE: Switched button text to neutral black */
                href="https://www.linkedin.com/in/ivan-canete/"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2.5 px-5 py-2.5 border border-border rounded-full text-neutral-base text-sm hover:border-neutral-base/30 hover:bg-neutral-base/[0.06] hover:shadow-sm active:scale-[0.97] transition-all duration-200 backdrop-blur-xl bg-white/[0.04]"
              >
                <LinkedInLogoIcon className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                LinkedIn
              </a>
              <a
                href="/Ivan Cañete, Resume.pdf"
                download
                className="group inline-flex items-center gap-2.5 px-6 py-2.5 bg-neutral-base text-white rounded-full text-sm font-medium hover:bg-orange-500 active:bg-orange-600 active:scale-[0.97] transition-all duration-300 shadow-md hover:shadow-lg shadow-neutral-base/20 hover:shadow-orange-500/25"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform duration-200" />
                Resume
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            /* ── Right Column — Profile Card ── */
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
            className="relative aspect-square w-full max-w-sm lg:max-w-none mx-auto order-1 lg:order-2 cursor-pointer select-none"
          >
            {[ /* Tech-bracket corner accents */
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

            <div
              /* Tilt wrapper */
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
              <div
                /* Offset decorative card */
                style={{ transformStyle: "preserve-3d" }}
                /* BUG FIX START: Changed offset card background from black (zinc-900) to primary-secondary */
                className="absolute inset-0 bg-neutral-base rounded-3xl rotate-[3deg] opacity-50"
                /* BUG FIX END */
              />

              <div
                /* Main card surface */
                /* BUG FIX START: Added bg-primary-secondary class to replace the hardcoded black gradient */
                className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl flex items-end justify-center bg-neutral-base"
                /* BUG FIX END */
                style={{
                  /* BUG FIX START: Removed the hardcoded black linear-gradient background */
                  border: "1px solid rgba(255,255,255,0.08)",
                  transformStyle: "preserve-3d",
                  padding: "4rem 2rem 0",
                  /* BUG FIX END */
                }}
              >
                <div
                  /* Top edge shimmer */
                  className="absolute top-0 inset-x-0 h-px pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.18) 50%, transparent 100%)",
                  }}
                />

                <div
                  /* Ambient color blobs inside card */
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

                <div
                  /* Glare */
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

                <img
                  /* Profile image */
                  src="/Profile.svg"
                  alt="Ivan Clement P. Cañete"
                  className="relative w-full h-full object-contain object-bottom origin-bottom drop-shadow-2xl z-0"
                  style={{ zIndex: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        /* Scroll indicator */
        /* COLOR UPDATE: Switched indicator text to neutral black with an opacity modifier */
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-neutral-base/60 pointer-events-none"
      >
        <span className="text-[10px] font-mono tracking-[0.25em] uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown className="w-3.5 h-3.5" />
        </motion.div>
      </motion.div>
    </section>
  );
}