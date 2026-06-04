'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FadeInOnScroll } from './scroll-animations'
import { GitHubLogoIcon } from '@radix-ui/react-icons'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'

interface CaseStudy {
  id: number
  title: string
  tags: string[]
  heroImage: null
  problem: string
  solution: string
  solutionDetails: string[]
  outcomes: string[]
  galleryImages: string[]
  githubUrl?: string
  demoUrl?: string
}

const projectsByCategory: Record<string, CaseStudy[]> = {
  software: [
    {
      id: 1,
      title: 'Smart Campus Navigation',
      tags: ['Next.js', 'PostgreSQL', 'WebSocket', 'BLE Beacons'],
      heroImage: null,
      problem: 'Students and visitors at CIT-U often struggle to navigate the expansive campus, especially during enrollment periods. Traditional signage is inadequate for real-time wayfinding, and there was no digital solution that could provide indoor positioning.',
      solution: 'I designed and built a full-stack web application that leverages Bluetooth Low Energy (BLE) beacons placed throughout campus buildings. The system triangulates user position and provides turn-by-turn navigation to any destination.',
      solutionDetails: [
        'Built a Next.js frontend with real-time map rendering using Canvas API',
        'Implemented WebSocket connections for live position updates',
        'Designed a PostgreSQL database schema for storing beacon locations and building floorplans',
        'Created an admin dashboard for managing beacon placement and monitoring system health',
      ],
      outcomes: [
        'Reduced average navigation time by 40% for first-time visitors',
        'Successfully deployed across 5 campus buildings',
        'Handles 500+ concurrent users during peak enrollment',
      ],
      galleryImages: ['Mobile App Interface', 'Admin Dashboard', 'Beacon Placement Map', 'User Testing Session'],
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      id: 2,
      title: 'E-Commerce Platform',
      tags: ['React', 'Node.js', 'Stripe', 'MongoDB'],
      heroImage: null,
      problem: 'Local artisans in Cebu lacked an accessible platform to sell their handcrafted products online. Existing e-commerce solutions were either too expensive or too complex for small-scale sellers.',
      solution: 'I created a lightweight, mobile-first e-commerce platform specifically designed for local artisans. The platform features simple product listing, integrated payments via Stripe, and a streamlined checkout process.',
      solutionDetails: [
        'React-based storefront with server-side rendering for SEO',
        'Node.js backend with RESTful API architecture',
        'Stripe integration for secure payment processing',
        'MongoDB for flexible product catalog management',
      ],
      outcomes: [
        'Onboarded 50+ local artisans in the first month',
        'Processed over ₱500,000 in transactions',
        'Mobile traffic accounts for 78% of all visits',
      ],
      galleryImages: ['Product Listing Page', 'Mobile Checkout Flow', 'Seller Dashboard', 'Analytics Overview'],
      githubUrl: 'https://github.com',
    },
  ],
  games: [
    {
      id: 3,
      title: 'Procedural Dungeon Crawler',
      tags: ['Unity', 'C#', 'Procedural Generation', 'A* Pathfinding'],
      heroImage: null,
      problem: 'I wanted to create a game that offered infinite replayability through procedurally generated content, while still maintaining carefully designed gameplay balance and progression.',
      solution: 'I developed a roguelike dungeon crawler in Unity that uses custom procedural generation algorithms to create unique dungeon layouts, enemy placements, and item distributions for each playthrough.',
      solutionDetails: [
        'Implemented Binary Space Partitioning (BSP) for dungeon room generation',
        'Created A* pathfinding for enemy AI navigation',
        'Designed a modular loot system with weighted probability tables',
        'Built a custom shader system for dynamic lighting and fog of war',
      ],
      outcomes: [
        'Over 10,000 possible unique dungeon configurations',
        'Average play session of 45 minutes',
        'Featured in a local game development showcase',
      ],
      galleryImages: ['Gameplay Screenshot', 'Dungeon Generation Debug', 'Enemy AI Pathfinding', 'Loot System UI'],
      githubUrl: 'https://github.com',
      demoUrl: 'https://example.com',
    },
    {
      id: 4,
      title: 'Multiplayer Card Game',
      tags: ['Godot', 'GDScript', 'WebSocket', 'Node.js'],
      heroImage: null,
      problem: 'Our gaming group wanted a digital version of a custom card game we played, with real-time multiplayer support so we could play together remotely.',
      solution: 'I built a cross-platform multiplayer card game using Godot Engine with a Node.js WebSocket server for real-time game state synchronization.',
      solutionDetails: [
        'Godot Engine for cross-platform client (Windows, Web, Android)',
        'Node.js WebSocket server for real-time multiplayer',
        'Custom card animation system with physics-based interactions',
        'Lobby system with matchmaking and private rooms',
      ],
      outcomes: [
        'Supports up to 6 players per game session',
        'Sub-100ms latency for game actions',
        'Active player base of 200+ users',
      ],
      galleryImages: ['Game Lobby', 'Card Animation System', 'Match in Progress', 'Victory Screen'],
      githubUrl: 'https://github.com',
    },
  ],
  hardware: [
    {
      id: 5,
      title: 'AI-Powered Robot Arm',
      tags: ['Python', 'OpenCV', 'Arduino', 'ROS', 'TensorFlow'],
      heroImage: null,
      problem: 'Traditional robot arms require precise programming for each task. I wanted to create a more intuitive system that could understand natural language commands and use computer vision to adapt to its environment.',
      solution: 'I built a 6-DOF robotic arm controlled by a Raspberry Pi that uses computer vision for object detection and a fine-tuned language model for understanding voice commands.',
      solutionDetails: [
        'Designed custom 3D-printed arm segments with servo-driven joints',
        'Implemented inverse kinematics using Python for smooth motion planning',
        'Integrated OpenCV for real-time object detection and tracking',
        'Used TensorFlow Lite for on-device inference of voice commands',
        'Built ROS nodes for modular control architecture',
      ],
      outcomes: [
        'Successfully demonstrated pick-and-place operations with 95% accuracy',
        'Voice command recognition accuracy of 89%',
        'Presented at CIT-U Engineering Expo 2024',
      ],
      galleryImages: ['Robot Arm Assembly', 'Object Detection Demo', 'Voice Command Interface', 'Expo Presentation'],
      githubUrl: 'https://github.com',
    },
    {
      id: 6,
      title: 'IoT Weather Station',
      tags: ['ESP32', 'MQTT', 'InfluxDB', 'Grafana', 'React'],
      heroImage: null,
      problem: 'The university meteorology department needed a network of affordable weather stations that could provide real-time data for research and campus safety alerts.',
      solution: 'I designed and built a network of IoT weather stations using ESP32 microcontrollers, with a central data collection system and real-time dashboard.',
      solutionDetails: [
        'Custom PCB design for weather sensor integration',
        'ESP32 firmware with deep sleep for solar-powered operation',
        'MQTT broker for efficient data transmission',
        'InfluxDB time-series database for historical data',
        'Grafana + React dashboard for visualization and alerts',
      ],
      outcomes: [
        'Deployed 8 stations across campus',
        'Battery life of 30+ days on solar power alone',
        'Data used for 3 published research papers',
      ],
      galleryImages: ['Weather Station Unit', 'Custom PCB Design', 'Grafana Dashboard', 'Campus Deployment Map'],
      githubUrl: 'https://github.com',
    },
  ],
}

