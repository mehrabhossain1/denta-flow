import { Link, useRouterState } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import HeaderAuth from './HeaderAuth'
import Logo from './Logo'

const HOME_PATH = '/'

const SECTION_IDS = {
  features: 'features',
  pricing: 'pricing',
  faq: 'faq',
} as const

const NAV_ITEMS = [
  { label: 'Features', sectionId: SECTION_IDS.features },
  { label: 'Pricing', sectionId: SECTION_IDS.pricing },
  { label: 'FAQs', sectionId: SECTION_IDS.faq },
]

const SCROLL_BEHAVIOR: ScrollBehavior = 'smooth'

const scrollToSection = (sectionId: string) => {
  const section = document.getElementById(sectionId)
  if (section) {
    section.scrollIntoView({ behavior: SCROLL_BEHAVIOR, block: 'start' })
  }
}

const handleNavClick = (
  event: MouseEvent<HTMLAnchorElement>,
  sectionId: string,
) => {
  if (typeof window === 'undefined') return
  const isHomeRoute = window.location.pathname === HOME_PATH
  if (!isHomeRoute) return

  event.preventDefault()
  scrollToSection(sectionId)
}

const Header = () => {
  const routerState = useRouterState()
  const isHomePage = routerState.location.pathname === HOME_PATH

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border/40">
      <nav
        className="navbar mx-auto max-w-7xl py-1.5 px-2 sm:px-8 "
        aria-label="Global"
      >
        <div className="flex w-full items-center gap-1">
          {/* Left section - Logo */}
          <div className="flex">
            <Logo size="sm" />
          </div>

          {/* Center section - Navigation (only show on home page) */}
          {isHomePage && (
            <div className="flex-1 max-w-xl mx-auto">
              <ul className="flex items-center justify-center gap-0 text-sm font-medium">
                {NAV_ITEMS.map((item) => (
                  <li key={item.sectionId}>
                    <Link
                      to={HOME_PATH}
                      hash={item.sectionId}
                      onClick={(event) => handleNavClick(event, item.sectionId)}
                      className="rounded-md px-2 py-1.5 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Spacer when not on home page */}
          {!isHomePage && <div className="flex-1" />}

          {/* Right section - User menu */}
          <div className="flex items-center gap-1">
            <HeaderAuth
              onNavigateToPricing={(event) =>
                handleNavClick(event, SECTION_IDS.pricing)
              }
            />
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
