"use client";

import { motion } from "framer-motion";

// Slow-floating ambient glows fixed behind all page content
export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">

      {/* Brand blue glow — top-left, drifts slowly */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#0F42A9] opacity-[0.12] blur-[60px] md:blur-[128px]"
        style={{ willChange: "transform" }}
      />

      {/* Orange accent glow — bottom-right, drifts on a different cycle */}
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, -50, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-orange-500 opacity-[0.08] blur-[60px] md:blur-[128px]"
        style={{ willChange: "transform" }}
      />

    </div>
  );
}
