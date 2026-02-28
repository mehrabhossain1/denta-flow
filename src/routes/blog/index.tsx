import appConfig from '@/appConfig'
import { PageLayout } from '@/components/_common/PageLayout'
import { BlogPostsList } from '@/components/blog'
import { fetchBlogPosts } from '@/lib/blog/server'
import { generatePageSEO } from '@/lib/seo'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Rss } from 'lucide-react'

const blogConfig = appConfig.features.blog

export const Route = createFileRoute('/blog/')({
  head: () => ({
    meta: generatePageSEO({
      title: blogConfig.title,
      description: blogConfig.description,
    }),
  }),
  loader: async () => {
    return await fetchBlogPosts()
  },
  component: BlogListPage,
})

function BlogListPage() {
  const posts = Route.useLoaderData()

  return (
    <PageLayout showHeader showFooter>
      <div className="mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-3xl font-bold">{blogConfig.title}</h1>
          <Link
            to="/rss.xml"
            target="_blank"
            rel="noreferrer"
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            title="RSS Feed"
          >
            <Rss className="w-6 h-6" />
          </Link>
        </div>
        {blogConfig.description && (
          <p className="text-muted-foreground mt-2">{blogConfig.description}</p>
        )}
      </div>

      <div className="max-w-7xl mx-auto py-2">
        <BlogPostsList posts={posts} />
      </div>
    </PageLayout>
  )
}
