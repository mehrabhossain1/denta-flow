import { ManageBillingButton } from '@/components/_common/ManageBillingButton'
import { PageHeader } from '@/components/_common/PageHeader'
import { PageLayout } from '@/components/_common/PageLayout'
import { AUTH_ROUTES } from '@/constants/auth'
import { STRIPE_CONFIG } from '@/constants/billing'
import { useSession } from '@/lib/auth/client'
import { claimGuestEntitlements, getBillingStatus } from '@/lib/billing/server'
import { generatePageSEO } from '@/lib/seo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: generatePageSEO({
      title: 'Dashboard',
      description: 'View your subscription and purchase history',
    }),
  }),
  component: Dashboard,
})

function Dashboard() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { data: session, isPending } = useSession()

  // Claim any guest entitlements when user visits dashboard
  const claimMutation = useMutation({
    mutationFn: () => claimGuestEntitlements(),
    onSuccess: (result) => {
      if (result.claimed > 0 || (result.claimedSubscriptions ?? 0) > 0) {
        // Refresh billing status if we claimed anything
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

  // Claim guest entitlements on load (only once)
  useEffect(() => {
    if (session?.user && !claimPending && !claimSuccess) {
      claimEntitlements()
    }
  }, [session?.user, claimPending, claimSuccess, claimEntitlements])

  const { data, isLoading } = useQuery({
    queryKey: ['billing-status'],
    queryFn: () => getBillingStatus(),
    enabled: !!session?.user,
  })

  if (!session && !isPending) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] grid place-items-center">
          <p>Redirecting to login…</p>
        </div>
      </PageLayout>
    )
  }

  if (isPending || isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] grid place-items-center">
          <p>Loading…</p>
        </div>
      </PageLayout>
    )
  }

  const subscriptions = data?.subscriptions ?? []
  const entitlements = data?.entitlements ?? []

  // Helper to get product name from ID
  const getProductName = (productId: string) => {
    const product = Object.values(STRIPE_CONFIG.PRODUCTS).find(
      (p) => p.id === productId,
    )
    return product?.name ?? productId
  }

  return (
    <PageLayout>
      <PageHeader
        title="Dashboard"
        description="Manage your subscription and view purchase history"
      />

      <div className="space-y-8">
        {/* Subscriptions - only show if user has any */}
        {subscriptions.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Subscriptions</h2>
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 border rounded-lg bg-muted/30 space-y-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">Status:</span>
                    <span
                      className={
                        sub.status === 'active'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-muted-foreground'
                      }
                    >
                      {sub.status}
                    </span>
                  </div>
                  {sub.currentPeriodEnd && (
                    <div className="text-sm text-muted-foreground">
                      Renews:{' '}
                      {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Entitlements */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold">Purchases</h2>
          {entitlements.length > 0 ? (
            <div className="space-y-3">
              {entitlements.map((ent) => (
                <div
                  key={ent.id}
                  className="p-4 border rounded-lg bg-muted/30 space-y-1"
                >
                  <div className="font-medium">
                    {getProductName(ent.productId)}
                  </div>
                  {ent.grantedAt && (
                    <div className="text-sm text-muted-foreground">
                      Purchased: {new Date(ent.grantedAt).toLocaleDateString()}
                      <p>
                        Email aziz@better-starter.com for instant access to the
                        Better-Starter github repo
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No purchases yet</p>
          )}
        </section>

        {/* Billing Management */}
        <section>
          <ManageBillingButton>Manage Billing</ManageBillingButton>
        </section>
      </div>
    </PageLayout>
  )
}
