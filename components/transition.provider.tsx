"use client";

import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { motion, useAnimate, stagger } from "framer-motion";
import { useTheme } from "next-themes";

type TransitionContextType = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  navigate: () => {},
});

export function usePageTransition() {
  return useContext(TransitionContext);
}

const ROW_COUNT = 9;

// Light mode: dark wave first, light wave second
// Dark mode:  light wave first, dark wave second
const DARK_COLOR  = "#0C0D0F"; // near-black, matches dark bg (#09090b) with barely-there blue hint
const LIGHT_COLOR = "#EEF3FC"; // near-white with soft blue tint

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const resolveTransition = useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();

  const [scope, animate] = useAnimate();
  const isAnimating = useRef(false);

  useEffect(() => {
    if (resolveTransition.current) {
      resolveTransition.current();
      resolveTransition.current = null;
    }
  }, [pathname]);

  const navigate = useCallback(
    async (href: string) => {
      if (!scope.current || isAnimating.current) return;
      isAnimating.current = true;

      // Determine wave order based on current theme at the moment of click
      const isDark = resolvedTheme === "dark";
      const wave1Color = isDark ? LIGHT_COLOR : DARK_COLOR;
      const wave2Color = isDark ? DARK_COLOR  : LIGHT_COLOR;

      // Paint stripes with the correct theme-aware colors before animating
      document.querySelectorAll(".stripe-layer-1").forEach(
        (s) => { (s as HTMLElement).style.backgroundColor = wave1Color; },
      );
      document.querySelectorAll(".stripe-layer-2").forEach(
        (s) => { (s as HTMLElement).style.backgroundColor = wave2Color; },
      );

      const stripes1 = document.querySelectorAll(".stripe-layer-1");
      const stripes2 = document.querySelectorAll(".stripe-layer-2");

      stripes1.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "left center"),
      );
      stripes2.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "left center"),
      );

      // Phase 1: Wave 1 slides in staggered
      animate(
        ".stripe-layer-1",
        { scaleX: 1 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) },
      );

      await new Promise((r) => setTimeout(r, 180));
      await animate(
        ".stripe-layer-2",
        { scaleX: 1 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) },
      );

      const routeChangePromise = new Promise<void>((resolve) => {
        if (pathname === href) {
          resolve();
          return;
        }
        resolveTransition.current = resolve;
        setTimeout(() => {
          if (resolveTransition.current) {
            resolveTransition.current();
            resolveTransition.current = null;
          }
        }, 3000);
      });

      router.push(href);
      await routeChangePromise;

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });

      await new Promise<void>((r) => setTimeout(r, 50));

      // Phase 2: Wipe right → left
      stripes1.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "right center"),
      );
      stripes2.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "right center"),
      );

      animate(
        ".stripe-layer-2",
        { scaleX: 0 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) },
      );

      await new Promise((r) => setTimeout(r, 180));
      await animate(
        ".stripe-layer-1",
        { scaleX: 0 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) },
      );

      isAnimating.current = false;
    },
    [animate, router, scope, pathname, resolvedTheme],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <div
        ref={scope}
        className="fixed inset-0 z-[9999] pointer-events-none flex flex-col"
      >
        {[...Array(ROW_COUNT)].map((_, i) => (
          <div key={i} className="relative flex-1 w-full">
            {/* Wave 1: color set imperatively at navigate time */}
            <motion.div
              className="stripe-layer-1 absolute inset-0 w-full h-full"
              initial={{ scaleX: 0 }}
              style={{
                transformOrigin: "left center",
                backgroundColor: DARK_COLOR,
              }}
            />
            {/* Wave 2: color set imperatively at navigate time */}
            <motion.div
              className="stripe-layer-2 absolute inset-0 w-full h-full"
              initial={{ scaleX: 0 }}
              style={{
                transformOrigin: "left center",
                backgroundColor: LIGHT_COLOR,
              }}
            />
          </div>
        ))}
      </div>

      {children}
    </TransitionContext.Provider>
  );
}