import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeHighlight from 'rehype-highlight'
import rehypeSlug from 'rehype-slug'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import remarkRehype from 'remark-rehype'
import { unified } from 'unified'

export type MarkdownHeading = {
  id: string
  level: number
  text: string
}

export type MarkdownRenderResult = {
  markup: string
  headings: MarkdownHeading[]
}

/**
 * Collect headings from markdown content while rendering
 * Stores them in the headings array for table of contents
 */
function collectHeadings(headings: MarkdownHeading[]) {
  return () => {
    return (tree: any) => {
      const walk = (node: any) => {
        if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
          const level = parseInt(node.tagName[1])
          const id = node.properties?.id
          const text = node.children
            ?.map((child: any) =>
              child.type === 'text' ? child.value : collectText(child),
            )
            .join('')

          if (id && text) {
            headings.push({ id, level, text })
          }
        }

        if (node.children && Array.isArray(node.children)) {
          node.children.forEach(walk)
        }
      }

      walk(tree)
    }
  }
}

function collectText(node: any): string {
  if (node.type === 'text') {
    return node.value
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(collectText).join('')
  }
  return ''
}

/**
 * Render markdown to HTML with extracted headings
 *
 * Features:
 * - GitHub Flavored Markdown support
 * - Automatic heading IDs for deep linking
 * - Autolink headings with anchors
 * - Heading collection for table of contents
 */
export function renderMarkdown(content: string): MarkdownRenderResult {
  const headings: MarkdownHeading[] = []

  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeAutolinkHeadings, {
      behavior: 'wrap',
      properties: {
        className: ['anchor-link'],
        ariaLabel: 'Deep link',
      },
    })
    .use(collectHeadings(headings))
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify)

  const file = processor.processSync(content)
  const markup = String(file)

  return {
    markup,
    headings,
  }
}
