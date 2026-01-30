import config from '@/appConfig'

type MetaTag =
  | { title: string }
  | { name: string; content: string }
  | { property: string; content: string }

type SEOConfig = {
  title: string
  description: string
  imageUrl?: string
  handle?: string
  noIndex?: boolean
}

/**
 * Generates standard meta tags for SEO
 */
export function generateMetaTags({
  title,
  description,
  noIndex = false,
}: SEOConfig): MetaTag[] {
  const tags: MetaTag[] = [
    { title },
    { name: 'description', content: description },
  ]

  if (noIndex) {
    tags.push({ name: 'robots', content: 'noindex, nofollow' })
  }

  return tags
}

/**
 * Generates Open Graph meta tags for social media sharing
 */
export function generateOpenGraphTags({
  title,
  description,
  imageUrl,
}: Omit<SEOConfig, 'handle' | 'noIndex'>): MetaTag[] {
  const tags: MetaTag[] = [
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'profile' },
  ]

  if (imageUrl) {
    tags.push({ property: 'og:image', content: imageUrl })
  }

  return tags
}

/**
 * Generates Twitter Card meta tags
 */
export function generateTwitterTags({
  title,
  description,
  imageUrl,
}: Omit<SEOConfig, 'handle' | 'noIndex'>): MetaTag[] {
  const tags: MetaTag[] = [
    { name: 'twitter:card', content: 'summary' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
  ]

  if (imageUrl) {
    tags.push({ name: 'twitter:image', content: imageUrl })
  }

  return tags
}

/**
 * Generates complete SEO meta tags including Open Graph and Twitter
 */
export function generateCompleteSEO(seoConfig: SEOConfig): MetaTag[] {
  return [
    ...generateMetaTags(seoConfig),
    ...generateOpenGraphTags(seoConfig),
    ...generateTwitterTags(seoConfig),
  ]
}

/**
 * Generates profile-specific SEO meta tags
 */
export function generateProfileSEO({
  name,
  handle,
  tagline,
  bioHtml,
  avatarUrl,
}: {
  name: string
  handle: string
  tagline?: string
  bioHtml?: string
  avatarUrl?: string
}): MetaTag[] {
  const title = `${name} (@${handle}) - ${config.appName}`
  const description =
    tagline ||
    bioHtml?.replace(/<[^>]*>/g, '').slice(0, 160) ||
    `View ${name}'s profile on ${config.appName}`

  return generateCompleteSEO({
    title,
    description,
    imageUrl: avatarUrl,
    handle,
  })
}

/**
 * Generates SEO meta tags for profile subpages (about, products, etc.)
 */
export function generateProfileSubpageSEO({
  name,
  handle,
  subpage,
  description,
  avatarUrl,
}: {
  name: string
  handle: string
  subpage: string
  description?: string
  avatarUrl?: string
}): MetaTag[] {
  const title = `${name} (@${handle}) - ${subpage} - ${config.appName}`
  const desc =
    description ||
    `View ${name}'s ${subpage.toLowerCase()} on ${config.appName}`

  return generateCompleteSEO({
    title,
    description: desc,
    imageUrl: avatarUrl,
    handle,
  })
}

/**
 * Generates "not found" SEO meta tags
 */
export function generateNotFoundSEO(
  resourceType: string = 'Profile',
): MetaTag[] {
  return [
    { title: `${resourceType} Not Found - ${config.appName}` },
    {
      name: 'description',
      content: `The requested ${resourceType.toLowerCase()} could not be found`,
    },
    { name: 'robots', content: 'noindex, nofollow' },
  ]
}

/**
 * Generates page-specific SEO meta tags
 */
export function generatePageSEO({
  title,
  description,
  imageUrl,
  noIndex = false,
}: {
  title: string
  description: string
  imageUrl?: string
  noIndex?: boolean
}): MetaTag[] {
  const fullTitle = `${title} - ${config.appName}`

  return generateCompleteSEO({
    title: fullTitle,
    description,
    imageUrl,
    noIndex,
  })
}
