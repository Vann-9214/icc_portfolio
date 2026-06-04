'use client'

import { FadeInOnScroll } from './scroll-animations'
import { GitHubLogoIcon, LinkedInLogoIcon } from '@radix-ui/react-icons'
import { Mail } from 'lucide-react'

export function Footer() {
  return (
    <footer className="py-32 md:py-48 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="w-full max-w-7xl mx-auto">
        <FadeInOnScroll>
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Contact CTA */}
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight text-balance">
                {"Let's build something together."}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed max-w-md">
                {"I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."}
              </p>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-3 text-foreground hover:text-foreground/70 transition-colors duration-300"
              >
                <Mail className="w-5 h-5" />
                <span className="text-lg underline underline-offset-4">hello@example.com</span>
              </a>
            </div>

            {/* Links */}
            <div className="flex flex-col justify-between">
              <div className="flex gap-6">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <GitHubLogoIcon className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <LinkedInLogoIcon className="w-5 h-5" />
                </a>
              </div>
              
              <p className="text-muted-foreground text-sm mt-12 md:mt-0">
                © {new Date().getFullYear()} Ivan Clement P. Cañete. All rights reserved.
              </p>
            </div>
          </div>
        </FadeInOnScroll>
      </div>
    </footer>
  )
}
