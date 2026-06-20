"use client";

import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";
import { usePageTransition } from "./transition.provider";

export function Navigation() {
  const pathname = usePathname();
  const isProjectsPage = pathname === "/projects";
  const { navigate } = usePageTransition();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastYPos, setLastYPos] = useState(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const isScrollingDown = latest > lastYPos;
    if (isScrollingDown && latest > 50) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    setLastYPos(latest);
  });

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-neutral-200/20 shadow-lg shadow-brand-blue-dark/10 select-none"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
        {isProjectsPage ? (
          // Back button — triggers transition back to home
          <motion.div
            initial="initial"
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
          >
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center gap-3 text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none transition-colors duration-300"
            >
              <motion.div
                variants={{ initial: { x: 0 }, hover: { x: -4 } }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <ArrowLeft className="w-4 h-4" />
              </motion.div>
              <span className="text-sm tracking-wide">Back</span>
            </button>
          </motion.div>
        ) : (
          // Logo — plain anchor, no transition needed (same page)
          <a
            href="/"
            draggable={false}
            className="text-neutral-base font-serif text-xl tracking-tight origin-left inline-block"
          >
            ICC
          </a>
        )}

        {!isProjectsPage && (
          <div className="flex items-center gap-8 select-none">
            {/* About — hash link, no transition needed */}
            <motion.a
              href="#about"
              draggable={false}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative text-sm text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none transition-colors duration-300 tracking-wide pb-1"
            >
              About
              <motion.span
                variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }}
                initial="initial"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-0 bottom-0 right-0 h-[2px] bg-orange-500 origin-center"
              />
            </motion.a>

            {/* Projects — triggers the wipe transition */}
            <motion.div
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative pb-1"
            >
              <button
                onClick={() => navigate("/projects")}
                className="text-sm text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none transition-colors duration-300 tracking-wide"
              >
                Projects
              </button>
              <motion.span
                variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }}
                initial="initial"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-0 bottom-0 right-0 h-[2px] bg-orange-500 origin-center"
              />
            </motion.div>

            {/* Contact — hash link, no transition needed */}
            <motion.a
              href="#contact"
              draggable={false}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="relative text-sm text-neutral-base hover:text-orange-500 active:text-orange-600 focus:outline-none transition-colors duration-300 tracking-wide pb-1"
            >
              Contact
              <motion.span
                variants={{ initial: { scaleX: 0 }, hover: { scaleX: 1 } }}
                initial="initial"
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute left-0 bottom-0 right-0 h-[2px] bg-orange-500 origin-center"
              />
            </motion.a>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
