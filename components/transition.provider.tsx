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
import { DARK_COLOR, LIGHT_COLOR } from "@/lib/constants";

type TransitionContextType = {
  navigate: (href: string) => void;
};

const TransitionContext = createContext<TransitionContextType>({
  navigate: () => {},
});

// Hook for triggering the page transition from any component
export function usePageTransition() {
  return useContext(TransitionContext);
}

const ROW_COUNT = 9;

// Wave colors imported from lib/constants.ts — shared with intro-loader.tsx
// so the transition and loader exit sequences always stay in sync.
// Light mode: dark wave first, light wave second
// Dark mode:  light wave first, dark wave second

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const resolveTransition = useRef<(() => void) | null>(null);
  const { resolvedTheme } = useTheme();

  const [scope, animate] = useAnimate();
  const isAnimating = useRef(false);

  // Resolves the route-change promise when pathname updates
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

      // Read theme at click time so the wave order is always correct
      const isDark = resolvedTheme === "dark";
      const wave1Color = isDark ? LIGHT_COLOR : DARK_COLOR;
      const wave2Color = isDark ? DARK_COLOR  : LIGHT_COLOR;

      // Apply theme-aware colors to the stripes before animating
      document.querySelectorAll(".stripe-layer-1").forEach(
        (s) => { (s as HTMLElement).style.backgroundColor = wave1Color; },
      );
      document.querySelectorAll(".stripe-layer-2").forEach(
        (s) => { (s as HTMLElement).style.backgroundColor = wave2Color; },
      );

      const stripes1 = document.querySelectorAll(".stripe-layer-1");
      const stripes2 = document.querySelectorAll(".stripe-layer-2");

      stripes1.forEach((s) => ((s as HTMLElement).style.transformOrigin = "left center"));
      stripes2.forEach((s) => ((s as HTMLElement).style.transformOrigin = "left center"));

      // Phase 1 — wipe left → right: wave 1 then wave 2 with slight overlap
      animate(".stripe-layer-1", { scaleX: 1 }, { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) });
      await new Promise((r) => setTimeout(r, 180));
      await animate(".stripe-layer-2", { scaleX: 1 }, { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) });

      // Wait for Next.js route change to complete (fallback timeout: 3s)
      const routeChangePromise = new Promise<void>((resolve) => {
        if (pathname === href) { resolve(); return; }
        resolveTransition.current = resolve;
        setTimeout(() => {
          if (resolveTransition.current) { resolveTransition.current(); resolveTransition.current = null; }
        }, 3000);
      });

      router.push(href);
      await routeChangePromise;

      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      await new Promise<void>((r) => setTimeout(r, 50));

      // Phase 2 — wipe right → left: reverse order
      stripes1.forEach((s) => ((s as HTMLElement).style.transformOrigin = "right center"));
      stripes2.forEach((s) => ((s as HTMLElement).style.transformOrigin = "right center"));

      animate(".stripe-layer-2", { scaleX: 0 }, { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) });
      await new Promise((r) => setTimeout(r, 180));
      await animate(".stripe-layer-1", { scaleX: 0 }, { duration: 0.45, ease: [0.76, 0, 0.24, 1], delay: stagger(0.06) });

      isAnimating.current = false;
    },
    [animate, router, scope, pathname, resolvedTheme],
  );

  return (
    <TransitionContext.Provider value={{ navigate }}>
      {/* Fixed stripe overlay — sits above all content, invisible until navigate() is called */}
      <div ref={scope} className="fixed inset-0 z-[9999] pointer-events-none flex flex-col">
        {[...Array(ROW_COUNT)].map((_, i) => (
          <div key={i} className="relative flex-1 w-full">
            {/* Wave 1 stripe — color applied imperatively at navigate time */}
            <motion.div
              className="stripe-layer-1 absolute inset-0 w-full h-full"
              initial={{ scaleX: 0 }}
              style={{ transformOrigin: "left center", backgroundColor: DARK_COLOR }}
            />
            {/* Wave 2 stripe — color applied imperatively at navigate time */}
            <motion.div
              className="stripe-layer-2 absolute inset-0 w-full h-full"
              initial={{ scaleX: 0 }}
              style={{ transformOrigin: "left center", backgroundColor: LIGHT_COLOR }}
            />
          </div>
        ))}
      </div>

      {children}
    </TransitionContext.Provider>
  );
}
