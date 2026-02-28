import type { MarkdownHeading } from '@/lib/blog/markdown'
import { useEffect, useState } from 'react'

interface TableOfContentsProps {
  headings: MarkdownHeading[]
}

/**
 * Table of contents for blog post with scroll-spy
 * Highlights current section as user scrolls
 */
export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>('')

  useEffect(() => {
    // Create intersection observer for scroll spy
    const observers = headings.map((heading) => {
      const element = document.getElementById(heading.id)
      if (!element) return null

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveId(heading.id)
          }
        },
        { rootMargin: '-80px 0px -66% 0px' },
      )

      observer.observe(element)
      return observer
    })

    return () => {
      observers.forEach((observer) => {
        observer?.disconnect()
      })
    }
  }, [headings])

  if (headings.length === 0) return null

  // Only show headings level 2 and 3 (skip h1 and deeper)
  const filteredHeadings = headings.filter((h) => h.level <= 3)
  if (filteredHeadings.length === 0) return null

  return (
    <nav className="text-sm space-y-2">
      <div className="font-semibold text-foreground mb-4">On this page</div>
      <ul className="space-y-2">
        {filteredHeadings.map((heading) => (
          <li
            key={heading.id}
            style={{
              marginLeft: `${(heading.level - 2) * 1}rem`,
            }}
          >
            <a
              href={`#${heading.id}`}
              className={`text-xs transition-colors hover:text-primary ${
                activeId === heading.id
                  ? 'text-primary font-semibold'
                  : 'text-muted-foreground'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
