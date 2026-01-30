import { useRouterState } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

/**
 * Global navigation progress indicator
 * Shows a loading bar at the top when navigating between routes
 * Especially useful for cold start scenarios
 */
export function NavigationProgress() {
  const [progress, setProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const isLoading = useRouterState({ select: (s) => s.isLoading })
  const isTransitioning = useRouterState({ select: (s) => s.isTransitioning })

  useEffect(() => {
    if (isLoading || isTransitioning) {
      setIsVisible(true)
      setProgress(0)

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prev) => {
          // Slow down as we approach 90%
          if (prev >= 90) return prev + 0.5
          if (prev >= 70) return prev + 1
          return prev + 2
        })
      }, 100)

      return () => clearInterval(interval)
    } else {
      // Complete the progress
      setProgress(100)
      // Hide after animation
      setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 200)
    }
  }, [isLoading, isTransitioning])

  if (!isVisible) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-100 h-1 bg-transparent"
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="Page loading progress"
    >
      <div
        className="h-full bg-linear-to-r from-primary via-primary/80 to-primary transition-all duration-200 ease-out shadow-lg shadow-primary/50"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  )
}
