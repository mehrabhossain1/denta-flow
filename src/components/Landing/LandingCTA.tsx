import { STRIPE_CONFIG } from '@/constants/billing'
import { ArrowRight } from 'lucide-react'
import { PurchaseButton } from '../_common/PurchaseButton'
import { SectionHeader } from '../_common/SectionHeader'

export function LandingCTA() {
  return (
    <section className="pb-10">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <div className="rounded-2xl border border-border bg-muted/40 px-8 py-12 sm:px-12 flex flex-col items-center text-center">
          <SectionHeader
            title={
              <>
                Skip overthinking.&nbsp;
                <span className="text-muted-foreground font-normal">
                  Start shipping.
                </span>
              </>
            }
            description="One-time payment · Lifetime access · 30-day guarantee"
          />
          <PurchaseButton
            mode="payment"
            priceId={STRIPE_CONFIG.PRODUCTS.CORE.prices.ONE_TIME}
            className="px-8 text-base h-11"
          >
            Get BetterStarter for $99
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </PurchaseButton>
        </div>
      </div>
    </section>
  )
}
