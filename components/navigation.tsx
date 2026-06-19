"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export function Navigation() {
  const pathname = usePathname();
  const isProjectsPage = pathname === "/projects";

  // Track scroll position for hide/show logic
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastYPos, setLastYPos] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrollingDown = latest > lastYPos;

    // Hide the navbar if we are scrolling down and have scrolled past 50px
    if (isScrollingDown && latest > 50) {
      setHidden(true);
    } else {
      // Show the navbar if we are scrolling up or at the very top
      setHidden(false);
    }

    setLastYPos(latest);
  });

  return (
    <motion.nav
      // Define the two states: visible (dropped down) and hidden (slid up)
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut"} }
      // Updated styling for a premium frosted glass effect that separates from the background
      /* BUG FIX START: Swapped shadow back to your primary-secondary color as requested */
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200/20 shadow-lg shadow-primary-secondary/10"
      /* BUG FIX END */
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
        {/* Left side - Logo or Back button */}
        {isProjectsPage ? (
          /* ANIMATION UPDATE START: Transformed Link wrapper into an interactive motion container for smooth directional arrow sliding */
          <motion.div
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/"
              /* BUG FIX START: Bypassed CSS variables and forced standard Tailwind orange */
              className="inline-flex items-center gap-3 text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none focus-visible:text-neutral-base transition-colors duration-300"
              /* BUG FIX END */
            >
              <motion.div
                variants={{
                  initial: { x: 0 },
                  hover: { x: -4 }
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              <span className="text-sm tracking-wide">Back</span>
            </Link>
          </motion.div>
          /* ANIMATION UPDATE END */
        ) : (
          /* BUG FIX START: Changed Next.js Link to a standard anchor tag to force a full browser reload ("restart") */
          <a
            href="/"
            className="text-neutral-base font-serif text-xl tracking-tight"
          >
            ICC
          </a>
          /* BUG FIX END */
        )}

        {/* Right side - Navigation links (only on landing page) */}
        {!isProjectsPage && (
          <div className="flex items-center gap-8">
            {/* ANIMATION ADDITION START: Transformed standard anchors/links into Framer Motion elements to handle hover lines and click transitions across all viewports */}
            <motion.a
              href="#about"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              /* BUG FIX START: Bypassed CSS variables and forced standard Tailwind orange */
              className="relative text-sm text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none focus-visible:text-neutral-base transition-colors duration-300 tracking-wide pb-1"
              /* BUG FIX END */
            >
              About
              <motion.span
                variants={{
                  initial: { scaleX: 0 },
                  hover: { scaleX: 1 }
                }}
                initial="initial"
                transition={{ duration: 0.2, ease: "easeOut" }}
                /* BUG FIX START: Forced background to standard Tailwind orange */
                className="absolute left-0 bottom-0 right-0 h-[2px] bg-orange-500 origin-center"
                /* BUG FIX END */
              />
            </motion.a>
            <motion.div
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              className="relative pb-1"
            >
              <Link
                href="/projects"
                /* BUG FIX START: Bypassed CSS variables and forced standard Tailwind orange */
                className="text-sm text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none focus-visible:text-neutral-base transition-colors duration-300 tracking-wide"
                /* BUG FIX END */
              >
                Projects
              </Link>
              <motion.span
                variants={{
                  initial: { scaleX: 0 },
                  hover: { scaleX: 1 }
                }}
                initial="initial"
                transition={{ duration: 0.2, ease: "easeOut" }}
                /* BUG FIX START: Forced background to standard Tailwind orange */
                className="absolute left-0 bottom-0 right-0 h-[2px] bg-orange-500 origin-center"
                /* BUG FIX END */
              />
            </motion.div>
            <motion.a
              href="#contact"
              whileHover="hover"
              whileTap={{ scale: 0.95 }}
              /* BUG FIX START: Bypassed CSS variables and forced standard Tailwind orange */
              className="relative text-sm text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none focus-visible:text-neutral-base transition-colors duration-300 tracking-wide pb-1"
              /* BUG FIX END */
            >
              Contact
              <motion.span
                variants={{
                  initial: { scaleX: 0 },
                  hover: { scaleX: 1 }
                }}
                initial="initial"
                transition={{ duration: 0.2, ease: "easeOut" }}
                /* BUG FIX START: Forced background to standard Tailwind orange */
                className="absolute left-0 bottom-0 right-0 h-[2px] bg-orange-500 origin-center"
                /* BUG FIX END */
              />
            </motion.a>
            {/* ANIMATION ADDITION END */}
          </div>
        )}
      </div>
    </motion.nav>
  );
}