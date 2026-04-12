'use client'

import { STRIPE_CONFIG } from '@/constants/billing'
import { Check } from 'lucide-react'
import { useState } from 'react'
import { PurchaseButton } from '../_common/PurchaseButton'
import { SectionHeader } from '../_common/SectionHeader'

const FREE_FEATURES = [
  '10 AI requests per month',
  'Patient management',
  'AI follow-up messages',
  'Treatment explanations',
  'Post-care instructions',
  'Blog reading access',
]

const PRO_FEATURES = [
  'Unlimited AI requests',
  'Everything in Free',
  'AI blog post generator',
  'Priority AI responses',
  'Early access to new features',
  'Email support',
]

export function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false)

  const monthlyPrice = 19
  const annualPrice = 190
  const annualMonthly = Math.round((annualPrice / 12) * 100) / 100
  const savings = Math.round(
    ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100,
  )

  return (
    <section id="pricing" className="py-10 sm:py-20">
      <div className="mx-auto max-w-4xl px-6 sm:px-8">
        <SectionHeader
          eyebrow="Pricing"
          title={
            <>
              Start free,{' '}
              <span className="text-muted-foreground font-normal">
                upgrade when you're ready.
              </span>
            </>
          }
          description="No credit card required. Try DentaFlow free with 10 AI requests per month."
        />

        {/* Billing toggle */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <span
            className={`text-sm ${!isAnnual ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
          >
            Monthly
          </span>
          <button
            type="button"
            role="switch"
            aria-checked={isAnnual}
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
              isAnnual ? 'bg-primary' : 'bg-muted-foreground/30'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform ${
                isAnnual ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
          <span
            className={`text-sm ${isAnnual ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}
          >
            Annual
          </span>
          {isAnnual && (
            <span className="text-xs font-semibold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-2 py-0.5 rounded-full">
              Save {savings}%
            </span>
          )}
        </div>

        {/* Cards */}
        <div className="grid gap-6 sm:grid-cols-2 max-w-3xl mx-auto">
          {/* Free */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Free</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Get started with AI-powered dental tools
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">$0</span>
              <span className="text-sm text-muted-foreground">/ forever</span>
            </div>

            <a
              href="/auth/sign-up"
              className="inline-flex items-center justify-center w-full rounded-full text-sm font-medium h-10 px-6 border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground transition-all"
            >
              Get Started Free
            </a>

            <ul className="space-y-3">
              {FREE_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro */}
          <div className="relative rounded-2xl border-2 border-primary bg-card p-6 space-y-6">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full">
              Most Popular
            </div>

            <div>
              <h3 className="text-lg font-semibold">Pro</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Unlimited AI for your entire practice
              </p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-bold tracking-tight">
                ${isAnnual ? annualMonthly : monthlyPrice}
              </span>
              <span className="text-sm text-muted-foreground">/ month</span>
              {isAnnual && (
                <span className="text-xs text-muted-foreground ml-1">
                  (billed ${annualPrice}/yr)
                </span>
              )}
            </div>

            <PurchaseButton
              mode="subscription"
              priceId={
                isAnnual
                  ? STRIPE_CONFIG.PRODUCTS.CORE.prices.ANNUAL
                  : STRIPE_CONFIG.PRODUCTS.CORE.prices.MONTHLY
              }
              className="w-full h-10 rounded-full"
            >
              Start Pro Plan
            </PurchaseButton>

            <ul className="space-y-3">
              {PRO_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground/80">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
