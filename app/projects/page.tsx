"use client"
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProjectsView } from '@/components/projects-view'

export default function ProjectsPage() {
  const router = useRouter()

  // Redirect to home if the user reloads /projects directly.
  // The page transition animation depends on state from the previous page;
  // a hard reload loses that context so we send them back to home instead.
  useEffect(() => {
    const navigationEntries = window.performance.getEntriesByType("navigation");
    const isReload =
      navigationEntries.length > 0 &&
      (navigationEntries[0] as PerformanceNavigationTiming).type === "reload";

    const lastPath = sessionStorage.getItem('lastPathBeforeReload');

    if (isReload && lastPath === '/projects') {
      sessionStorage.removeItem('lastPathBeforeReload');
      router.push('/');
    }

    // Record the current path before any unload so the reload check above works next time
    const handleBeforeUnload = () => {
      sessionStorage.setItem('lastPathBeforeReload', window.location.pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [router]);

  return (
    <main className="relative min-h-screen">
      <ProjectsView />
    </main>
  )
}
