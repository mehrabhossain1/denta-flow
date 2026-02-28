/**
 * Blog utilities for fetching and filtering blog posts
 * Uses Content Collections as the source of truth
 */

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

/**
 * Get all published blog posts
 * - Filters out drafts
 * - Filters out future-dated posts
 * - Sorted by publish date descending (newest first)
 */
export function getPublishedPosts(): BlogPostMeta[] {
  const now = new Date()

  return allPosts
    .filter((post) => !post.draft && new Date(post.published) <= now)
    .sort(sortByDateDesc)
    .map((post) => ({
      slug: post.slug,
      title: post.title,
      description: post.description,
      published: post.published,
      authors: post.authors,
      tags: post.tags,
      headerImage: post.headerImage,
    }))
}

/**
 * Get a single blog post by slug with rendered HTML content
 * Returns null if post not found or is not published (draft or future-dated)
 */
export function getBlogPost(
  slug: string,
): (BlogPost & { isUnpublished: boolean }) | null {
  const post = allPosts.find((item) => item.slug === slug)
  if (!post) {
    return null
  }

  const now = new Date()
  const publishDate = new Date(post.published)
  const isUnpublished = post.draft || publishDate > now

  // Render markdown to HTML
  const { markup } = renderMarkdown(post.content)

  return {
    ...post,
    markup,
    isUnpublished,
  }
}
