import { DefaultCatchBoundary } from '@/components/_common/DefaultCacheBoundry'
import { PageNotFound } from '@/components/_common/PageNotFound'
import { sentryInit } from '@/lib/sentry'
import { routeTree } from '@/routeTree.gen'
import { createRouter } from '@tanstack/react-router'

export const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultErrorComponent: DefaultCatchBoundary,
  scrollRestoration: true,
  defaultNotFoundComponent: () => <PageNotFound />,
  defaultPendingComponent: () => (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  ),
})

export function getRouter() {
  if (!router.isServer) {
    sentryInit(router)
  }

  return router
}

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}
