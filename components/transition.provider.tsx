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

// Neutral palette: warm charcoal + warm stone
const COLOR_WAVE_1 = "#2D2B28"; // warm dark charcoal
const COLOR_WAVE_2 = "#D6CFC4"; // warm greige / stone

export function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const resolveTransition = useRef<(() => void) | null>(null);

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

      const stripes1 = document.querySelectorAll(".stripe-layer-1");
      const stripes2 = document.querySelectorAll(".stripe-layer-2");

      stripes1.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "left center"),
      );
      stripes2.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "left center"),
      );

      // Phase 1: Wave 1 (charcoal) slides in staggered
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
    [animate, router, scope, pathname],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <div
        ref={scope}
        className="fixed inset-0 z-[9999] pointer-events-none flex flex-col"
      >
        {[...Array(ROW_COUNT)].map((_, i) => (
          <div key={i} className="relative flex-1 w-full">
            {/* Wave 1: warm charcoal */}
            <motion.div
              className="stripe-layer-1 absolute inset-0 w-full h-full"
              initial={{ scaleX: 0 }}
              style={{
                transformOrigin: "left center",
                backgroundColor: COLOR_WAVE_1,
              }}
            />
            {/* Wave 2: warm stone */}
            <motion.div
              className="stripe-layer-2 absolute inset-0 w-full h-full"
              initial={{ scaleX: 0 }}
              style={{
                transformOrigin: "left center",
                backgroundColor: COLOR_WAVE_2,
              }}
            />
          </div>
        ))}
      </div>

      {children}
    </TransitionContext.Provider>
  );
}