/**
 * Cache control utilities for Netlify ISR (Incremental Static Regeneration)
 *
 * For thousands of pages, we use:
 * - CDN caching with stale-while-revalidate
 * - On-demand purging when content changes
 */

export const CACHE_DURATIONS = {
  // Individual pages (profile, product) - cache briefly, revalidate in background
  INDIVIDUAL_PAGE: { maxAge: 60 * 60, swr: 24 * 60 * 60 }, // 1 hour, revalidate for 24 hours
  // List/index pages - cache briefly, revalidate frequently
  LIST_PAGE: { maxAge: 5 * 60, swr: 60 * 60 }, // 5 minutes, revalidate for 1 hour
  // Search results - minimal cache, frequent revalidation
  SEARCH: { maxAge: 60, swr: 10 * 60 }, // 1 minute, revalidate for 10 minutes
  // Dynamic/user-specific - no cache
  NO_CACHE: { maxAge: 0, swr: 0 },
} as const

/**
 * Get cache headers for Netlify CDN caching following ISR best practices
 *
 * ISR Strategy:
 * - Short max-age: Controls revalidation frequency
 * - Long stale-while-revalidate: Serves instant cached response while updating
 * - Browser always checks CDN (max-age=0 in Cache-Control)
 *
 * @param cacheConfig - Object with maxAge and swr durations in seconds
 * @returns Cache headers for the response
 */
export function getNetlifyCacheHeaders(cacheConfig: {
  maxAge: number
  swr: number
}): HeadersInit {
  const { maxAge, swr } = cacheConfig

  if (maxAge === 0) {
    return {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Netlify-CDN-Cache-Control': 'no-cache',
    }
  }

  return {
    // Browser: Always revalidate with CDN
    'Cache-Control': 'public, max-age=0, must-revalidate',
    // CDN: Cache with durable storage + stale-while-revalidate for instant responses
    'Netlify-CDN-Cache-Control': `public, max-age=${maxAge}, durable, stale-while-revalidate=${swr}`,
  }
}
