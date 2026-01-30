import { STRIPE_CONFIG } from '@/constants/billing'
import { Check } from 'lucide-react'
import { PurchaseButton } from '../_common/PurchaseButton'
import { SectionHeader } from '../_common/SectionHeader'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card'

const PRICING_PLANS = [
  {
    name: 'Core',
    description: 'Everything you need to launch your startup',
    originalPrice: 149,
    discountedPrice: 49,
    features: [
      'Full source code access',
      'PostgreSQL + Drizzle ORM setup',
      'Authentication with better-auth',
      'Email service with Plunk',
      'Payment integration with Stripe',
      '60+ shadcn/ui components + TailwindCSS v4',
      'Caching, best-practices',
      'SEO & AEO Best Practices',
      'Complete documentation & videos',
      'Lifetime updates',
    ],
    cta: 'Get Better-Starter',
    highlight: true,
  },
]

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-muted/40">
      <div className="mx-auto max-w-5xl px-6 sm:px-8">
        <SectionHeader
          title="Simple, transparent pricing"
          description="No hidden fees, no surprises. Save hours, Launch Quicker"
        />
        <div className="flex flex-col md:flex-row justify-center ">
          {PRICING_PLANS.map((plan) => {
            const hasDiscount =
              typeof plan.originalPrice === 'number' &&
              typeof plan.discountedPrice === 'number' &&
              plan.originalPrice > plan.discountedPrice

            return (
              <Card
                key={plan.name}
                className={`h-full flex flex-col min-w-1/2 transition-all ${
                  plan.highlight
                    ? 'border-green-500/50 bg-gradient-to-br from-green-500/5 to-transparent ring-2 ring-green-500/20'
                    : 'hover:border-green-500/40'
                }`}
              >
                <CardHeader className="justify-center">
                  <CardTitle className="text-2xl text-center">
                    {plan.name}
                  </CardTitle>
                  <CardDescription className="text-center">
                    {plan.description}
                  </CardDescription>

                  {/* Pricing Display */}
                  <div className="flex justify-center items-center gap-2 pt-6">
                    {hasDiscount && (
                      <div className="flex flex-col items-center">
                        <span className="text-lg text-muted-foreground line-through">
                          ${plan.originalPrice}
                        </span>
                      </div>
                    )}
                    <div className="flex gap-1 items-baseline">
                      <span className="text-4xl font-bold">
                        ${plan.discountedPrice ?? plan.originalPrice}
                      </span>
                      <p className="text-sm text-muted-foreground pt-2">
                        /one-time
                      </p>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 flex flex-col gap-6">
                  {/* Features List */}
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex gap-3 items-start">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                        <span className="text-sm leading-relaxed">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <PurchaseButton
                    mode="payment"
                    priceId={STRIPE_CONFIG.PRODUCTS.CORE.prices.ONE_TIME}
                    variant={plan.highlight ? 'default' : 'outline'}
                    className="w-full"
                  >
                    {plan.cta}
                  </PurchaseButton>
                  <p className="text-xs text-center">
                    Pay once, launch unlimited startups.
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
