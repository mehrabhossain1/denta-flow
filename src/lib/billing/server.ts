import { BILLING_CONFIG } from '@/constants/billing'
import { db } from '@/db'
import { entitlement, subscription } from '@/db/schema'
import { authMiddleware } from '@/lib/auth/middleware'
import { provider } from '@/lib/billing/providers'
import type { CheckoutMode, LineItem } from '@/lib/billing/types'
import { createServerFn } from '@tanstack/react-start'
import { eq } from 'drizzle-orm'

type CreateCheckoutInput = {
  mode: CheckoutMode
  priceId?: string
  lineItems?: LineItem[]
  metadata?: Record<string, string>
}

/**
 * Creates a Stripe Checkout session.
 * Works for both authenticated and guest users.
 * For guests, Stripe collects email during checkout.
 */
export const createCheckoutSession = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const input = data as unknown as CreateCheckoutInput

    const baseUrl = process.env.APP_BASE_URL as string
    const successUrl = `${baseUrl}${BILLING_CONFIG.SUCCESS_PATH}?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${baseUrl}${BILLING_CONFIG.CANCEL_PATH}`

    const result = await provider.createCheckoutSession({
      user: context.user ?? undefined,
      mode: input.mode,
      priceId: input.priceId,
      lineItems: input.lineItems,
      successUrl,
      cancelUrl,
      metadata: input.metadata,
    })

    return result
  })

export const createBillingPortalSession = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) {
      throw new Error('UNAUTHORIZED')
    }

    const baseUrl = process.env.APP_BASE_URL as string
    const returnUrl = `${baseUrl}${BILLING_CONFIG.SUCCESS_PATH}`

    const result = await provider.createPortalSession({
      user: context.user,
      returnUrl,
    })

    return result
  })

export const getBillingStatus = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) {
      return { subscriptions: [], entitlements: [] }
    }

    const subs = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, context.user.id))

    const ents = await db
      .select()
      .from(entitlement)
      .where(eq(entitlement.userId, context.user.id))

    return { subscriptions: subs, entitlements: ents }
  })

/**
 * Retrieves checkout session details after successful purchase.
 * Used on the success page to show confirmation and trigger account creation.
 */
export const getCheckoutSession = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ data }) => {
    const input = data as unknown as { sessionId: string }
    if (!input.sessionId) {
      throw new Error('SESSION_ID_REQUIRED')
    }
    return provider.getCheckoutSession(input.sessionId)
  })

/**
 * Claims entitlements purchased as a guest.
 * This should be called after a user signs in/up with the same email used during checkout.
 * Guest entitlements are stored with userId = 'guest:{email}'
 */
export const claimGuestEntitlements = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user?.email) {
      throw new Error('UNAUTHORIZED')
    }

    const guestUserId = `guest:${context.user.email}`

    // Find any entitlements for this guest email
    const guestEntitlements = await db
      .select()
      .from(entitlement)
      .where(eq(entitlement.userId, guestUserId))

    if (guestEntitlements.length === 0) {
      return { claimed: 0 }
    }

    // Transfer entitlements to the authenticated user
    await db
      .update(entitlement)
      .set({ userId: context.user.id })
      .where(eq(entitlement.userId, guestUserId))

    // Also check for guest subscriptions
    const guestSubs = await db
      .select()
      .from(subscription)
      .where(eq(subscription.userId, guestUserId))

    if (guestSubs.length > 0) {
      await db
        .update(subscription)
        .set({ userId: context.user.id })
        .where(eq(subscription.userId, guestUserId))
    }

    return {
      claimed: guestEntitlements.length,
      claimedSubscriptions: guestSubs.length,
    }
  })
