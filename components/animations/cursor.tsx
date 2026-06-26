"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

// Blue ring color per theme — always reads as blue regardless of bg
const CURSOR_LIGHT = "#0F42A9"; // brand blue — visible on light bg
const CURSOR_DARK  = "#60a5fa"; // blue-400  — visible on dark bg

export function Cursor() {
  const [initialPos, setInitialPos] = useState<{ x: number; y: number } | null>(null);
  const [hasMouse, setHasMouse] = useState(false);
 
  useEffect(() => {
    const mql = window.matchMedia("(hover: hover) and (pointer: fine)");
    setHasMouse(mql.matches);
 
    const handleMediaChange = (e: MediaQueryListEvent) => {
      setHasMouse(e.matches);
    };
    mql.addEventListener("change", handleMediaChange);
 
    const handleFirstMove = (e: MouseEvent) => {
      setInitialPos({ x: e.clientX - 20, y: e.clientY - 20 });
    };
    window.addEventListener("mousemove", handleFirstMove, { once: true });
    return () => {
      window.removeEventListener("mousemove", handleFirstMove);
      mql.removeEventListener("change", handleMediaChange);
    };
  }, []);
 
  if (!hasMouse) return null;
  if (!initialPos) return null;
 
  return <ActiveCursor initialPos={initialPos} />;
}

function ActiveCursor({ initialPos }: { initialPos: { x: number; y: number } }) {
  const cursorX = useMotionValue(initialPos.x);
  const cursorY = useMotionValue(initialPos.y);

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Watch the .dark class on <html> — same source of truth as next-themes
  const [isDark, setIsDark] = useState(false);

  const springConfig = { damping: 25, stiffness: 800 };

  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const checkLoader = setInterval(() => {
      const loader = document.getElementById("intro-loader");
      if (!loader || loader.getAttribute("data-fading") === "true") {
        setIsLoading(false);
        if (!loader) clearInterval(checkLoader);
      }
    }, 100);
    return () => clearInterval(checkLoader);
  }, []);

  // Observe <html class> for dark/light changes without useTheme
  useEffect(() => {
    const html = document.documentElement;
    // Set initial value
    setIsDark(html.classList.contains("dark"));
    const observer = new MutationObserver(() => {
      setIsDark(html.classList.contains("dark"));
    });
    observer.observe(html, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };

    const handleMouseInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = !!target.closest(
        "button, a, input, [data-cursor='interactive']"
      );
      setIsHovered(isInteractive);
    };

    window.addEventListener("mousemove", moveCursor);
    window.addEventListener("mouseover", handleMouseInteraction);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mouseover", handleMouseInteraction);
    };
  }, [cursorX, cursorY]);

  const color = isDark ? CURSOR_DARK : CURSOR_LIGHT;
  const glowFilter = isDark
    ? "drop-shadow(0 0 24px rgba(96, 165, 250, 0.6))"
    : "drop-shadow(0 0 24px rgba(15, 66, 169, 0.5))";

  return (
    <motion.div
      className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9999]"
      initial={{ opacity: 0 }}
      animate={{
        scale: isHovered ? 0 : 1,
        opacity: isLoading ? 0 : isDark ? 1 : 0.45,
        backgroundColor: color,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        opacity: { duration: 0.3, ease: "easeInOut" },
        backgroundColor: { duration: 0.3, ease: "easeInOut" },
      }}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        // dark mode: "difference" inverts text beneath the cursor (text shows through)
        // light mode: no blend mode — cursor stays pure blue without turning yellow
        mixBlendMode: isDark ? "difference" : "normal",
        filter: glowFilter,
        willChange: "transform",
      }}
    />
  );
}