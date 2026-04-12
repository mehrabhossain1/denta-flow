import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const patient = pgTable('patient', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone'),
  notes: text('notes'),
  userId: text('user_id')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .$onUpdate(() => /* @__PURE__ */ new Date())
    .notNull(),
})

// Type exports
export type Patient = typeof patient.$inferSelect
export type NewPatient = typeof patient.$inferInsert
export type PatientId = Patient['id']
