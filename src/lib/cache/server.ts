import { setResponseHeaders } from '@tanstack/react-start/server'
import { getNetlifyCacheHeaders } from './index'

/**
 * Set cache headers for server functions
 *
 * Use this in TanStack Start server functions to set response cache headers.
 * For route-level caching, use getNetlifyCacheHeaders() instead.
 *
 * @param cacheConfig - Object with maxAge and swr durations in seconds
 */
export function setNetlifyCacheHeaders(cacheConfig: {
  maxAge: number
  swr: number
}): void {
  const headers = getNetlifyCacheHeaders(cacheConfig)
  setResponseHeaders(new Headers(headers))
}

/**
 * Helper to purge Netlify cache via API
 * Call this when content is updated (e.g., profile edit, product add)
 *
 * Requires NETLIFY_API_TOKEN and NETLIFY_SITE_ID environment variables
 */
export async function purgeNetlifyCDN(paths: string[]): Promise<void> {
  const apiToken = process.env.NETLIFY_API_TOKEN
  const siteId = process.env.NETLIFY_SITE_ID

  if (!apiToken || !siteId) {
    console.warn(
      'Netlify API token or site ID not configured for cache purging',
    )
    return
  }

  try {
    // Netlify purge API endpoint
    const response = await fetch(
      `https://api.netlify.com/api/v1/sites/${siteId}/deploys/latest/purge`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiToken}`,
        },
        body: JSON.stringify({ paths }),
      },
    )

    if (!response.ok) {
      throw new Error(`Failed to purge CDN: ${response.statusText}`)
    }

    console.log(`Successfully purged CDN for paths: ${paths.join(', ')}`)
  } catch (error) {
    console.error('Error purging Netlify CDN:', error)
    // Don't throw - cache purge is non-critical
  }
}
