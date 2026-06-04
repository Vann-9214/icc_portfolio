'use client'

import { motion } from 'framer-motion'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import { Download } from 'lucide-react'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-24 pt-24">
      {/* Fixed background effect */}
      <div className="fixed inset-0 -z-10 bg-background" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-muted/20 via-background to-background" />
      
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Left Column - Text Content */}
          <div className="space-y-12 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
              className="space-y-8"
            >
              <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
                I build systems that bridge the screen and the physical world.
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground leading-tight text-balance">
                I am Ivan Clement P. Cañete, a Full Stack Developer.
              </h1>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5, ease: 'easeOut' }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
              >
                <GitHubLogoIcon className="w-5 h-5" />
                <span className="text-sm tracking-wide">GitHub</span>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-6 py-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
              >
                <LinkedInLogoIcon className="w-5 h-5" />
                <span className="text-sm tracking-wide">LinkedIn</span>
              </a>
              <a
                href="#"
                className="inline-flex items-center gap-3 px-8 py-4 bg-foreground text-background rounded-lg hover:bg-foreground/90 transition-colors duration-300"
              >
                <Download className="w-5 h-5" />
                <span className="text-sm font-medium tracking-wide">Download Resume</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column - Profile Image Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative aspect-square w-full max-w-lg mx-auto lg:mx-0 order-1 lg:order-2"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-accent rounded-2xl" />
            <div className="absolute inset-4 bg-card rounded-xl flex items-center justify-center">
              <span className="text-muted-foreground text-sm tracking-widest uppercase">Profile Image</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
        >
          <motion.div className="w-1 h-2 bg-muted-foreground/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  )
}
