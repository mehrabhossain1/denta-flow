import config from '@/appConfig'

// Default optimization settings
const DEFAULT_WIDTH = 800
const DEFAULT_QUALITY = 80

export interface ImageOptimizationOptions {
  width?: number
  height?: number
  quality?: number
}

/**
 * Build a Netlify Image CDN URL for optimized image delivery.
 * Returns the original src in development, when disabled, or for external URLs, data URIs, and SVGs.
 *
 * @see https://docs.netlify.com/build/image-cdn/overview/
 */
export function getNetlifyImageUrl(
  src: string | undefined | null,
  options: ImageOptimizationOptions = {},
): string {
  // Return empty string for null/undefined
  if (!src) {
    return ''
  }

  // Skip if feature is disabled globally
  if (!config.features.imageOptimization.enabled) {
    return src
  }

  // Skip in development (Netlify Image CDN only works in production)
  if (import.meta.env.DEV) {
    return src
  }

  // Skip external URLs, data URIs, and SVGs
  if (
    src.startsWith('http') ||
    src.startsWith('data:') ||
    src.endsWith('.svg')
  ) {
    return src
  }

  const { width = DEFAULT_WIDTH, quality = DEFAULT_QUALITY } = options

  return `/.netlify/images?url=${encodeURIComponent(src)}&w=${width}&q=${quality}`
}
