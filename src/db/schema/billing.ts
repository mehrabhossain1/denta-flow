import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

/**
 * Maps a user to their billing provider customer ID.
 * Supports multiple providers per user if needed.
 */
export const billingCustomer = pgTable('billing_customer', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  customerId: text('customer_id').notNull(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

/**
 * Tracks recurring subscriptions.
 */
export const subscription = pgTable('subscription', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  subscriptionId: text('subscription_id').notNull(),
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  guestEmail: text('guest_email'),
  status: text('status').notNull(),
  productId: text('product_id'),
  priceId: text('price_id'),
  currentPeriodStart: timestamp('current_period_start'),
  currentPeriodEnd: timestamp('current_period_end'),
  cancelAt: timestamp('cancel_at'),
  canceledAt: timestamp('canceled_at'),
  trialEnd: timestamp('trial_end'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
})

/**
 * Tracks one-time purchase entitlements (lifetime access, credits, etc.).
 */
export const entitlement = pgTable('entitlement', {
  id: text('id').primaryKey(),
  provider: text('provider').notNull(),
  sourceId: text('source_id').notNull(), // checkout session or payment intent ID
  userId: text('user_id').references(() => user.id, { onDelete: 'cascade' }),
  guestEmail: text('guest_email'),
  productId: text('product_id').notNull(),
  grantedAt: timestamp('granted_at').defaultNow().notNull(),
  expiresAt: timestamp('expires_at'),
})

// Type exports
export type BillingCustomer = typeof billingCustomer.$inferSelect
export type NewBillingCustomer = typeof billingCustomer.$inferInsert

export type Subscription = typeof subscription.$inferSelect
export type NewSubscription = typeof subscription.$inferInsert

export type Entitlement = typeof entitlement.$inferSelect
export type NewEntitlement = typeof entitlement.$inferInsert
