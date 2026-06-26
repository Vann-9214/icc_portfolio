"use client";

import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { usePageTransition } from "./transition.provider";

export function Navigation() {
  const pathname = usePathname();
  const isProjectsPage = pathname === "/projects";
  const { navigate } = usePageTransition();

  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [lastYPos, setLastYPos] = useState(0);

  const { theme, setTheme } = useTheme();
  // Defer rendering the theme toggle until client hydration to avoid mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Hide the nav when scrolling down, reveal it when scrolling back up
  useMotionValueEvent(scrollY, "change", (y) => {
    if (y > lastYPos && y > 80) setHidden(true);
    else setHidden(false);
    setLastYPos(y);
  });

  // Shared class for all nav links — brand blue hover with animated underline
  const navLinkClass =
    "relative group text-[10px] md:text-sm uppercase tracking-wide pb-0.5 md:pb-1 text-foreground hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] active:!text-[#0F42A9] transition-all duration-300 focus:outline-none";

  return (
    <motion.nav
      variants={{
        visible: { y: 0, opacity: 1 },
        hidden: { y: "-100%", opacity: 0 },
      }}
      initial="visible"
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-transparent"
    >
      <div className="w-full mx-auto px-6 md:px-12 lg:px-18 xl:px-22 py-4 flex items-start md:items-center justify-between">

        {/* Left side: brand logo on home, back button on /projects */}
        {isProjectsPage ? (
          <motion.div initial="initial">
            <button
              onClick={() => navigate("/")}
              className="relative group inline-flex cursor-pointer items-center gap-3 text-foreground hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] active:!text-[#0F42A9] transition-all duration-300 focus:outline-none pb-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm tracking-wide">Back</span>
              <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
            </button>
          </motion.div>
        ) : (
          <a
            href="/"
            className="text-foreground font-serif text-lg md:text-xl tracking-tight hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-all duration-300"
          >
            ICC
          </a>
        )}

        {/* Right side: nav links + theme toggle */}
        <div className="flex items-center gap-4 md:gap-8">
          {!isProjectsPage && (
            <div className="flex flex-col md:flex-row items-end md:items-center gap-1 md:gap-14">

              <a href="#about" className={navLinkClass}>
                About
                <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>

              <div className="relative group pb-0.5 md:pb-1">
                <button
                  onClick={() => navigate("/projects")}
                  className="cursor-pointer bg-transparent border-none p-0 text-[10px] md:text-sm uppercase tracking-wide text-foreground hover:!text-[#0F42A9] hover:drop-shadow-[0_0_8px_rgba(15,66,169,0.6)] active:!text-[#0F42A9] transition-all duration-300 focus:outline-none"
                >
                  Projects
                </button>
                <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </div>

              <a href="#contact" className={navLinkClass}>
                Contact
                <span className="absolute left-0 bottom-0 h-[2px] w-full origin-left scale-x-0 bg-[#0F42A9] shadow-[0_0_8px_rgba(15,66,169,0.6)] transition-transform duration-300 ease-out group-hover:scale-x-100" />
              </a>

            </div>
          )}

          {/* Theme toggle — deferred until mounted to prevent hydration mismatch */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="flex items-center justify-center p-2 rounded-md bg-zinc-200 dark:bg-zinc-800 text-foreground hover:!text-[#0F42A9] transition-all duration-300 focus:outline-none"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                </svg>
              )}
            </button>
          )}
        </div>

      </div>
    </motion.nav>
  );
}
