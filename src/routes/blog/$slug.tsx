import { PageLayout } from '@/components/_common/PageLayout'
import { MarkdownContent, TableOfContents } from '@/components/blog'
import { renderMarkdown } from '@/lib/blog/markdown'
import { fetchBlogPost } from '@/lib/blog/server'
import type { BlogPost } from '@/lib/blog/types'
import { formatAuthors } from '@/lib/blog/utils'
import { generatePageSEO } from '@/lib/seo'
import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { format } from 'date-fns'
import { ArrowLeft } from 'lucide-react'

const loader = async ({
  params,
}: {
  params: { slug: string }
}): Promise<{ post: BlogPost & { isUnpublished: boolean } }> => {
  const post = await fetchBlogPost({ data: { slug: params.slug } })

  if (!post) {
    throw notFound()
  }

  return { post }
}

export const Route = createFileRoute('/blog/$slug')({
  head: (props) => {
    const post = props.loaderData?.post

    const seoMeta = generatePageSEO({
      title: post?.title || 'Blog Post',
      description: post?.description || '',
      ...(post?.headerImage ? { imageUrl: post.headerImage } : {}),
    })

    return {
      meta: [
        ...seoMeta,
        // Mark unpublished posts (drafts or future-dated) as noindex
        ...(post?.isUnpublished
          ? [{ name: 'robots', content: 'noindex' }]
          : []),
      ],
    }
  },
  loader,
  errorComponent: () => (
    <PageLayout showHeader showFooter>
      <div className="max-w-2xl mx-auto py-12 text-center">
        <h1 className="text-2xl font-bold mb-2">Post Not Found</h1>
        <p className="text-muted-foreground mb-6">
          The blog post you're looking for doesn't exist.
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blog
        </Link>
      </div>
    </PageLayout>
  ),
  component: BlogPostPage,
})

function BlogPostPage() {
  const { post } = Route.useLoaderData()
  const { markup, headings } = renderMarkdown(post.content)

  return (
    <PageLayout showHeader showFooter>
      <article className="py-12">
        {/* Breadcrumb */}
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <Link
            to="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>
        </div>

        {/* Title and meta */}
        <header className="mx-4 mb-8 pb-8 border-b">
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
            <span>By {formatAuthors(post.authors)}</span>
            <span>•</span>
            <time dateTime={post.published}>
              {format(new Date(post.published), 'MMMM d, yyyy')}
            </time>
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-muted text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {/* Header image */}
        {post.headerImage && (
          <div className="mb-8 max-w-4xl mx-auto px-4">
            <div
              className="w-full overflow-hidden rounded-lg"
              style={{ aspectRatio: '1.91/1' }}
            >
              <img
                src={post.headerImage}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        )}

        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main content */}
          <div className="lg:col-span-3">
            {/* Markdown content */}
            <MarkdownContent markup={markup} className="mb-12" />
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <div className="sticky top-20">
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>
      </article>
    </PageLayout>
  )
}
