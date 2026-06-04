'use client'

import { FadeInOnScroll } from './scroll-animations'

export function AboutSection() {
  return (
    <section className="relative py-48 md:py-64 px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-4xl mx-auto">
        <FadeInOnScroll>
          <div className="space-y-12 text-area-blur p-8 md:p-12">
            <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">About</span>
            
            <p className="text-2xl md:text-3xl lg:text-4xl text-foreground leading-relaxed font-light text-pretty">
              I am a 3rd-year Computer Engineering student at Cebu Institute of Technology – University. I specialize in software architecture, AI integration, and building robot projects.
            </p>
            
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed font-light text-pretty">
              I design full-scale solutions—from writing the logic to wiring custom PCBs.
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  )
}
