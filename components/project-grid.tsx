'use client'

import { FadeInOnScroll } from './scroll-animations'

const allProjects = [
  {
    id: 1,
    title: 'AI-Powered Robot Arm',
    category: 'Hardware & Robotics',
    description: 'A 6-DOF robotic arm controlled by Raspberry Pi using computer vision for object detection and voice commands via a fine-tuned language model.',
    image: null,
  },
  {
    id: 2,
    title: 'Smart Campus Navigation',
    category: 'Software & Web',
    description: 'Full-stack web application leveraging BLE beacons for indoor positioning and turn-by-turn navigation across campus buildings.',
    image: null,
  },
  {
    id: 3,
    title: 'Procedural Dungeon Crawler',
    category: 'Game Development',
    description: 'A roguelike dungeon crawler in Unity with custom procedural generation algorithms creating unique layouts for infinite replayability.',
    image: null,
  },
  {
    id: 4,
    title: 'IoT Weather Station',
    category: 'Hardware & Robotics',
    description: 'Network of solar-powered IoT weather stations using ESP32 microcontrollers with real-time data collection and visualization dashboard.',
    image: null,
  },
  {
    id: 5,
    title: 'E-Commerce Platform',
    category: 'Software & Web',
    description: 'Mobile-first e-commerce platform for local artisans featuring simple product listing, Stripe payments, and streamlined checkout.',
    image: null,
  },
  {
    id: 6,
    title: 'Multiplayer Card Game',
    category: 'Game Development',
    description: 'Cross-platform multiplayer card game built with Godot Engine and Node.js WebSocket server for real-time game state synchronization.',
    image: null,
  },
  {
    id: 7,
    title: 'Autonomous Drone System',
    category: 'Hardware & Robotics',
    description: 'Custom autonomous drone with computer vision-based navigation and obstacle avoidance for indoor flight operations.',
    image: null,
  },
  {
    id: 8,
    title: 'Real-time Chat Application',
    category: 'Software & Web',
    description: 'Modern chat platform with end-to-end encryption, file sharing, and real-time presence indicators using WebSockets.',
    image: null,
  },
]

export function ProjectGrid() {
  return (
    <div className="space-y-32 md:space-y-48">
      {allProjects.map((project, index) => {
        const isEven = index % 2 === 0
        
        return (
          <FadeInOnScroll key={project.id}>
            <article className={`grid lg:grid-cols-2 gap-12 lg:gap-24 items-center ${isEven ? '' : 'lg:grid-flow-dense'}`}>
              {/* Text Content */}
              <div className={`space-y-6 ${isEven ? 'lg:order-1' : 'lg:order-2'}`}>
                <span className="text-muted-foreground text-xs tracking-[0.2em] uppercase">{project.category}</span>
                <h3 className="text-2xl md:text-3xl lg:text-4xl text-foreground font-serif text-balance">
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {project.description}
                </p>
                <button className="inline-flex items-center gap-2 text-foreground text-sm tracking-wide group">
                  <span>View Project</span>
                  <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
                </button>
              </div>
              
              {/* Image */}
              <div className={`relative aspect-[4/3] bg-card rounded-xl overflow-hidden ${isEven ? 'lg:order-2' : 'lg:order-1'}`}>
                <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-accent/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs tracking-widest uppercase">Project Image</span>
                </div>
              </div>
            </article>
          </FadeInOnScroll>
        )
      })}
    </div>
  )
}
