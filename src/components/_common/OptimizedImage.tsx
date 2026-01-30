import { useOptimizedImageSrc } from '@/hooks/useOptimizedImageSrc'
import type { ImageOptimizationOptions } from '@/lib/NetlifyImageCDN'

interface OptimizedImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null
  alt: string // Make alt required for accessibility
  optimization?: ImageOptimizationOptions
}

/**
 * Image component that automatically optimizes images using Netlify Image CDN.
 * Falls back to original src when optimization is disabled or in development.
 *
 * Usage:
 *   <OptimizedImage src={avatarUrl} alt="Avatar" optimization={{ width: 200, quality: 85 }} />
 *
 * To remove this feature:
 *   1. Delete this file, useOptimizedImageSrc.ts, and NetlifyImageCDN.ts
 *   2. Replace <OptimizedImage> with <img> in components
 */
export function OptimizedImage({
  src,
  alt,
  optimization,
  ...imgProps
}: OptimizedImageProps) {
  const optimizedSrc = useOptimizedImageSrc(src, optimization)

  if (!optimizedSrc) {
    return null
  }

  return <img src={optimizedSrc} alt={alt} {...imgProps} />
}
