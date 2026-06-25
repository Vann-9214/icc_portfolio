// app/client-layout-wrapper.tsx
"use client";

import { useEffect } from "react";
import { Cursor } from "@/components/animations/cursor";
import { TransitionProvider } from "@/components/transition.provider";
import { Navigation } from "@/components/navigation";
import { IntroLoader } from "@/components/intro-loader";
import { BackgroundBlobs } from "@/components/background-blobs";

export function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== "undefined" && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  return (
    <>
      <BackgroundBlobs />
      <IntroLoader />
      <Cursor />
      <TransitionProvider>
        <Navigation />
        <div className="relative z-10">{children}</div>
      </TransitionProvider>
    </>
  );
}