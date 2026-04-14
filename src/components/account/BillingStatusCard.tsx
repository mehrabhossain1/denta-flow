import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
  createBillingPortalSession,
  getAIUsageStatus,
  getBillingStatus,
} from '@/lib/billing/server'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Crown, ExternalLink, Sparkles, Zap } from 'lucide-react'

type Subscription = {
  status: string
  currentPeriodEnd: Date | string | null
  cancelAt?: Date | string | null
}

function formatDate(value: Date | string | null | undefined): string {
  if (!value) return '—'
  const d = typeof value === 'string' ? new Date(value) : value
  return d.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function BillingStatusCard() {
  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['ai-usage-status'],
    queryFn: () => getAIUsageStatus(),
  })

  const { data: billing, isLoading: billingLoading } = useQuery({
    queryKey: ['billing-status'],
    queryFn: () => getBillingStatus(),
  })

  const portalMutation = useMutation({
    mutationFn: async () => {
      const result = (await createBillingPortalSession()) as {
        url: string
      } | null
      if (result?.url) {
        window.location.href = result.url
      }
    },
  })

  const isPro = usage?.isPro ?? false
  const activeSub = (billing?.subscriptions?.find(
    (s: Subscription) => s.status === 'active' || s.status === 'trialing',
  ) ?? null) as Subscription | null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              {isPro ? (
                <>
                  <Crown className="size-5 text-amber-500" />
                  DentaFlow Pro
                </>
              ) : (
                <>
                  <Sparkles className="size-5" />
                  DentaFlow Free
                </>
              )}
            </CardTitle>
            <CardDescription className="mt-1">
              {isPro
                ? 'Unlimited AI requests and all features included.'
                : '10 AI requests per month. Upgrade for unlimited.'}
            </CardDescription>
          </div>
          {isPro ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() => portalMutation.mutate()}
              disabled={portalMutation.isPending}
              className="gap-1"
            >
              <ExternalLink className="size-3.5" />
              {portalMutation.isPending ? 'Opening…' : 'Manage Billing'}
            </Button>
          ) : (
            <Button asChild size="sm" className="gap-1">
              <a href="/#pricing">
                <Zap className="size-3.5" />
                Upgrade to Pro
              </a>
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Usage / plan details */}
        {usageLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : isPro ? (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Status</p>
              <p className="font-medium capitalize">
                {billingLoading ? '…' : (activeSub?.status ?? 'active')}
              </p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">
                {activeSub?.cancelAt ? 'Cancels on' : 'Renews on'}
              </p>
              <p className="font-medium">
                {billingLoading
                  ? '…'
                  : formatDate(
                      activeSub?.cancelAt ?? activeSub?.currentPeriodEnd,
                    )}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">AI usage this month</span>
              <span className="font-medium">
                {usage?.usage ?? 0} / {usage?.limit ?? 10}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className={`h-2 rounded-full transition-all ${
                  (usage?.usage ?? 0) >= (usage?.limit ?? 10)
                    ? 'bg-destructive'
                    : (usage?.usage ?? 0) >= (usage?.limit ?? 10) * 0.7
                      ? 'bg-amber-500'
                      : 'bg-primary'
                }`}
                style={{
                  width: `${Math.min(((usage?.usage ?? 0) / (usage?.limit ?? 10)) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
