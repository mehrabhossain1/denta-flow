import { STRIPE_CONFIG } from '@/constants/billing'
import { Check, ShieldCheck } from 'lucide-react'
import { PurchaseButton } from '../_common/PurchaseButton'
import { SectionHeader } from '../_common/SectionHeader'

const PLAN = {
  label: 'Early Adopter Discount',
  description:
    "Try it out. If you're not happy, we'll refund you — no questions asked.",
  originalPrice: 199,
  discountedPrice: 99,
  oneTime: true,
  features: [
    'Full source code access',
    'PostgreSQL + Drizzle ORM setup',
    'Authentication with better-auth',
    'Email service with Plunk',
    'Payment integration with Stripe',
    '60+ shadcn/ui components + TailwindCSS v4',
    'Blog & Docs engine (MDX)',
    'SEO & AEO best practices',
    'Admin panel',
    'AI-ready agent instructions',
    'Complete documentation & videos',
    'Lifetime updates',
  ],
  cta: 'Get BetterStarter',
  priceId: STRIPE_CONFIG.PRODUCTS.CORE.prices.ONE_TIME,
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-10 sm:py-20">
      <div className="mx-auto max-w-2xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Pricing"
          title={
            <>
              Simple pricing{' '}
              <span className="text-muted-foreground font-normal">
                that you'll love.
              </span>
            </>
          }
          description="One payment. Full access. No subscriptions, no surprises."
        />

        {/* Card */}
        <div className="card-bg relative rounded-2xl border border-border bg-card p-6 space-y-6 max-w-sm mx-auto">
          {/* Tilted discount ribbon */}
          <div className="absolute -top-3 -right-3 rotate-12 bg-amber-400 text-amber-950 text-[10px] font-bold px-2.5 py-1 rounded-md shadow-sm select-none">
            {PLAN.label}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2.5 justify-center">
            <span className="text-4xl font-bold tracking-tight">
              ${PLAN.discountedPrice}
            </span>
            <span className="text-sm text-muted-foreground line-through">
              ${PLAN.originalPrice}
            </span>
            <span className="text-sm text-muted-foreground">/ lifetime</span>
          </div>

          {/* CTA */}
          <PurchaseButton
            mode="payment"
            priceId={PLAN.priceId}
            className="w-full py-3 text-base"
          >
            {PLAN.cta}
          </PurchaseButton>

          {/* Feature list */}
          <ul className="space-y-3">
            {PLAN.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                <span className="text-sm text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>

          {/* Money-back guarantee */}
          <div className="pt-4 border-t border-border flex items-start gap-3">
            <ShieldCheck className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-semibold">
                30-Day Money-Back Guarantee
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Not happy? Let us know within 30 days for a full refund.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
