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
      transition={{ duration: 0.3, ease: "easeInOut" }}
      // Updated styling for a premium frosted glass effect that separates from the background
      className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10 shadow-2xl"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
        {/* Left side - Logo or Back button */}
        {isProjectsPage ? (
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wide">Back</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="text-foreground font-serif text-xl tracking-tight"
          >
            ICC
          </Link>
        )}

        {/* Right side - Navigation links (only on landing page) */}
        {!isProjectsPage && (
          <div className="flex items-center gap-8">
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-white transition-colors duration-300 tracking-wide"
            >
              About
            </a>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-white transition-colors duration-300 tracking-wide"
            >
              Projects
            </Link>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-white transition-colors duration-300 tracking-wide"
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
