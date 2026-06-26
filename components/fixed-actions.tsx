"use client";

import { motion } from "framer-motion";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Download } from "lucide-react";
import { HERO_DATA } from "@/lib/data";

export function FixedActions() {
  return (
    <>
      {/* Social Links Oval (Hidden on Mobile) */}
      <div
        data-cursor="interactive"
        className="hidden md:flex group cursor-default fixed bottom-10 left-10 z-[90] items-center gap-5 px-5 py-3 bg-foreground/5 backdrop-blur-xl border border-foreground/10 rounded-full shadow-lg pointer-events-auto transition-all duration-500 hover:bg-[#0F42A9] hover:border-[#0F42A9] hover:shadow-[0_0_25px_rgba(15,66,169,0.6)]"
      >
        {/* BUG FIX START - Removed draggable={false} */}
        <a
          href={HERO_DATA.socials.github.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-base group-hover:text-white transition-all duration-300 hover:scale-125 hover:-rotate-12 active:scale-95 cursor-pointer"
          aria-label="GitHub"
        >
        {/* BUG FIX END */}
          <GitHubLogoIcon className="w-5 h-5" />
        </a>

        {/* Small subtle divider that fades slightly when oval is blue */}
        <div className="w-px h-4 bg-white/20 group-hover:bg-white/40 transition-colors duration-500 pointer-events-none" />

        {/* BUG FIX START - Removed draggable={false} */}
        <a
          href={HERO_DATA.socials.linkedin.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-neutral-base group-hover:text-white transition-all duration-300 hover:scale-125 hover:rotate-12 active:scale-95 cursor-pointer"
          aria-label="LinkedIn"
        >
        {/* BUG FIX END */}
          <LinkedInLogoIcon className="w-5 h-5" />
        </a>
      </div>

      {/* Resume Button Container */}
      {/* NEW ADDITION START - Adjusted right-6 to right-2 for far-right placement on mobile */}
      <div className="fixed bottom-6 right-2 md:bottom-10 md:right-10 z-[90] pointer-events-auto">
      {/* NEW ADDITION END */}
        <motion.div
          initial="initial"
          whileHover="hover"
          className="relative cursor-default"
          data-cursor="interactive"
        >
          {/* Desktop-only: Glowing blue blur expanding behind the button on hover */}
          <motion.div
            variants={{
              initial: { opacity: 0, scale: 0.8 },
              hover: { opacity: 0.6, scale: 1.15 }
            }}
            transition={{ duration: 0.3 }}
            className="hidden md:block absolute inset-0 bg-[#0F42A9] blur-[20px] pointer-events-none rounded-full z-0"
          />

          {/* The Button element */}
          {/* BUG FIX START - Removed draggable={false} */}
          <motion.a
            href={HERO_DATA.socials.resume.url}
            download
            className="group relative flex flex-col md:flex-row items-center justify-center gap-2 md:gap-2.5 md:px-5 md:py-3 md:bg-foreground/10 md:backdrop-blur-md md:border md:border-foreground/10 md:rounded-full md:shadow-lg overflow-hidden transition-all duration-300 outline-none cursor-pointer text-foreground/60 md:hover:text-white md:hover:-translate-y-1"
          >
          {/* BUG FIX END */}
            {/* Desktop-only: Full solid blue color fill sliding up smoothly */}
            <motion.div
              variants={{
                initial: { y: "100%" },
                hover: { y: 0 }
              }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="hidden md:block absolute inset-0 bg-[#0F42A9] z-0"
            />
            
            {/* Desktop-only: Cool sweeping shine animation moving across the button */}
            <motion.div
              variants={{
                initial: { x: "-100%", opacity: 0 },
                hover: { 
                  x: "200%", 
                  opacity: 0.3, 
                  transition: { repeat: Infinity, duration: 1.2, ease: "linear", delay: 0.1 } 
                }
              }}
              className="hidden md:block absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-white to-transparent skew-x-12 z-0"
            />

            {/* Icon - Visible on both Mobile and Desktop */}
            <motion.div
              variants={{
                initial: { y: 0 },
                hover: { y: [0, -3, 0], transition: { repeat: Infinity, duration: 0.6, ease: "easeInOut" } }
              }}
              className="relative z-10 flex items-center justify-center"
            >
              <Download className="w-4 h-4 md:w-4 md:h-4 transition-colors duration-300 group-hover:text-neutral-300 md:group-hover:text-white" />
            </motion.div>

            {/* Desktop: Horizontal Text */}
            <span className="hidden md:block font-mono text-xs uppercase tracking-[0.15em] font-medium relative z-10 transition-colors duration-300">
              {HERO_DATA.socials.resume.label}
            </span>

            {/* Mobile: Vertical Text */}
            {/* NEW ADDITION START - Added mt-2 to give extra space inside between icon and text */}
            <span className="block md:hidden font-mono text-[10px] uppercase tracking-[0.15em] font-medium [writing-mode:vertical-rl] rotate-180 relative z-10 transition-colors duration-300 group-hover:text-neutral-300 mt-2">
            {/* NEW ADDITION END */}
              {HERO_DATA.socials.resume.label}
            </span>
          </motion.a>
        </motion.div>
      </div>
    </>
  );
}