"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

import { ProjectsView } from '@/components/projects-view'

export default function ProjectsPage() {
  // BUG FIX START
  const router = useRouter()

  useEffect(() => {
    // 1. Check if the browser's current document state is from a reload
    const navigationEntries = window.performance.getEntriesByType("navigation");
    const isReload = navigationEntries.length > 0 && (navigationEntries[0] as PerformanceNavigationTiming).type === "reload";
    
    // 2. Check if the page the user was on RIGHT BEFORE the reload was the projects page
    const lastPath = sessionStorage.getItem('lastPathBeforeReload');

    // 3. If it is a reload AND it specifically happened on /projects, push to home
    if (isReload && lastPath === '/projects') {
      sessionStorage.removeItem('lastPathBeforeReload'); // Clear state so normal clicks aren't affected
      router.push('/');
    }

    // 4. Save the current path just before any hard refresh or navigation away happens
    const handleBeforeUnload = () => {
      sessionStorage.setItem('lastPathBeforeReload', window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [router]);
  // BUG FIX END

  return (
    <main className="relative min-h-screen">
      <ProjectsView />
    </main>
  )
}