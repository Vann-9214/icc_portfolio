'use client'

import { useState } from 'react'
import { FadeInOnScroll } from './animations/standard-scroll'
import { ProjectGrid } from './project-grid'
import { CaseStudyView } from './case-study-view'

const categories = [
  { id: 'all', label: 'All Projects' },
  { id: 'software', label: 'Software & Web' },
  { id: 'games', label: 'Game Development' },
  { id: 'hardware', label: 'Hardware & Robotics' },
]

export function ProjectsView() {
  const [activeTab, setActiveTab] = useState('all')

  return (
    <>
      <div className="pt-24 pb-12 md:pt-32 md:pb-24 px-6 md:px-12 lg:px-24">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header */}
          <FadeInOnScroll>
            <div className="flex flex-col gap-8 mb-16 md:mb-24">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground">
                Projects
              </h1>
            </div>
          </FadeInOnScroll>

          {/* Tabs */}
          <FadeInOnScroll>
            <div className="flex flex-wrap gap-2 md:gap-4 mb-16 md:mb-24 border-b border-border pb-6">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={`px-5 py-3 text-sm tracking-wide rounded-lg transition-all duration-300 ${
                    activeTab === category.id
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </FadeInOnScroll>

          {/* Content */}
          {activeTab === 'all' ? (
            <ProjectGrid />
          ) : (
            <CaseStudyView category={activeTab} />
          )}
        </div>
      </div>
    </>
  )
}
