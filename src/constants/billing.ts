export const BILLING_PROVIDERS = {
  STRIPE: 'stripe',
} as const

export type BillingProviderKey =
  (typeof BILLING_PROVIDERS)[keyof typeof BILLING_PROVIDERS]

export const BILLING_CONFIG = {
  ACTIVE_PROVIDER: BILLING_PROVIDERS.STRIPE,
  SUCCESS_PATH: '/purchase/success',
  CANCEL_PATH: '/#pricing',
} as const

import { env } from '@/env'

/**
 * Stripe-specific configuration.
 * Prices are nested under their parent product.
 */
export const STRIPE_CONFIG = {
  PROMOTION_CODE_ID: env.VITE_STRIPE_PROMOTION_CODE_ID,
  PRODUCTS: {
    CORE: {
      id: env.VITE_STRIPE_PRODUCT_CORE_ID,
      name: 'BetterStarter Core',
      prices: {
        ONE_TIME: env.VITE_STRIPE_PRICE_CORE_ONE_TIME_ID,
      },
    },
  },
} as const

/** Helper to get a price ID */
export function getPrice(
  product: keyof typeof STRIPE_CONFIG.PRODUCTS,
  price: keyof (typeof STRIPE_CONFIG.PRODUCTS)[typeof product]['prices'],
) {
  return STRIPE_CONFIG.PRODUCTS[product].prices[price]
}
