# Image Optimization with Netlify CDN

This document explains how image optimization is implemented and how to manage it.

## Overview

Images are automatically optimized using Netlify Image CDN for better performance:
- Automatic resizing to appropriate dimensions
- Quality optimization (80-85% default)
- Smart caching and delivery via CDN
- Only works in production (disabled in development)

## Architecture

The image optimization system is designed to be **easily removable** with minimal changes:

### 1. Central Configuration (`src/appConfig.ts`)

```typescript
features: {
  imageOptimization: {
    enabled: true  // Master switch - set to false to disable everywhere
  }
}
```

The default optimization values (width: 800, quality: 80) are defined in the feature file itself.

### 2. Core Utility (`src/lib/NetlifyImageCDN.ts`)

The `getNetlifyImageUrl()` function handles all optimization logic:
- Checks if feature is enabled
- Skips external URLs, SVGs, and data URIs
- Returns original URL in development or when disabled
- Builds Netlify CDN URL with proper parameters

### 3. Optimization Hook (`src/hooks/useOptimizedImageSrc.ts`)

A simple hook that wraps the CDN logic:
```tsx
const src = useOptimizedImageSrc(rawSrc, { width: 400, quality: 85 })
```

This is the **only place** components import optimization logic from.

### 4. Automatic Avatar Optimization (`src/components/ui/avatar.tsx`)

`AvatarImage` component uses the hook to automatically optimize:
```tsx
const optimizedSrc = useOptimizedImageSrc(src, { width: 400, quality: 85 })
```

### 5. Manual Optimization (`src/components/_common/OptimizedImage.tsx`)

For non-avatar images, this component also uses the hook internally.

## Where Images Are Used

Currently, optimization is applied to:

1. **Profile Avatars** (automatic via `AvatarImage`)
   - `ProfileAvatar` component
   - `ProfileCard` component
   - `ProfileHeader` component
   - `HeaderUserMenu` component
   - `ImageUploader` preview

2. **Other Images** (manual via `OptimizedImage`)
   - Add `OptimizedImage` component for any new images

## How to Disable Optimization

### Option 1: Disable Globally (Recommended)

Edit `src/appConfig.ts`:
```typescript
features: {
  imageOptimization: {
    enabled: false  // Change this line
  }
}
```

All images will immediately use original URLs. No other changes needed.

### Option 2: Remove Feature Completely

If you want to remove the feature entirely:

1. **Revert `AvatarImage`** in `src/components/ui/avatar.tsx`:
   ```tsx
   // Remove import:
   // import { useOptimizedImageSrc } from '@/hooks/useOptimizedImageSrc'
   
   // Replace AvatarImage function:
   function AvatarImage({ className, src, ...props }: ...) {
     return (
       <AvatarPrimitive.Image
         src={src}  // Use src directly, no optimization
         className={cn("aspect-square size-full object-cover", className)}
         {...props}
       />
     )
   }
   ```

2. **Delete files**:
   - `src/hooks/useOptimizedImageSrc.ts` (the hook)
   - `src/lib/NetlifyImageCDN.ts` (core logic)
   - `src/components/_common/OptimizedImage.tsx` (optional component)
   - `docs/IMAGE_OPTIMIZATION.md` (this file)

3. **Delete configuration** from `src/appConfig.ts`:
   ```typescript
   // Remove the entire features.imageOptimization object
   ```

4. **Replace `<OptimizedImage>` with `<img>`** (if you used it anywhere):
   ```tsx
   // Before:
   <OptimizedImage src={url} alt="..." optimization={{ width: 400 }} />
   
   // After:
   <img src={url || ''} alt="..." />
   ```

That's it! The hook pattern means you only touch components that directly use the feature.

## Performance Benefits

- **Reduced bandwidth**: Smaller file sizes
- **Faster load times**: Optimized images load quicker
- **Better UX**: Responsive images sized for actual usage
- **CDN delivery**: Global edge caching

## Testing

- **Development**: Always uses original URLs (optimization skipped)
- **Production**: Build and deploy to Netlify to test optimization
- **Verification**: Check Network tab in DevTools for `/.netlify/images` URLs

## Troubleshooting

### Images not optimizing in production

1. Verify `features.imageOptimization.enabled` is `true`
2. Check that images are internal paths (not external URLs)
3. Ensure images are not SVGs or data URIs
4. Look for `/.netlify/images` in Network tab

### Want different optimization per image type

Use `OptimizedImage` with custom options:
```tsx
// High quality for hero images
<OptimizedImage src={hero} optimization={{ width: 1920, quality: 90 }} />

// Smaller for thumbnails
<OptimizedImage src={thumb} optimization={{ width: 300, quality: 75 }} />
```

## Future Enhancements

- Add `height` parameter support
- Support for different formats (WebP, AVIF)
- Lazy loading integration
- Responsive srcset generation
