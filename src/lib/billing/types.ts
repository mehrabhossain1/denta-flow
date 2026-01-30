export type CheckoutMode = 'subscription' | 'payment'

export type LineItem = {
  price: string
  quantity?: number
}

/**
 * Minimal user info needed for billing operations.
 * This avoids coupling to the full User schema from auth.
 */
export type BillingUser = {
  id: string
  name: string
  email: string
  image?: string | null
}

export type CreateCheckoutParams = {
  /** User is optional for guest checkout. Stripe will collect email. */
  user?: BillingUser
  mode: CheckoutMode
  priceId?: string
  lineItems?: LineItem[]
  successUrl: string
  cancelUrl: string
  metadata?: Record<string, string>
}

export type CreatePortalParams = {
  user: BillingUser
  returnUrl: string
}

export type CheckoutResult = {
  url: string
}

export type PortalResult = {
  url: string
}

export type CheckoutSessionDetails = {
  id: string
  status: string
  customerEmail: string | null
  customerId: string | null
  paymentStatus: string
  amountTotal: number | null
  currency: string | null
}

/**
 * Provider-agnostic billing interface.
 * Implement this for Stripe, Lemon Squeezy, Paddle, etc.
 */
export interface BillingProvider {
  createCheckoutSession(params: CreateCheckoutParams): Promise<CheckoutResult>
  createPortalSession(params: CreatePortalParams): Promise<PortalResult>
  getCheckoutSession(sessionId: string): Promise<CheckoutSessionDetails>
  verifyAndHandleWebhook(payload: string, signature: string): Promise<void>
}
