// components/background-blobs.tsx
"use client";

import { motion } from "framer-motion";

export function BackgroundBlobs() {
  return (
    // BUG FIX START - Changed z-index to z-[-1] to ensure it sits safely behind content but in front of the base body background color.
    <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none">
    // BUG FIX END
      
      {/* NEW ADDITION START - Brand Blue Ambient Glow */}
      <motion.div 
        animate={{
          x: [0, 40, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-[#0F42A9] opacity-[0.12] blur-[90px] md:blur-[128px]" 
      />
      {/* NEW ADDITION END */}

      {/* NEW ADDITION START - Orange Accent Glow */}
      <motion.div 
        animate={{
          x: [0, -30, 0],
          y: [0, -50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-[-10%] right-[-10%] w-[45vw] h-[45vw] max-w-[500px] max-h-[500px] rounded-full bg-orange-500 opacity-[0.08] blur-[90px] md:blur-[128px]" 
      />
      {/* NEW ADDITION END */}
    </div>
  );
}