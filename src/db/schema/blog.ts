import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth'

export const blogPost = pgTable('blog_post', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  content: text('content').notNull(),
  tags: text('tags').array().notNull().default([]),
  authors: text('authors').array().notNull().default([]),
  authorId: text('author_id').references(() => user.id, {
    onDelete: 'set null',
  }),
  draft: boolean('draft').notNull().default(false),
  publishedAt: timestamp('published_at').defaultNow().notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at')
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
})

export type BlogPostRow = typeof blogPost.$inferSelect
export type NewBlogPostRow = typeof blogPost.$inferInsert
