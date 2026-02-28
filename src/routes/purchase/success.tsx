import { PageLayout } from '@/components/_common/PageLayout'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useSession } from '@/lib/auth/client'
import {
  claimGuestEntitlements,
  getCheckoutSession,
} from '@/lib/billing/server'
import { generatePageSEO } from '@/lib/seo'
import { useMutation, useQuery } from '@tanstack/react-query'
import { createFileRoute, Link } from '@tanstack/react-router'
import { ArrowRight, CheckCircle, Mail } from 'lucide-react'
import { useEffect } from 'react'

export const Route = createFileRoute('/purchase/success')({
  head: () => ({
    meta: generatePageSEO({
      title: 'Purchase Successful',
      description: 'Thank you for your purchase',
    }),
  }),
  validateSearch: (search: Record<string, unknown>) => ({
    session_id: (search.session_id as string) || '',
  }),
  component: PurchaseSuccess,
})

function PurchaseSuccess() {
  const { session_id } = Route.useSearch()
  const { data: authSession } = useSession()
  const isLoggedIn = !!authSession?.user

  const { data: checkoutSession, isLoading } = useQuery({
    queryKey: ['checkout-session', session_id],
    queryFn: () =>
      (
        getCheckoutSession as unknown as (args: {
          data: { sessionId: string }
        }) => Promise<{ paymentStatus: string; customerEmail?: string }>
      )({
        data: { sessionId: session_id },
      }),
    enabled: !!session_id,
  })

  // Claim guest entitlements when a logged-in user visits the success page
  const claimMutation = useMutation({
    mutationFn: () => claimGuestEntitlements(),
  })

  const { mutate, isPending, isSuccess } = claimMutation

  useEffect(() => {
    if (isLoggedIn && !isPending && !isSuccess) {
      mutate()
    }
  }, [isLoggedIn, isPending, isSuccess, mutate])

  if (!session_id) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] grid place-items-center">
          <Card className="max-w-md">
            <CardHeader>
              <CardTitle>Invalid Session</CardTitle>
              <CardDescription>
                No checkout session found. Please try purchasing again.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link to="/" hash="pricing">
                  Back to Pricing
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    )
  }

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-[50vh] grid place-items-center">
          <p>Loading purchase details…</p>
        </div>
      </PageLayout>
    )
  }

  const isPaid = checkoutSession?.paymentStatus === 'paid'
  const email = checkoutSession?.customerEmail

  return (
    <PageLayout>
      <div className="min-h-[50vh] flex items-center justify-center py-12">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <CardTitle className="text-2xl">
              {isPaid ? 'Thank you for your purchase!' : 'Processing Payment…'}
            </CardTitle>
            <CardDescription>
              {isPaid
                ? 'Your order has been confirmed and you now have access to BetterStarter.'
                : 'Please wait while we confirm your payment.'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {isPaid && (
              <>
                {/* Show email confirmation */}
                {email && (
                  <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Mail className="w-4 h-4" />
                      Confirmation sent to
                    </div>
                    <p className="text-sm text-muted-foreground">{email}</p>
                  </div>
                )}

                {/* Next steps based on auth status */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Next Steps</h3>

                  {isLoggedIn ? (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Your purchase has been linked to your account. Head to
                        your dashboard to access your content.
                      </p>
                      <Button asChild className="w-full">
                        <Link to="/dashboard" className="flex gap-2">
                          Go to Dashboard
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Sign in with the email you used for purchase ({email})
                        to access your dashboard and download content.
                      </p>
                      <Button asChild className="w-full">
                        <Link
                          to="/auth/$authView"
                          params={{ authView: 'sign-in' }}
                          className="flex gap-2"
                        >
                          Sign In to Access
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Don't have an account? We'll create one for you
                        automatically.
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}
