import { BILLING_PROVIDERS, STRIPE_CONFIG } from '@/constants/billing'
import { db } from '@/db'
import { billingCustomer, entitlement, subscription } from '@/db/schema'
import { and, eq } from 'drizzle-orm'
import Stripe from 'stripe'
import type {
  BillingProvider,
  BillingUser,
  CreateCheckoutParams,
  CreatePortalParams,
} from '../types'

let stripeClient: Stripe | null = null
let hasLoggedStripeWarning = false

function logStripeConfigWarning() {
  if (hasLoggedStripeWarning) return

  const missingKeys = [
    process.env.STRIPE_SECRET_KEY ? null : 'STRIPE_SECRET_KEY',
    process.env.STRIPE_WEBHOOK_SECRET ? null : 'STRIPE_WEBHOOK_SECRET',
  ].filter(Boolean)

  if (missingKeys.length > 0) {
    console.warn(
      `Stripe credentials not configured. Billing is disabled until ${missingKeys.join(', ')} is set.`,
    )
    hasLoggedStripeWarning = true
  }
}

function getStripeClient(): Stripe {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) {
    logStripeConfigWarning()
    throw new Error('STRIPE_NOT_CONFIGURED')
  }

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey)
  }

  return stripeClient
}

logStripeConfigWarning()

/**
 * Ensures the user has a Stripe customer record.
 * Creates one if missing and stores mapping in billingCustomer table.
 */
async function ensureCustomer(user: BillingUser): Promise<string> {
  const stripe = getStripeClient()

  const existing = await db.query.billingCustomer.findFirst({
    where: (bc, { and: _and, eq: _eq }) =>
      _and(_eq(bc.userId, user.id), _eq(bc.provider, BILLING_PROVIDERS.STRIPE)),
  })

  if (existing) return existing.customerId

  const created = await stripe.customers.create({
    email: user.email,
    name: user.name,
    metadata: { user_id: user.id },
  })

  await db.insert(billingCustomer).values({
    id: crypto.randomUUID(),
    provider: BILLING_PROVIDERS.STRIPE,
    customerId: created.id,
    userId: user.id,
  })

  return created.id
}

function normalizeLineItems(
  lineItems?: Array<{ price: string; quantity?: number }>,
  priceId?: string,
) {
  if (lineItems?.length) {
    return lineItems.map((item) => ({
      price: item.price,
      quantity: item.quantity ?? 1,
    }))
  }
  if (priceId) {
    return [{ price: priceId, quantity: 1 }]
  }
  throw new Error('LINE_ITEMS_OR_PRICE_REQUIRED')
}

async function upsertSubscription(
  userId: string,
  sub: Stripe.Subscription,
): Promise<void> {
  const subId = sub.id
  const status = sub.status
  const priceId = sub.items.data[0]?.price?.id
  const productRef = sub.items.data[0]?.price?.product
  const productId = typeof productRef === 'string' ? productRef : productRef?.id

  const existing = await db.query.subscription.findFirst({
    where: (s, { and: _and, eq: _eq }) =>
      _and(
        _eq(s.subscriptionId, subId),
        _eq(s.provider, BILLING_PROVIDERS.STRIPE),
      ),
  })

  // Access period dates for newer API versions
  const periodStart = (sub as unknown as { current_period_start?: number })
    .current_period_start
  const periodEnd = (sub as unknown as { current_period_end?: number })
    .current_period_end

  const values = {
    provider: BILLING_PROVIDERS.STRIPE,
    subscriptionId: subId,
    userId,
    status,
    priceId,
    productId,
    currentPeriodStart: periodStart ? new Date(periodStart * 1000) : null,
    currentPeriodEnd: periodEnd ? new Date(periodEnd * 1000) : null,
    cancelAt: sub.cancel_at ? new Date(sub.cancel_at * 1000) : null,
    canceledAt: sub.canceled_at ? new Date(sub.canceled_at * 1000) : null,
    trialEnd: sub.trial_end ? new Date(sub.trial_end * 1000) : null,
  }

  if (existing) {
    await db
      .update(subscription)
      .set(values)
      .where(
        and(
          eq(subscription.subscriptionId, subId),
          eq(subscription.provider, BILLING_PROVIDERS.STRIPE),
        ),
      )
  } else {
    await db.insert(subscription).values({
      id: crypto.randomUUID(),
      ...values,
    })
  }
}

