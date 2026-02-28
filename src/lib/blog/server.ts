import { getBlogPost, getPublishedPosts } from '@/lib/blog/func.server'
import type { BlogPost, BlogPostMeta } from '@/lib/blog/types'
import { createServerFn } from '@tanstack/react-start'

/**
 * Server function to fetch all published blog post metadata
 * Used for the blog listing page
 */
export const fetchBlogPosts = createServerFn({ method: 'GET' }).handler(
  async (): Promise<BlogPostMeta[]> => {
    return getPublishedPosts()
  },
)

/**
 * Server function to fetch a single blog post by slug with rendered HTML
 * Used for individual blog post pages
 */
export const fetchBlogPost = createServerFn({ method: 'GET' }).handler(
  async ({ data }): Promise<(BlogPost & { isUnpublished: boolean }) | null> => {
    const input = data as unknown as { slug: string }
    return getBlogPost(input.slug)
  },
)
