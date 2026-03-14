import type { BlogPost, BlogPostMeta } from '@/lib/blog/types'
import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'

/**
 * Server function to fetch all published blog post metadata
 * Used for the blog listing page
 */
export const fetchBlogPosts = createServerFn({ method: 'GET' }).handler(
  async (): Promise<BlogPostMeta[]> => {
    const { getPublishedPosts } = await import('@/lib/blog/func.server')
    return getPublishedPosts()
  },
)

/**
 * Server function to fetch a single blog post by slug with rendered HTML
 * Used for individual blog post pages
 */
export const fetchBlogPost = createServerFn({ method: 'POST' })
  .inputValidator(
    z.object({
      slug: z.string(),
    }),
  )
  .handler(
    async ({
      data,
    }): Promise<(BlogPost & { isUnpublished: boolean }) | null> => {
      const input = data as unknown as { slug: string }
      const { getBlogPost } = await import('@/lib/blog/func.server')
      return getBlogPost(input.slug)
    },
  )
