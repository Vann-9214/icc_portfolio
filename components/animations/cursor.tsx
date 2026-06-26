"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
 
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

  return (
    <motion.div
      className="fixed top-0 left-0 w-12 h-12 rounded-full pointer-events-none z-[9999]"
      initial={{ opacity: 0 }}
      animate={{
        scale: isHovered ? 0 : 1,
        opacity: isLoading ? 0 : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 25,
        opacity: { duration: 1.5, ease: "easeInOut" },
      }}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
        backgroundColor: "#F0BD56",
        mixBlendMode: "difference",
        // drop-shadow traces the circle's edge and only blurs outside it.
        // Unlike box-shadow or filter:blur, the circle itself stays crisp.
        // BUG FIX START
        filter: "drop-shadow(0 0 24px rgba(240, 189, 86, 0.55))",
        // BUG FIX END
        willChange: "transform",
      }}
    />
  );
}