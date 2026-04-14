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

function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return 'Better Starter Team'
  if (authors.length === 1) return authors[0]
  if (authors.length === 2) return authors.join(' and ')
  return `${authors.slice(0, -1).join(', ')}, and ${authors[authors.length - 1]}`
}

async function generateRSSFeed() {
  const allPosts = await getPublishedPosts()
  const posts = allPosts.slice(0, 50) // Most recent 50 posts
  const siteUrl = `https://${appConfig.url}`
  const buildDate = new Date().toUTCString()

  const rssItems = posts
    .map((post) => {
      const postUrl = `${siteUrl}/blog/${post.slug}`
      const pubDate = new Date(post.published).toUTCString()
      const author = formatAuthors(post.authors)
      const description = post.description

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(postUrl)}</link>
      <guid isPermaLink="true">${escapeXml(postUrl)}</guid>
      <pubDate>${pubDate}</pubDate>
      <author>${escapeXml(author)}</author>
      <description>${escapeXml(description)}</description>
      ${post.headerImage ? `<enclosure url="${escapeXml(post.headerImage)}" type="image/png" />` : ''}
    </item>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(appConfig.features.blog.title)}</title>
    <link>${siteUrl}/blog</link>
    <description>${escapeXml(appConfig.features.blog.description)}</description>
    <language>en-us</language>
    <lastBuildDate>${buildDate}</lastBuildDate>
    <atom:link href="${siteUrl}/api/rss.xml" rel="self" type="application/rss+xml" />
    ${rssItems}
  </channel>
</rss>`
}

export const Route = createFileRoute('/api/rss/xml')({
  server: {
    handlers: {
      GET: async () => {
        const content = await generateRSSFeed()

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
