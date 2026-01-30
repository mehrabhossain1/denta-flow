import type { ReactNode } from 'react'
import Header from './Header'
import Footer from './Footer'

interface PageLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
}

export function PageLayout({
  children,
  showHeader = true,
  showFooter = true,
}: PageLayoutProps) {
  return (
    <>
      {showHeader && <Header />}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 py-8 sm:py-12">
        {children}
      </div>
      {showFooter && <Footer />}
    </>
  )
}
