'use client'

import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth/client'
import { Link } from '@tanstack/react-router'
import type { MouseEvent } from 'react'
import { Suspense, lazy } from 'react'

// Lazy load auth components
const HeaderUserMenu = lazy(() => import('./HeaderUserMenu'))
const HeaderSignUpLogin = lazy(() => import('./HeaderSignUpLogin'))

// Loading skeleton for auth UI
function AuthSkeleton() {
  return (
    <div className="flex items-center gap-0.5">
      <Button size="sm" variant="ghost" className="w-20 h-6 animate-pulse">
        <div className="h-4 w-full bg-muted rounded" />
      </Button>
    </div>
  )
}

type PropTypes = {
  onNavigateToPricing?: (event: MouseEvent<HTMLAnchorElement>) => void
}

export default function HeaderAuth({ onNavigateToPricing }: PropTypes) {
  const { data: clientSession } = useSession()

  // Use client session for user state
  const user = clientSession?.user

  return (
    <Suspense fallback={<AuthSkeleton />}>
      {user ? (
        <>
          <Button asChild size="sm" className="h-6">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <HeaderUserMenu user={user} />
        </>
      ) : (
        <HeaderSignUpLogin onNavigateToPricing={onNavigateToPricing} />
      )}
    </Suspense>
  )
}
