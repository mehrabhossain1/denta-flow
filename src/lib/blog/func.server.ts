/**
 * Blog utilities for fetching and filtering blog posts.
 * Merges static posts from Content Collections with AI-generated posts
 * persisted in the database (serverless-safe).
 */

import { db } from '@/db'
import { allPosts } from 'content-collections'
import { renderMarkdown } from './markdown'
import type { BlogPost, BlogPostMeta } from './types'

function sortByDateDesc(
  left: { published: string },
  right: { published: string },
) {
  return (
    new Date(right.published).getTime() - new Date(left.published).getTime()
  )
}

async function loadDbPosts(): Promise<BlogPost[]> {
  const rows = await db.query.blogPost.findMany()
  return rows.map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    published: row.publishedAt.toISOString(),
    authors: row.authors,
    draft: row.draft,
    tags: row.tags,
    content: row.content,
  }))
}

function toMeta(post: BlogPost): BlogPostMeta {
  return {
    slug: post.slug,
    title: post.title,
    description: post.description,
    published: post.published,
    authors: post.authors,
    tags: post.tags,
    headerImage: post.headerImage,
  }
}

/**
 * Get all published blog posts merged from Content Collections + DB.
 * Static posts win on slug collisions.
 */
export async function getPublishedPosts(): Promise<BlogPostMeta[]> {
  const now = new Date()
  const dbPosts = await loadDbPosts()

  const staticMetas: BlogPostMeta[] = allPosts
    .filter((post) => !post.draft && new Date(post.published) <= now)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      published: post.published,
      authors: post.authors,
      tags: post.tags,
      headerImage: post.headerImage,
    }))

  const staticSlugs = new Set(staticMetas.map((p) => p.slug))
  const dbMetas = dbPosts
    .filter(
      (post) =>
        !post.draft &&
        new Date(post.published) <= now &&
        !staticSlugs.has(post.slug),
    )
    .map(toMeta)

  return [...staticMetas, ...dbMetas].sort(sortByDateDesc)
}

/**
 * Get a single blog post by slug with rendered HTML content.
 * Looks up Content Collections first, then falls back to DB.
 */
export async function getBlogPost(
  slug: string,
): Promise<(BlogPost & { isUnpublished: boolean }) | null> {
  const now = new Date()

  const staticPost = allPosts.find((item) => item.slug === slug)
  if (staticPost) {
    const publishDate = new Date(staticPost.published)
    const isUnpublished = staticPost.draft || publishDate > now
    const { markup } = renderMarkdown(staticPost.content)
    return { ...staticPost, markup, isUnpublished }
  }

  const row = await db.query.blogPost.findFirst({
    where: (p, { eq }) => eq(p.slug, slug),
  })
  if (!row) return null

  const publishDate = row.publishedAt
  const isUnpublished = row.draft || publishDate > now
  const { markup } = renderMarkdown(row.content)

  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    published: publishDate.toISOString(),
    authors: row.authors,
    draft: row.draft,
    tags: row.tags,
    content: row.content,
    markup,
    isUnpublished,
  }
}
