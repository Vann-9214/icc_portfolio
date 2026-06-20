"use client";

import { FadeInOnScroll } from "./scroll-animations";
import { ABOUT_DATA } from "@/lib/data";

export function AboutSection() {
  return (
    // Main wrapper with 'select-none' added to prevent accidental text highlighting and dragging
    <section
      id="about"
      className="relative py-48 md:py-64 px-6 md:px-12 lg:px-24 select-none"
    >
      <div className="w-full max-w-4xl mx-auto">
        {/* Scroll-triggered fade animation wrapper */}
        <FadeInOnScroll>
          <div className="space-y-12 text-area-blur p-8 md:p-12">
            {/* Section heading (e.g., "ABOUT") */}
            <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">
              {ABOUT_DATA.heading}
            </span>

            {/* Primary introduction paragraph */}
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed font-light text-pretty">
              {ABOUT_DATA.paragraphs[0]}
            </p>

            {/* Secondary details paragraph */}
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light text-pretty">
              {ABOUT_DATA.paragraphs[1]}
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  );
}
