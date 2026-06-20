"use client";

import { createContext, useContext, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, useAnimate } from "framer-motion";

type TransitionContextType = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [scope, animate] = useAnimate();
  const isAnimating = useRef(false);

  const navigate = useCallback(
    async (href: string) => {
      // Prevent double-clicks mid-animation
      if (!scope.current || isAnimating.current) return;
      isAnimating.current = true;

      // Phase 1: Curtain wipes IN from left → right
      scope.current.style.transformOrigin = "left center";
      await animate(
        scope.current,
        { scaleX: 1 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
      );

      // Navigate while screen is covered
      router.push(href);

      // Give new page time to mount under the curtain
      await new Promise<void>((r) => setTimeout(r, 100));

      // Phase 2: Curtain wipes OUT right → left
      scope.current.style.transformOrigin = "right center";
      await animate(
        scope.current,
        { scaleX: 0 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1] },
      );

      isAnimating.current = false;
    },
    [animate, router, scope],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {/* The curtain — sits above everything including the nav */}
      <motion.div
        ref={scope}
        initial={{ scaleX: 0 }}
        className="fixed inset-0 z-[9999] bg-white pointer-events-none"
        style={{ transformOrigin: "left center" }}
      />
      {children}
    </TransitionContext.Provider>
  );
}
