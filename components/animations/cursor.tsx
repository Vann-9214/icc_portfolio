"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const [initialPos, setInitialPos] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const handleFirstMove = (e: MouseEvent) => {
      setInitialPos({ x: e.clientX - 20, y: e.clientY - 20 });
    };
    window.addEventListener("mousemove", handleFirstMove, { once: true });
    return () => window.removeEventListener("mousemove", handleFirstMove);
  }, []);

  if (!initialPos) return null;

  return <ActiveCursor initialPos={initialPos} />;
}

function ActiveCursor({ initialPos }: { initialPos: { x: number; y: number } }) {
  const cursorX = useMotionValue(initialPos.x);
  const cursorY = useMotionValue(initialPos.y);

  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // stiffness: Controls speed (higher = snaps faster to your mouse)
  // damping: Controls friction/smoothness (lower = more bouncy, higher = tighter)
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
      className="fixed top-0 left-0 w-10 h-10 rounded-full pointer-events-none z-[9999]"
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
        //
        // HOW THIS WORKS:
        // mix-blend-mode: difference computes |background_color - this_color| per channel.
        //
        // We want the cursor to APPEAR as blue #0F42A9 = rgb(15, 66, 169).
        // On a white background (255, 255, 255):
        //   |white - cursor| = blue
        //   |(255,255,255) - cursor| = (15, 66, 169)
        //   cursor = (240, 189, 86) = #F0BD56
        //
        // So the actual DOM color is golden/orange (#F0BD56), but difference-blended
        // against white it renders as exactly #0F42A9 — the blue you see.
        // The whole circle inverts whatever is underneath it as it moves.
        //
        backgroundColor: "#F0BD56",
        mixBlendMode: "difference",
      }}
    />
  );
}