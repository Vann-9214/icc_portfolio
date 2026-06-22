"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useEffect, useState } from "react";

export function Cursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  
  const [isHovered, setIsHovered] = useState(false);

  const springConfig = { damping: 25, stiffness: 800 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 20);
      cursorY.set(e.clientY - 20);
    };

    const handleMouseInteraction = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // This checks for the button/link/interactive-div AND its parents
      const isInteractive = !!target.closest(
        "button, a, [role='button'], input, .cursor-pointer, [data-cursor='interactive']"
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
      animate={{
        backgroundColor: "#0F42A9",
        boxShadow: isHovered 
          ? "0 0 0px 0px transparent" 
          : "0 0 8px 2px #243B69", 
        scale: isHovered ? 0 : 1,
        opacity: isHovered ? 0 : 1,
      }}
      // This unified transition creates the smooth "absorption" spring effect
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 25 
      }}
      style={{
        x: cursorXSpring,
        y: cursorYSpring,
      }}
    />
  );
}