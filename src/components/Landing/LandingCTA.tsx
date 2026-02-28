import { STRIPE_CONFIG } from '@/constants/billing'
import { Check } from 'lucide-react'
import { PurchaseButton } from '../_common/PurchaseButton'

const HIGHLIGHTS = [
  'TanStack Start + PostgreSQL + Drizzle ORM',
  'Authentication, payments, and email built in',
  'SEO optimized with best practices baked in',
  'One-time payment, lifetime updates',
]

export function CTASection() {
  return (
    <section className="py-20 sm:py-32">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
          Stop building from scratch.
          <br />
          <span className="text-green-600 dark:text-green-400">
            Start shipping.
          </span>
        </h2>

        <p className="lead text-muted-foreground mt-4 max-w-2xl">
          BetterStarter gives you a production-ready SaaS foundation with
          authentication, payments, database, and email, so you can focus on
          what makes your product unique.
        </p>

        <ul className="mt-8 flex flex-col gap-3">
          {HIGHLIGHTS.map((item) => (
            <li key={item} className="flex items-center gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 dark:text-green-400 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-10 flex flex-col items-start gap-3">
          <PurchaseButton
            mode="payment"
            priceId={STRIPE_CONFIG.PRODUCTS.CORE.prices.ONE_TIME}
            className="px-8 py-3 text-base"
          >
            Get BetterStarter for $99
          </PurchaseButton>
          <p className="text-xs text-muted-foreground">
            Pay once, own it forever. No subscriptions.
          </p>
        </div>
      </div>
    </section>
  )
}
