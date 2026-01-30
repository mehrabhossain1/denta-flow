// src/routes/__root.tsx
import config from '@/appConfig'
import { NavigationProgress } from '@/components/_common/NavigationProgress'
import { PageNotFound } from '@/components/_common/PageNotFound'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/providers'
import { ThemeProvider } from '@/providers/ThemeProvider'
import appCss from '@/styles/app.css?url'
import * as Sentry from '@sentry/tanstackstart-react'
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from '@tanstack/react-router'
import type { ReactNode } from 'react'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: `${config.appName}`,
      },
    ],
    links: [
      // Preload critical fonts for optimal performance
      {
        rel: 'preload',
        href: '/fonts/OpenRunde-Regular.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'preload',
        href: '/fonts/OpenRunde-Medium.woff2',
        as: 'font',
        type: 'font/woff2',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/icon.svg',
      },
    ],
  }),
  component: RootComponent,
  notFoundComponent: PageNotFound,
})

function RootComponent() {
  return (
    <RootDocument>
      <Sentry.ErrorBoundary
        fallback={({ error }) => (
          <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
              <h1 className="text-2xl font-bold">Something went wrong</h1>
              <p className="mt-2 text-muted-foreground">
                {error?.message || 'An unexpected error occurred'}
              </p>
            </div>
          </div>
        )}
      >
        <Providers>
          <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
            <NavigationProgress />
            <Outlet />
            <Toaster />
          </ThemeProvider>
        </Providers>
      </Sentry.ErrorBoundary>
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
