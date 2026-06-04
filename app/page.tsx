import { Navigation } from '@/components/navigation'
import { HeroSection } from '@/components/hero-section'
import { AboutSection } from '@/components/about-section'
import { TechStackMarquee } from '@/components/tech-stack-marquee'
import { FeaturedProjects } from '@/components/featured-projects'
import { Footer } from '@/components/footer'

export default function HomePage() {
  return (
    <main className="relative">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <TechStackMarquee />
      <FeaturedProjects />
      <Footer />
    </main>
  )
}
