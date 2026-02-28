/**
 * Blog types exported separately so they can be imported without pulling in server code
 */

export type BlogPost = {
  slug: string
  title: string
  description: string
  published: string
  authors: string[]
  draft: boolean
  tags: string[]
  content: string
  headerImage?: string
  markup?: string
}

export type BlogPostMeta = Pick<
  BlogPost,
  | 'slug'
  | 'title'
  | 'description'
  | 'published'
  | 'authors'
  | 'tags'
  | 'headerImage'
>