async function grantEntitlement(
  userId: string,
  productId: string,
  sourceId: string,
): Promise<void> {
  // Idempotent: skip if already granted for this source
  const existing = await db.query.entitlement.findFirst({
    where: (e, { and: _and, eq: _eq }) =>
      _and(
        _eq(e.sourceId, sourceId),
        _eq(e.provider, BILLING_PROVIDERS.STRIPE),
      ),
  })
  if (existing) return

  await db.insert(entitlement).values({
    id: crypto.randomUUID(),
    provider: BILLING_PROVIDERS.STRIPE,
    sourceId,
    userId,
    productId,
  })
}

export const stripeProvider: BillingProvider = {
  async createCheckoutSession({
    user,
    mode,
    priceId,
    lineItems,
    successUrl,
    cancelUrl,
    metadata,
  }: CreateCheckoutParams) {
    const items = normalizeLineItems(lineItems, priceId)
    const stripe = getStripeClient()

    // For authenticated users, attach to existing customer
    // For guests, let Stripe collect email and create customer
    const customerOptions: Stripe.Checkout.SessionCreateParams = user
      ? { customer: await ensureCustomer(user) }
      : { customer_creation: 'always' }

    const session = await stripe.checkout.sessions.create({
      ...customerOptions,
      mode,
      line_items: items,
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: user?.id ?? '',
        mode,
        ...metadata,
      },
      allow_promotion_codes: true,
    })

    if (!session.url) {
      throw new Error('CHECKOUT_SESSION_URL_MISSING')
    }

    return { url: session.url }
  },

  async createPortalSession({ user, returnUrl }: CreatePortalParams) {
    const stripe = getStripeClient()
    const customerId = await ensureCustomer(user)

    const portal = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    })

    return { url: portal.url }
  },

  async getCheckoutSession(sessionId: string) {
    const stripe = getStripeClient()
    const session = await stripe.checkout.sessions.retrieve(sessionId)

    return {
      id: session.id,
      status: session.status ?? 'unknown',
      customerEmail: session.customer_details?.email ?? null,
      customerId:
        typeof session.customer === 'string'
          ? session.customer
          : (session.customer?.id ?? null),
      paymentStatus: session.payment_status,
      amountTotal: session.amount_total,
      currency: session.currency,
    }
  },

  async verifyAndHandleWebhook(payload: string, signature: string) {
    const stripe = getStripeClient()
    const secret = process.env.STRIPE_WEBHOOK_SECRET
    if (!secret) {
      logStripeConfigWarning()
      throw new Error('STRIPE_WEBHOOK_SECRET_MISSING')
    }
    const event = stripe.webhooks.constructEvent(payload, signature, secret)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.user_id
        const mode = (session.metadata?.mode ?? session.mode) as
          | 'subscription'
          | 'payment'
        const customerEmail = session.customer_details?.email

        // For authenticated users, use their ID
        // For guests, we'll store entitlement with email-based placeholder
        // The entitlement will be claimed when user signs up with that email
        const effectiveUserId = userId || `guest:${customerEmail}`

        if (!effectiveUserId || effectiveUserId === 'guest:null') {
          console.warn(
            '[stripe] checkout.session.completed: no user_id or customer email',
          )
          break
        }

        if (
          mode === 'subscription' &&
          typeof session.subscription === 'string'
        ) {
          const sub = await stripe.subscriptions.retrieve(session.subscription)
          await upsertSubscription(effectiveUserId, sub)
        } else if (mode === 'payment') {
          const productId =
            session.metadata?.product_id ?? STRIPE_CONFIG.PRODUCTS.CORE.id
          await grantEntitlement(effectiveUserId, productId, session.id)
        }
        break
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription
        let userId = sub.metadata?.user_id

        if (!userId) {
          // Fallback: resolve via billingCustomer table
          const custId =
            typeof sub.customer === 'string' ? sub.customer : sub.customer.id
          const bc = await db.query.billingCustomer.findFirst({
            where: (bc, { and: _and, eq: _eq }) =>
              _and(
                _eq(bc.customerId, custId),
                _eq(bc.provider, BILLING_PROVIDERS.STRIPE),
              ),
          })
          if (bc?.userId) {
            userId = bc.userId
          }
        }

        if (userId) {
          await upsertSubscription(userId, sub)
        } else {
          console.warn(
            `[stripe] ${event.type} could not resolve userId for sub ${sub.id}`,
          )
        }
        break
      }

      case 'payment_intent.succeeded':
      default:
        // Optional: record payments for analytics
        break
    }
  },
}
