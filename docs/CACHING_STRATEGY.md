# Caching Strategy - ISR (Incremental Static Regeneration)

## Overview

OpenUser implements ISR (Incremental Static Regeneration) caching following TanStack Start best practices and Netlify CDN capabilities. This ensures:
- **Fast page loads** via CDN edge caching
- **Fresh content** with stale-while-revalidate
- **Minimal server load** with intelligent revalidation

## Architecture

### Cache Layers

1. **Browser Cache**: Always revalidates with CDN (max-age=0, must-revalidate)
2. **Netlify CDN**: Edge caching with stale-while-revalidate for instant responses
3. **Origin Server**: Generates fresh content on revalidation
4. **Static Assets**: Long-term immutable caching (1 year)

### Caching Strategy by Content Type

The ISR approach uses **short max-age + long stale-while-revalidate**:
- `max-age`: How long CDN caches as fresh before revalidation
- `stale-while-revalidate`: How long to serve stale content while fetching fresh version in background

```typescript
// Example: Individual profiles
INDIVIDUAL_PAGE: { maxAge: 60 * 60, swr: 24 * 60 * 60 }
// Cache for 1 hour, then serve stale for 24 hours while revalidating in background
```

## Cache Durations

Defined in `CACHE_DURATIONS` constant in `src/lib/cache.ts`:

| Type | maxAge | SWR | Use Case |
|------|--------|-----|----------|
| `INDIVIDUAL_PAGE` | 1 hour | 24 hours | Profile & product pages (user-editable) |
| `LIST_PAGE` | 5 minutes | 1 hour | Home page, profile/product lists |
| `SEARCH` | 1 minute | 10 minutes | Search results, handle availability |
| `NO_CACHE` | 0 | 0 | Auth endpoints, user-specific data |

## Caching Utilities

Located in `src/lib/cache.ts`:

### `getNetlifyCacheHeaders(cacheConfig)`
Returns cache headers object for route-level caching:
```typescript
headers: getNetlifyCacheHeaders(CACHE_DURATIONS.LIST_PAGE)
```

### `setNetlifyCacheHeaders(cacheConfig)` (in cache.server.ts)
Sets response headers for server functions:
```typescript
export const getAllProfiles = createServerFn({ method: 'GET' }).handler(
  async () => {
    setNetlifyCacheHeaders(CACHE_DURATIONS.LIST_PAGE)
    return await db.select()...
  },
)
```

## Response Headers Set

For non-zero cache durations:

```
Cache-Control: public, max-age=0, must-revalidate
Netlify-CDN-Cache-Control: public, max-age={maxAge}, durable, stale-while-revalidate={swr}
```

**Explanation:**
- `Cache-Control: max-age=0` - Browser always checks CDN for fresh content
- `Netlify-CDN-Cache-Control: max-age=X` - CDN caches for X seconds
- `durable` - Netlify keeps cache across deployments (better user experience)
- `stale-while-revalidate` - Serve instant cached response while updating in background

For NO_CACHE (max-age=0):
```
Cache-Control: no-cache, no-store, must-revalidate
Netlify-CDN-Cache-Control: no-cache
```

## Implementation by Function Type

### Routes (src/routes/)

All routes set headers via `head()` function:
```typescript
export const Route = createFileRoute('/')({
  head: () => ({
    meta: generateCompleteSEO(...),
    headers: getNetlifyCacheHeaders(CACHE_DURATIONS.LIST_PAGE),
  }),
  ...
})
```

**Routes and their cache durations:**
- `/` (home) - LIST_PAGE (5min cache, 1hr SWR)
- `/@{$handle}` (profile) - INDIVIDUAL_PAGE (1hr cache, 24hr SWR)
- `/@{$handle}/products` - INDIVIDUAL_PAGE
- `/p/$handle` (product detail) - INDIVIDUAL_PAGE

### Server Functions

Profile queries (`src/lib/server/profile.ts`):
- `getAllProfiles()` - LIST_PAGE
- `getCommunityProfiles()` - LIST_PAGE
- `getPersonalProfiles()` - LIST_PAGE
- `getPopularProfiles()` - LIST_PAGE
- `getProfileByHandle()` - INDIVIDUAL_PAGE (individual profile pages)
- `getProfileByUserId()` - INDIVIDUAL_PAGE
- `searchProfiles()` - SEARCH (search results)
- `checkHandleAvailability()` - SEARCH
- `getMyProfile()` - NO_CACHE (user-specific)
- `getMyCreatedProfiles()` - NO_CACHE (user-specific)

Product queries (`src/lib/server/products.ts`):
- `getAllProducts()` - LIST_PAGE
- `getProductById()` - INDIVIDUAL_PAGE
- `getProductByHandle()` - INDIVIDUAL_PAGE
- `getProfileProducts()` - INDIVIDUAL_PAGE
- `searchProducts()` - SEARCH

Auth queries (`src/lib/auth-server-fn.ts`):
- `getCurrentUser()` - NO_CACHE
- `getAvatar()` - NO_CACHE

All mutations (create/update/delete) - NO_CACHE + cache purging

## Static Asset Caching

Configured in `netlify.toml`:

**Immutable assets (1 year)** - For hashed/fingerprinted files:
```toml
[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/fonts/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

Images, fonts, and other static files are cached for 1 year since they include content hashes in filenames.

## Cache Invalidation

### On-Demand Purging

When content changes (mutations), specific paths are purged via `purgeNetlifyCDN()`:

```typescript
await purgeNetlifyCDN([
  '/',
  `/@${handle}`,
  `/@${handle}/about`,
  `/@${handle}/products`,
])
```

**Triggered by:**
- Profile creation/update/deletion
- Product addition/removal
- Category changes

**Requires Environment Variables:**
- `NETLIFY_API_TOKEN` - API authentication
- `NETLIFY_SITE_ID` - Site identifier

### Automatic Revalidation

Without explicit purging, content automatically revalidates after `max-age` expires:
- INDIVIDUAL_PAGE: Revalidates every 1 hour
- LIST_PAGE: Revalidates every 5 minutes
- SEARCH: Revalidates every 1 minute
- Stale content served instantly while fresh version fetches in background

## Benefits

### Performance
- **Instant responses** via edge-cached stale content
- **Background revalidation** prevents blocking
- **Reduced server load** from aggregated requests
- **Global edge availability** via Netlify CDN

### Freshness
- **On-demand purging** for immediate updates
- **Short max-age** for frequent checks
- **Stale-while-revalidate** balances speed and freshness

### Scalability
- Handles thousands of profile pages efficiently
- Search results cached to reduce database queries
- Durable cache persists across deployments

## Monitoring

### Cache-Status Header

Netlify includes a `Cache-Status` response header for debugging:
```bash
curl -I https://example.netlify.app/@username
```

Response headers show:
- `hit` - Served from cache
- `miss` - Fetched from origin
- `stale` - Served stale while revalidating

## Best Practices

1. ✅ **Appropriate durations**: Use INDIVIDUAL_PAGE for user-editable content
2. ✅ **Purge on mutations**: Always call `purgeNetlifyCDN()` after writes
3. ✅ **NO_CACHE for auth**: Never cache user-specific or sensitive data
4. ✅ **Search has short TTL**: Balance freshness with performance
5. ✅ **Immutable static assets**: Use fingerprinted filenames for browser caching

## Future Enhancements

- **Cache tags**: Use `Netlify-Cache-Tag` for bulk invalidation by tag
- **Conditional requests**: Add ETag for 304 Not Modified responses
- **Regional variations**: Cache different versions for different geographies
- **Edge functions**: Customization at edge with Netlify Functions

