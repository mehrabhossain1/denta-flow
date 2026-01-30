import { BILLING_CONFIG, BILLING_PROVIDERS } from '@/constants/billing'
import type { BillingProvider } from '../types'
import { stripeProvider } from './stripe'

/**
 * Returns the active billing provider based on config.
 * Add new providers here as they are implemented.
 */
function getProvider(): BillingProvider {
  switch (BILLING_CONFIG.ACTIVE_PROVIDER) {
    case BILLING_PROVIDERS.STRIPE:
    default:
      return stripeProvider
  }
}

export const provider = getProvider()
