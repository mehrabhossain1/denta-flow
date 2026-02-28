import appConfig from '@/appConfig'
import { getPublishedPosts } from '@/lib/blog/func.server'
import { createFileRoute } from '@tanstack/react-router'
import { setResponseHeader } from '@tanstack/react-start/server'

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never'
  priority?: number
}

function generateSitemap() {
  const siteUrl = `https://${appConfig.url}`
  const urls: SitemapUrl[] = []

  // Static pages
  urls.push({
    loc: `${siteUrl}/`,
    changefreq: 'weekly',
    priority: 1.0,
  })

  urls.push({
    loc: `${siteUrl}/blog`,
    changefreq: 'daily',
    priority: 0.8,
  })

  urls.push({
    loc: `${siteUrl}/legal/privacy`,
    changefreq: 'monthly',
    priority: 0.3,
  })

  urls.push({
    loc: `${siteUrl}/legal/terms`,
    changefreq: 'monthly',
    priority: 0.3,
  })

  // Blog posts
  const posts = getPublishedPosts()
  for (const post of posts) {
    urls.push({
      loc: `${siteUrl}/blog/${post.slug}`,
      lastmod: new Date(post.published).toISOString(),
      changefreq: 'monthly',
      priority: 0.7,
    })
  }

  const urlEntries = urls
    .map((url) => {
      let entry = `  <url>\n    <loc>${escapeXml(url.loc)}</loc>`

      if (url.lastmod) {
        entry += `\n    <lastmod>${url.lastmod}</lastmod>`
      }

      if (url.changefreq) {
        entry += `\n    <changefreq>${url.changefreq}</changefreq>`
      }

      if (url.priority !== undefined) {
        entry += `\n    <priority>${url.priority}</priority>`
      }

      entry += '\n  </url>'
      return entry
    })
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlEntries}
</urlset>`
}

export const Route = createFileRoute('/sitemap.xml')({
  server: {
    handlers: {
      GET: async () => {
        const content = generateSitemap()

        setResponseHeader('Content-Type', 'application/xml; charset=utf-8')
        setResponseHeader(
          'Cache-Control',
          'public, max-age=300, must-revalidate',
        )
        setResponseHeader(
          'CDN-Cache-Control',
          'max-age=3600, stale-while-revalidate=3600',
        )

        return new Response(content)
      },
    },
  },
})
