import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { AboutSection } from "@/components/about-section";
import { TechStackMarquee } from "@/components/tech-stack-marquee";
import { FeaturedProjects } from "@/components/featured-projects";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    // Removed 'bg-background' from this main tag so it's transparent!
    <main className="flex min-h-screen flex-col relative transparent">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <TechStackMarquee />
      <FeaturedProjects />
      <Footer />
    </main>
  );
}
