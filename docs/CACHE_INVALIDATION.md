# Cache Invalidation Integration

## Overview
Added automatic CDN cache purging to all profile and product mutation handlers. When content is updated, the relevant pages are automatically invalidated so users see fresh content.

## Cache Purging Strategy

### Profile Operations

#### Create Profile (`createProfile`)
**Purges:**
- `/` - Home page (new profile added to list)

**Reason:** New profile appears in the profile directory

#### Update Profile (`updateProfile`)
**Purges:**
- `/` - Home page
- `/@{oldHandle}` - Old profile page
- `/@{oldHandle}/about` - Old about page
- `/@{oldHandle}/products` - Old products page
- `/@{newHandle}` - New profile page (if handle changed)
- `/@{newHandle}/about` - New about page (if handle changed)
- `/@{newHandle}/products` - New products page (if handle changed)

**Reason:** Profile data changed, and handle may have changed (requires purging both old and new paths)

#### Delete Profile (`deleteProfile`)
**Purges:**
- `/` - Home page
- `/@{handle}` - Profile page
- `/@{handle}/about` - About page
- `/@{handle}/products` - Products page

**Reason:** Profile no longer exists

### Product Operations

#### Create Product (`createProduct`)
**Purges:**
- `/p/{handle}` - New product page

**Reason:** New product page created

#### Update Product (`updateProduct`)
**Purges:**
- `/p/{handle}` - Product page

**Reason:** Product details changed

#### Add Product to Profile (`addProductToProfile`)
**Purges:**
- `/@{profileHandle}/products` - Profile products page

**Reason:** New product added to profile's product list

#### Update Profile Product (`updateProfileProduct`)
**Purges:**
- `/@{profileHandle}/products` - Profile products page

**Reason:** Product order, description, or category changed

#### Remove Product from Profile (`removeProductFromProfile`)
**Purges:**
- `/@{profileHandle}/products` - Profile products page

**Reason:** Product removed from profile's product list

### Category Operations

#### Upsert Category (`upsertCategory`)
**Purges:**
- `/@{profileHandle}/products` - Profile products page

**Reason:** Category created or updated (affects product organization)

#### Delete Category (`deleteCategory`)
**Purges:**
- `/@{profileHandle}/products` - Profile products page

**Reason:** Category deleted (all products in that category affected)

## Implementation Details

### Server Functions Modified

1. **`src/lib/server/profile.ts`**
   - ✅ Added `purgeNetlifyCDN` import
   - ✅ `createProfile` - Purges home page
   - ✅ `updateProfile` - Purges profile pages and home
   - ✅ `deleteProfile` - Purges profile pages and home

2. **`src/lib/server/products.ts`**
   - ✅ Added `purgeNetlifyCDN` import
   - ✅ `createProduct` - Purges product page
   - ✅ `updateProduct` - Purges product page
   - ✅ `addProductToProfile` - Purges profile products page
   - ✅ `updateProfileProduct` - Purges profile products page
   - ✅ `removeProductFromProfile` - Purges profile products page
   - ✅ `upsertCategory` - Purges profile products page
   - ✅ `deleteCategory` - Purges profile products page

### Cache Purge Function

Located in `src/lib/cache.ts`:

```typescript
export async function purgeNetlifyCDN(paths: string[]): Promise<void>
```

**Features:**
- Calls Netlify API to purge CDN cache for specific paths
- Requires `NETLIFY_API_TOKEN` and `NETLIFY_SITE_ID` environment variables
- Non-blocking: Logs errors but doesn't throw (cache purge is non-critical)
- Supports multiple paths in single call for efficiency

## Environment Setup

### Required Environment Variables

Add to `.env` and Netlify dashboard:

```bash
NETLIFY_API_TOKEN=your_netlify_api_token_here
NETLIFY_SITE_ID=your_site_id_here
```

### Getting Netlify API Token

1. Go to https://app.netlify.com/user/applications
2. Click "New access token"
3. Give it a descriptive name: "CDN Cache Purge"
4. Copy the token and add to environment variables

### Getting Netlify Site ID

1. Go to your Project in Netlify dashboard
2. Navigate to Project configuration
3. Copy "Project ID / Site ID" from General → Project Information
4. Add to environment variables

## Testing Cache Invalidation

### Manual Test

1. Create/update a profile
2. Check Netlify function logs for: `Successfully purged CDN for paths: ...`
3. Verify the pages reload with new content
4. Check response headers: `x-nf-cache-status` should be `MISS` after purge

### Automated Test (Future)

```typescript
// Example test
it('should purge cache after profile update', async () => {
  const result = await updateProfile({ 
    handle: 'testuser', 
    name: 'Updated Name' 
  })
  
  expect(purgeCalls).toContain('/@testuser')
  expect(purgeCalls).toContain('/')
})
```

## Cache Behavior

### Before Purge
- User A updates their profile
- User B visits profile page → Sees old cached version (up to 1 hour stale)

### After Purge
- User A updates their profile → Cache purged automatically
- User B visits profile page → CDN cache miss → Fresh data fetched → Cached again

### Stale-While-Revalidate
Even with cache purging, we use stale-while-revalidate:
- First visitor after purge: Cache miss, fetches fresh data
- Subsequent visitors: Serve cached version
- After cache expires: Serve stale content while revalidating in background

## Performance Impact

- **Cache purge API call**: ~100-200ms (non-blocking, runs after response)
- **First load after purge**: Slower (cache miss)
- **Subsequent loads**: Fast (cached again)

**Trade-off:** Slightly slower for first visitor after update vs. much faster for all other visitors

## Monitoring

### Success Indicators
- Netlify function logs show: `Successfully purged CDN for paths: ...`
- `x-nf-cache-status: MISS` on next request to purged paths
- `x-nf-cache-status: HIT` on subsequent requests

### Error Indicators
- Console warnings: `Netlify API token or site ID not configured`
- Console errors: `Error purging Netlify CDN`
- Users see stale content for longer than cache duration

## Future Improvements

1. **Batch Purging**: Collect multiple purges and execute in batches
2. **Purge Queue**: Use background job queue for reliable purging
3. **Selective Purging**: Purge only specific cache keys instead of paths
4. **Cache Tags**: Use Netlify cache tags for more granular control
5. **Purge Metrics**: Track purge frequency and success rates

## Debugging

### If cache isn't purging:

1. **Check environment variables:**
   ```bash
   echo $NETLIFY_API_TOKEN
   echo $NETLIFY_SITE_ID
   ```

2. **Check function logs:**
   - Look for purge warnings/errors
   - Verify purge API calls are being made

3. **Test purge API manually:**
   ```bash
   curl -X POST \
     https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys/latest/purge \
     -H "Authorization: Bearer ${TOKEN}" \
     -H "Content-Type: application/json" \
     -d '{"paths": ["/"]}'
   ```

4. **Check response headers:**
   ```bash
   curl -I https://yourdomain.com/@handle
   # Look for x-nf-cache-status
   ```

## Summary

✅ **All mutation handlers now purge CDN cache**
✅ **Non-blocking, error-safe implementation**
✅ **Comprehensive path coverage for all scenarios**
✅ **Ready for production with proper env vars**

The cache invalidation system ensures users always see up-to-date content while maintaining the performance benefits of ISR caching.
