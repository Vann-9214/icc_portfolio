import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { TechStackMarquee } from "@/components/tech-stack-marquee";
import { FeaturedProjects } from "@/components/featured-projects";
import { Footer } from "@/components/footer";
import { FixedActions } from "@/components/fixed-actions";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col relative transparent">
      <Navigation />
      <FixedActions />
      <HeroSection />
      <AboutSection />
      <TechStackMarquee />
      <FeaturedProjects />
      <Footer />
    </main>
  );
}