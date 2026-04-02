import { AppShell } from '@/components/_common/AppShell'
import { generatePageSEO } from '@/lib/seo'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/account')({
  head: () => ({
    meta: generatePageSEO({
      title: 'Account',
      description: 'Manage your account settings and preferences',
    }),
  }),
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <AppShell title="Account">
      <Outlet />
    </AppShell>
  )
}