function ImageCarousel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <div className="relative">
      {/* Main image container */}
      <div className="relative aspect-video bg-card rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-accent/30" />
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <span className="text-muted-foreground text-sm tracking-widest uppercase">
              {images[currentIndex]}
            </span>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation arrows */}
        <button
          onClick={goToPrevious}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors duration-300"
          aria-label="Previous image"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border flex items-center justify-center text-foreground hover:bg-background transition-colors duration-300"
          aria-label="Next image"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
      
      {/* Dots indicator */}
      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? 'bg-foreground w-6'
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export function CaseStudyView({ category }: { category: string }) {
  const projects = projectsByCategory[category] || []

  if (projects.length === 0) {
    return (
      <div className="py-24 text-center">
        <p className="text-muted-foreground">No projects in this category yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-48 md:space-y-64">
      {projects.map((project, index) => (
        <article key={project.id} className="relative">
          {/* Divider (except for first project) */}
          {index > 0 && (
            <div className="absolute -top-24 md:-top-32 left-0 right-0 h-px bg-border" />
          )}

          <FadeInOnScroll>
            {/* Header */}
            <div className="mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif text-foreground mb-8 text-balance">
                {project.title}
              </h2>
              
              <div className="flex flex-wrap items-center gap-4 md:gap-6">
                {/* Tech Stack Icons */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs text-muted-foreground px-3 py-1.5 border border-border rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                
                {/* Links */}
                <div className="flex gap-3 ml-auto">
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
                    >
                      <GitHubLogoIcon className="w-4 h-4" />
                      <span className="text-xs tracking-wide">GitHub</span>
                    </a>
                  )}
                  {project.demoUrl && (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-muted/50 transition-colors duration-300"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="text-xs tracking-wide">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Hero Media */}
          <FadeInOnScroll>
            <div className="relative aspect-video bg-card rounded-2xl overflow-hidden mb-24 md:mb-32">
              <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-accent/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-muted-foreground text-sm tracking-widest uppercase">Project Hero Image / Video</span>
              </div>
            </div>
          </FadeInOnScroll>

          {/* The Problem */}
          <FadeInOnScroll>
            <div className="mb-24 md:mb-32 max-w-3xl">
              <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6 block">The Problem</span>
              <p className="text-xl md:text-2xl text-foreground leading-relaxed font-light">
                {project.problem}
              </p>
            </div>
          </FadeInOnScroll>

          {/* The Solution / Architecture */}
          <FadeInOnScroll>
            <div className="mb-24 md:mb-32">
              <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-6 block">The Solution</span>
              
              <div className="grid lg:grid-cols-2 gap-12 lg:gap-24">
                <div className="space-y-6">
                  <p className="text-lg md:text-xl text-foreground leading-relaxed font-light">
                    {project.solution}
                  </p>
                  <ul className="space-y-4">
                    {project.solutionDetails.map((detail, i) => (
                      <li key={i} className="flex gap-4 text-muted-foreground leading-relaxed">
                        <span className="text-foreground/50 font-mono text-sm">0{i + 1}</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                
                {/* Secondary Image/Diagram */}
                <div className="relative aspect-square bg-card rounded-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-muted/30 to-accent/20" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-muted-foreground text-xs tracking-widest uppercase">Architecture Diagram</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInOnScroll>

          {/* Outcomes */}
          <FadeInOnScroll>
            <div className="mb-24 md:mb-32 max-w-3xl">
              <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8 block">Outcomes</span>
              <div className="grid sm:grid-cols-3 gap-8 md:gap-12">
                {project.outcomes.map((outcome, i) => (
                  <div key={i} className="space-y-2">
                    <span className="text-foreground/30 font-mono text-4xl md:text-5xl">0{i + 1}</span>
                    <p className="text-foreground leading-relaxed">{outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeInOnScroll>

          {/* Image Gallery Carousel */}
          <FadeInOnScroll>
            <div>
              <span className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-8 block">Gallery</span>
              <ImageCarousel images={project.galleryImages} />
            </div>
          </FadeInOnScroll>
        </article>
      ))}
    </div>
  )
}
