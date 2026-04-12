import { AppShell } from '@/components/_common/AppShell'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { AUTH_ROUTES } from '@/constants/auth'
import { useSession } from '@/lib/auth/client'
import { claimGuestEntitlements } from '@/lib/billing/server'
import { generatePageSEO } from '@/lib/seo'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Outlet, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: generatePageSEO({
      title: 'Dashboard',
      description: 'DentaFlow dental practice management',
    }),
  }),
  component: DashboardLayout,
})

function DashboardLayout() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, isPending } = useSession()

  const claimMutation = useMutation({
    mutationFn: () => claimGuestEntitlements(),
    onSuccess: (result) => {
      if (result.claimed > 0 || (result.claimedSubscriptions ?? 0) > 0) {
        queryClient.invalidateQueries({ queryKey: ['billing-status'] })
      }
    },
  })

  const {
    mutate: claimEntitlements,
    isPending: claimPending,
    isSuccess: claimSuccess,
  } = claimMutation

  useEffect(() => {
    if (!session && !isPending) {
      router.navigate({
        to: '/auth/$authView',
        params: { authView: AUTH_ROUTES.SIGN_IN },
        search: { redirect: location.href },
      })
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session?.user && !claimPending && !claimSuccess) {
      claimEntitlements()
    }
  }, [session?.user, claimPending, claimSuccess, claimEntitlements])

  if (!session && !isPending) {
    return (
      <AppShell>
        <div className="min-h-[50vh] grid place-items-center">
          <p className="text-muted-foreground">Redirecting to login...</p>
        </div>
      </AppShell>
    )
  }

  if (isPending) {
    return (
      <AppShell>
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <div className="px-4 lg:px-6">
            <Card>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48 mt-1" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    )
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}
