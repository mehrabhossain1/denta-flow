import { BILLING_CONFIG } from '@/constants/billing'
import { db } from '@/db'
import { aiUsage, subscription } from '@/db/schema'
import { and, eq, gte, sql } from 'drizzle-orm'

/**
 * Check if a user has an active subscription.
 */
async function hasActiveSubscription(userId: string): Promise<boolean> {
  const activeSub = await db.query.subscription.findFirst({
    where: (s, { and: _and, eq: _eq }) =>
      _and(_eq(s.userId, userId), sql`${s.status} IN ('active', 'trialing')`),
  })
  return !!activeSub
}

/**
 * Count AI usage for the current calendar month.
 */
export async function getMonthlyUsage(userId: string): Promise<number> {
  const now = new Date()
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

  const result = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), gte(aiUsage.createdAt, monthStart)))

  return result[0]?.count ?? 0
}

/**
 * Check if a user can use AI features.
 * Returns { allowed, usage, limit, isPro }
 */
export async function canUseAI(userId: string) {
  const isPro = await hasActiveSubscription(userId)

  if (isPro) {
    return { allowed: true, usage: 0, limit: -1, isPro: true }
  }

  const usage = await getMonthlyUsage(userId)
  const limit = BILLING_CONFIG.FREE_AI_LIMIT

  return {
    allowed: usage < limit,
    usage,
    limit,
    isPro: false,
  }
}

/**
 * Record an AI usage event.
 */
export async function incrementUsage(userId: string, action: string) {
  await db.insert(aiUsage).values({
    id: crypto.randomUUID(),
    userId,
    action,
  })
}
