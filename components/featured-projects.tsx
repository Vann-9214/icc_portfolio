'use client'

import { FadeInOnScroll } from './animations/standard-scroll'
import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

const featuredProjects = [
  {
    id: 1,
    title: 'AI-Powered Robot Arm',
    description: 'A 6-DOF robotic arm with computer vision and natural language control.',
    tags: ['Python', 'OpenCV', 'Arduino', 'ROS'],
    category: 'Hardware & Robotics',
  },
  {
    id: 2,
    title: 'Smart Campus Navigation',
    description: 'Full-stack web application with real-time indoor positioning system.',
    tags: ['Next.js', 'PostgreSQL', 'WebSocket', 'BLE'],
    category: 'Software & Web',
  },
  {
    id: 3,
    title: 'Procedural Dungeon Crawler',
    description: 'A roguelike game with procedurally generated levels and AI enemies.',
    tags: ['Unity', 'C#', 'Procedural Generation'],
    category: 'Game Development',
  },
]

export function FeaturedProjects() {
  return (
    <section className="py-48 md:py-64 px-6 md:px-12 lg:px-24">
      <div className="w-full max-w-7xl mx-auto">
        <FadeInOnScroll className="mb-20 md:mb-32">
          <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase">Featured Work</span>
        </FadeInOnScroll>

        {/* Project Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 mb-20 md:mb-32">
          {featuredProjects.map((project, index) => (
            <FadeInOnScroll key={project.id} delay={index * 0.1}>
              <article className="group h-full">
                <div className="relative aspect-[4/3] bg-card rounded-xl overflow-hidden mb-8">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-accent/30" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs tracking-widest uppercase">Project Image</span>
                  </div>
                  <div className="absolute inset-0 bg-foreground/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="space-y-4 text-area-blur rounded-xl p-5 -mx-1">
                  <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{project.category}</span>
                  <h3 className="text-xl md:text-2xl text-foreground font-medium group-hover:text-foreground/80 transition-colors duration-300">
                    {project.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-muted-foreground px-3 py-1 border border-border rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </FadeInOnScroll>
          ))}
        </div>

        {/* View All Button */}
        <FadeInOnScroll>
          <div className="flex justify-center">
            <Link
              href="/projects"
              className="inline-flex items-center gap-4 px-12 py-5 border border-border rounded-lg text-foreground hover:bg-white/5 transition-colors duration-300 group backdrop-blur-xl bg-white/[0.04]"
            >
              <span className="text-sm tracking-wide">View All Projects</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </FadeInOnScroll>
      </div>
    </section>
  )
}
