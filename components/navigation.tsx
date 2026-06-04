"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export function Navigation() {
  const pathname = usePathname();
  const isProjectsPage = pathname === "/projects";

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24 py-4 flex items-center justify-between">
        {/* Left side - Logo or Back button */}
        {isProjectsPage ? (
          <Link
            href="/"
            className="inline-flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors duration-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm tracking-wide">Back</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="text-foreground font-serif text-xl tracking-tight"
          >
            ICC
          </Link>
        )}

        {/* Right side - Navigation links (only on landing page) */}
        {!isProjectsPage && (
          <div className="flex items-center gap-8">
            <a
              href="#about"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              About
            </a>
            <Link
              href="/projects"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Projects
            </Link>
            <a
              href="#contact"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-300 tracking-wide"
            >
              Contact
            </a>
          </div>
        )}
      </div>
    </motion.nav>
  );
}
