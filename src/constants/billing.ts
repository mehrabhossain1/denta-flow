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

/**
 * Stripe-specific configuration.
 * Prices are nested under their parent product.
 */
export const STRIPE_CONFIG = {
  PRODUCTS: {
    CORE: {
      id: 'prod_TrJsIQngzzbNJT',
      name: 'Better-Starter Core',
      prices: {
        ONE_TIME: 'price_1StbERELFHFYjexwte8HtNeB',
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
