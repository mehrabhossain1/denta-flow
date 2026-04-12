import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

/**
 * Tracks AI feature usage per user for free tier limits.
 */
export const aiUsage = pgTable('ai_usage', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  action: text('action').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export type AiUsage = typeof aiUsage.$inferSelect
export type NewAiUsage = typeof aiUsage.$inferInsert
