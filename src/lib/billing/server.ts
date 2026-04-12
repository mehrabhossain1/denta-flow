import { BILLING_CONFIG } from '@/constants/billing'
import { db } from '@/db'
import { entitlement, subscription } from '@/db/schema'
import { env } from '@/env'
import { authMiddleware } from '@/lib/auth/middleware'
import { provider } from '@/lib/billing/providers'
import type { CheckoutMode, LineItem } from '@/lib/billing/types'
import { canUseAI, getMonthlyUsage } from '@/lib/billing/usage'
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

    const baseUrl = env.APP_BASE_URL
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

    const baseUrl = env.APP_BASE_URL
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
 * Guest entitlements are stored with guestEmail
 */
export const claimGuestEntitlements = createServerFn({ method: 'POST' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user?.email) {
      throw new Error('UNAUTHORIZED')
    }

    const guestEmail = context.user.email

    // Find any entitlements for this guest email
    const guestEntitlements = await db
      .select()
      .from(entitlement)
      .where(eq(entitlement.guestEmail, guestEmail))

    if (guestEntitlements.length === 0) {
      return { claimed: 0 }
    }

    // Transfer entitlements to the authenticated user
    await db
      .update(entitlement)
      .set({ userId: context.user.id, guestEmail: null })
      .where(eq(entitlement.guestEmail, guestEmail))

    // Also check for guest subscriptions
    const guestSubs = await db
      .select()
      .from(subscription)
      .where(eq(subscription.guestEmail, guestEmail))

    if (guestSubs.length > 0) {
      await db
        .update(subscription)
        .set({ userId: context.user.id, guestEmail: null })
        .where(eq(subscription.guestEmail, guestEmail))
    }

    return {
      claimed: guestEntitlements.length,
      claimedSubscriptions: guestSubs.length,
    }
  })

/**
 * Returns the user's AI usage status for the current month.
 */
export const getAIUsageStatus = createServerFn({ method: 'GET' })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    if (!context.user) {
      return {
        allowed: true,
        usage: 0,
        limit: BILLING_CONFIG.FREE_AI_LIMIT,
        isPro: false,
      }
    }

    return canUseAI(context.user.id)
  })
