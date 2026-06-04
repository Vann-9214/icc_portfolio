"use client";

import { FadeInOnScroll } from "./scroll-animations";
import { GitHubLogoIcon, LinkedInLogoIcon } from "@radix-ui/react-icons";
import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-24 md:py-32 px-6 md:px-12 lg:px-24 border-t border-border">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-16 md:gap-24">
        <FadeInOnScroll>
          <div className="flex flex-col md:flex-row justify-between items-start gap-12">
            {/* Contact CTA */}
            <div className="space-y-8 max-w-xl text-area-blur p-8 md:p-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground leading-tight text-balance">
                {"Let's build something together."}
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                {
                  "I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision."
                }
              </p>
              <a
                href="mailto:hello@example.com"
                className="inline-flex items-center gap-3 text-foreground hover:text-foreground/70 transition-colors duration-300 mt-4"
              >
                <Mail className="w-5 h-5" />
                <span className="text-lg underline underline-offset-4">
                  hello@example.com
                </span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex flex-col items-start md:items-end gap-6 pt-4">
              <span className="text-muted-foreground uppercase tracking-widest text-sm">
                Connect
              </span>
              <div className="flex gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
                  aria-label="GitHub"
                >
                  <GitHubLogoIcon className="w-6 h-6" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
                  aria-label="LinkedIn"
                >
                  <LinkedInLogoIcon className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>
        </FadeInOnScroll>

        {/* Bottom Rights Reserved Bar */}
        <FadeInOnScroll>
          <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-muted-foreground text-sm">
              © {new Date().getFullYear()} Ivan Clement P. Cañete. All rights
              reserved.
            </p>
          </div>
        </FadeInOnScroll>
      </div>
    </footer>
  );
}
