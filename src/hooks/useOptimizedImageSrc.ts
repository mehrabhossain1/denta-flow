import {
  getNetlifyImageUrl,
  type ImageOptimizationOptions,
} from '@/lib/NetlifyImageCDN'

/**
 * Hook to get an optimized image URL using Netlify Image CDN.
 * Returns the optimized URL in production or original URL when disabled/in development.
 *
 * Usage:
 *   const src = useOptimizedImageSrc(avatarUrl, { width: 400, quality: 85 })
 *   return <img src={src} alt="..." />
 *
 * To remove this feature:
 *   1. Delete this file and NetlifyImageCDN.ts
 *   2. Replace: `const src = useOptimizedImageSrc(rawSrc, options)` with `const src = rawSrc || ''`
 *   3. Or just use the raw src directly: `<img src={rawSrc || ''} />`
 */
export function useOptimizedImageSrc(
  src: string | null | undefined,
  options?: ImageOptimizationOptions,
): string {
  return getNetlifyImageUrl(src, options)
}
