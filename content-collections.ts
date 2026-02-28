import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

const MAX_EXCERPT_LENGTH = 200

function stripMarkdown(text: string): string {
  return text
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[.*?\]\(.*?\)/g, '') // Remove links
    .replace(/[`*_~>]/g, '') // Remove markdown formatting
    .replace(/#+\s/g, '') // Remove headers
    .replace(/-\s/g, '') // Remove list markers
    .replace(/\r?\n|\r/g, ' ') // Convert newlines to spaces
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim()
}

function createExcerpt(content: string, maxLength = MAX_EXCERPT_LENGTH): string {
  const cleanText = stripMarkdown(content)

  if (cleanText.length > maxLength) {
    return cleanText.slice(0, maxLength).trim() + '...'
  }

  return cleanText
}

function resolveDescription(
  description: string | undefined,
  content: string,
): string {
  const trimmed = description?.trim()
  return trimmed ? trimmed : createExcerpt(content)
}

function resolveHeaderImage(
  image: string | undefined,
  content: string,
): string | undefined {
  if (image?.trim()) {
    return image.trim()
  }

  const imageMatch = content.match(/!\[[^\]]*\]\(([^)]+)\)/)
  return imageMatch ? imageMatch[1] : undefined
}

const posts = defineCollection({
  name: 'posts',
  directory: 'content/blog',
  include: '**/*.md',
  schema: z.object({
    title: z.string().min(1),
    description: z.string().optional(),
    published: z.string().date(),
    authors: z.array(z.string()).default([]),
    draft: z.boolean().optional().default(false),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    content: z.string(),
  }),
  transform: (doc) => {
    const description = resolveDescription(doc.description, doc.content)
    const headerImage = resolveHeaderImage(doc.image, doc.content)

    return {
      slug: doc._meta.path,
      title: doc.title,
      description,
      published: doc.published,
      authors: doc.authors,
      draft: doc.draft,
      tags: doc.tags,
      content: doc.content,
      headerImage,
    }
  },
})

export default defineConfig({
  collections: [posts],
})
