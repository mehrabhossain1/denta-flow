import { Badge } from '@/components/ui/badge'
import type { BlogPostMeta } from '@/lib/blog/types'
import { formatAuthors } from '@/lib/blog/utils'
import { Link } from '@tanstack/react-router'
import { format } from 'date-fns'

/**
 * Blog post preview item for listing pages
 * Shows title, description, metadata, and tags in a flat list format
 */
export function BlogPostCard({ post }: { post: BlogPostMeta }) {
  return (
    <Link to="/blog/$slug" params={{ slug: post.slug }}>
      <div className="flex flex-row-reverse gap-4 py-6 border-b hover:bg-muted/30 transition-colors">
        {/* Image */}
        {post.headerImage && (
          <div
            className="w-full overflow-hidden rounded-lg"
            style={{ aspectRatio: '1.91/1' }}
          >
            <img
              src={post.headerImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
              loading="lazy"
            />
          </div>
        )}

        {/* Content */}
        <div className="flex flex-col gap-3">
          {/* Title */}
          <div>
            <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
              {post.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-2">
            {post.description}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span>{format(new Date(post.published), 'MMM d, yyyy')}</span>
            <span>•</span>
            <span>{formatAuthors(post.authors)}</span>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <>
                <span>•</span>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

interface BlogPostsListProps {
  posts: BlogPostMeta[]
  isLoading?: boolean
  emptyMessage?: string
}

/**
 * List layout for displaying multiple blog posts
 */
export function BlogPostsList({
  posts,
  isLoading = false,
  emptyMessage = 'No blog posts found.',
}: BlogPostsListProps) {
  if (isLoading) {
    return (
      <div className="divide-y">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="py-6 px-4 h-32 bg-muted animate-pulse" />
        ))}
      </div>
    )
  }

  if (posts.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="divide-y border-t">
      {posts.map((post) => (
        <BlogPostCard key={post.slug} post={post} />
      ))}
    </div>
  )
}
