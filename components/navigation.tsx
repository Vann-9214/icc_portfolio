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

  // BUG FIX START - Changed text hover and drop-shadow glow from orange to brand blue
  const navLinkClass =
    "relative group text-[10px] md:text-sm uppercase tracking-wide pb-0.5 md:pb-1 text-black visited:text-black hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] active:!text-[#0F42A9] transition-all duration-300 focus:outline-none";
  // BUG FIX END

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      // BUG FIX START - Removed redundant select-none
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
      // BUG FIX END
    >
      <div className="w-full mx-auto px-6 md:px-12 lg:px-18 xl:px-22 py-4 flex items-start md:items-center justify-between">
        {isProjectsPage ? (
          <motion.div
            initial="initial"
          >
            {/* BUG FIX START - Changed Back button text hover and underline color to brand blue */}
            <button
              onClick={() => navigate("/")}
              className="relative group inline-flex cursor-pointer items-center gap-3 text-black hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] active:!text-[#0F42A9] transition-all duration-300 focus:outline-none pb-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm tracking-wide">Back</span>
              <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </button>
            {/* BUG FIX END */}
          </motion.div>
        ) : (
          // BUG FIX START - Removed draggable={false}
          <a
            href="/"
            className="text-black font-serif text-lg md:text-xl tracking-tight hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-all duration-300"
          >
          // BUG FIX END
            ICC
          </a>
        )}

        {!isProjectsPage && (
          <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-14">
            {/* About */}
            {/* BUG FIX START - Removed draggable={false} */}
            <a
              href="#about"
              className={navLinkClass}
            >
            {/* BUG FIX END */}
              About
              {/* BUG FIX START - Changed underline and shadow color to brand blue */}
              <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              {/* BUG FIX END */}
            </a>

            {/* Projects */}
            <div
              className="relative group pb-0.5 md:pb-1"
            >
              <button
                onClick={() => navigate("/projects")}
                // BUG FIX START - Changed Projects hover text and glow to brand blue
                className="cursor-pointer bg-transparent border-none p-0 text-[10px] md:text-sm uppercase tracking-wide text-black hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] active:!text-[#0F42A9] transition-all duration-300 focus:outline-none"
                // BUG FIX END
              >
                Projects
              </button>

              {/* BUG FIX START - Changed underline and shadow color to brand blue */}
              <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              {/* BUG FIX END */}
            </div>

            {/* Contact */}
            {/* BUG FIX START - Removed draggable={false} */}
            <a
              href="#contact"
              className={navLinkClass}
            >
            {/* BUG FIX END */}
              Contact
              {/* BUG FIX START - Changed underline and shadow color to brand blue */}
              <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              {/* BUG FIX END */}
            </a>
          </div>
        )}
      </div>
    </motion.nav>
  );
}