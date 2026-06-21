"use client";

// BUG FIX START (Added useEffect and usePathname)
import {
  createContext,
  useContext,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
// BUG FIX END
// BUG FIX START (Import stagger to sequence the horizontal slides)
import { motion, useAnimate, stagger } from "framer-motion";
// BUG FIX END

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
  // NEW ADDITION START
  const pathname = usePathname();
  const resolveTransition = useRef<(() => void) | null>(null);
  // NEW ADDITION END

  const [scope, animate] = useAnimate();
  const isAnimating = useRef(false);

  // NEW ADDITION START
  useEffect(() => {
    if (resolveTransition.current) {
      resolveTransition.current();
      resolveTransition.current = null;
    }
  }, [pathname]);
  // NEW ADDITION END

  const navigate = useCallback(
    async (href: string) => {
      if (!scope.current || isAnimating.current) return;
      isAnimating.current = true;

      // BUG FIX START (Target the 5-row double layers)
      const stripes1 = document.querySelectorAll(".stripe-layer-1");
      const stripes2 = document.querySelectorAll(".stripe-layer-2");

      stripes1.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "left center"),
      );
      stripes2.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "left center"),
      );

      // Phase 1: Wave 1 (All Dark Blue rows) slides in staggered
      animate(
        ".stripe-layer-1",
        { scaleX: 1 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.08) },
      );

      // Wait a fraction of a second, then Wave 2 (All Brand Blue rows) slides in right over them
      await new Promise((r) => setTimeout(r, 200));
      await animate(
        ".stripe-layer-2",
        { scaleX: 1 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.08) },
      );
      // BUG FIX END

      // NEW ADDITION START
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
      // NEW ADDITION END

      router.push(href);
      await routeChangePromise;

      // NEW ADDITION START
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      // NEW ADDITION END

      await new Promise<void>((r) => setTimeout(r, 50));

      // BUG FIX START (Wipe out right → left)
      stripes1.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "right center"),
      );
      stripes2.forEach(
        (s) => ((s as HTMLElement).style.transformOrigin = "right center"),
      );

      // Phase 2: Top Wave (Brand Blue) slides away first, revealing the Dark Blue rows sliding away right behind them
      animate(
        ".stripe-layer-2",
        { scaleX: 0 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.08) },
      );

      await new Promise((r) => setTimeout(r, 200));
      await animate(
        ".stripe-layer-1",
        { scaleX: 0 },
        { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.08) },
      );
      // BUG FIX END

      isAnimating.current = false;
    },
    [animate, router, scope, pathname],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {/* BUG FIX START (5 individual rows, each containing a Dark Blue and Brand Blue layer) */}
      <div
        ref={scope}
        className="fixed inset-0 z-[9999] pointer-events-none flex flex-col"
      >
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative flex-1 w-full">
            {/* Wave 1 layer: All Dark Blue */}
            <motion.div
              className="stripe-layer-1 absolute inset-0 w-full h-full"
              initial={{ scaleX: 0 }}
              style={{
                transformOrigin: "left center",
                backgroundColor: "var(--color-brand-blue-dark)",
              }}
            />
            {/* Wave 2 layer: All Brand Blue */}
            <motion.div
              className="stripe-layer-2 absolute inset-0 w-full h-full shadow-[-10px_0_20px_rgba(0,0,0,0.1)]"
              initial={{ scaleX: 0 }}
              style={{
                transformOrigin: "left center",
                backgroundColor: "var(--color-brand-blue)",
              }}
            />
          </div>
        ))}
      </div>
      {/* BUG FIX END */}

      {children}
    </TransitionContext.Provider>
  );
}
