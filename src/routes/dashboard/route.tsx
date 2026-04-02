import { AppShell } from '@/components/_common/AppShell'
import { ManageBillingButton } from '@/components/_common/ManageBillingButton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { AUTH_ROUTES } from '@/constants/auth'
import { STRIPE_CONFIG } from '@/constants/billing'
import { useSession } from '@/lib/auth/client'
import { claimGuestEntitlements, getBillingStatus } from '@/lib/billing/server'
import { generatePageSEO } from '@/lib/seo'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { ArrowUpRight, Github, Package } from 'lucide-react'
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

function LoadingSkeleton() {
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

function Dashboard() {
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

  const { data, isLoading } = useQuery({
    queryKey: ['billing-status'],
    queryFn: () => getBillingStatus(),
    enabled: !!session?.user,
  })

  if (!session && !isPending) {
    return (
      <AppShell>
        <div className="min-h-[50vh] grid place-items-center">
          <p className="text-muted-foreground">Redirecting to login…</p>
        </div>
      </AppShell>
    )
  }

  if (isPending || isLoading) {
    return <LoadingSkeleton />
  }

  const entitlements = data?.entitlements ?? []

  const getProductName = (productId: string) => {
    const product = Object.values(STRIPE_CONFIG.PRODUCTS).find(
      (p) => p.id === productId,
    )
    return product?.name ?? productId
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <div className="px-4 lg:px-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Purchases</CardTitle>
                  <CardDescription>
                    Your one-time purchases and access
                  </CardDescription>
                </div>
                {entitlements.length === 0 && (
                  <Button asChild size="sm" variant="outline">
                    <Link to="/" hash="pricing">
                      View Plans <ArrowUpRight className="size-3" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {entitlements.length > 0 ? (
                <div className="space-y-4">
                  {entitlements.map((ent, idx) => (
                    <div key={ent.id}>
                      {idx > 0 && <Separator className="mb-4" />}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <Package className="size-4 text-muted-foreground" />
                            <span className="font-medium text-sm">
                              {getProductName(ent.productId)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {ent.grantedAt && (
                              <span className="text-xs text-muted-foreground">
                                {new Date(ent.grantedAt).toLocaleDateString()}
                              </span>
                            )}
                            <Badge variant="secondary" className="text-xs">
                              Lifetime
                            </Badge>
                          </div>
                        </div>
                        <div className="pl-6 border-l-2 border-border">
                          <div className="flex items-center gap-1 mb-2 text-xs text-muted-foreground uppercase tracking-wide font-medium">
                            <Github className="size-3" />
                            Repository Access
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center gap-3">
                  <Package className="size-10 text-muted-foreground/40" />
                  <div>
                    <p className="text-sm font-medium">No purchases yet</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get started with a one-time purchase or subscription
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
            {entitlements.length === 0 && (
              <CardFooter>
                <ManageBillingButton
                  variant="ghost"
                  className="w-full text-muted-foreground"
                >
                  Manage Billing
                </ManageBillingButton>
              </CardFooter>
            )}
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
