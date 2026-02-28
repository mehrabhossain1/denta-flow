interface MarkdownContentProps {
  markup: string
  className?: string
}

/**
 * Render parsed markdown HTML with proper styling
 * Uses Tailwind CSS typography utilities for styling
 */
export function MarkdownContent({
  markup,
  className = '',
}: MarkdownContentProps) {
  return (
    <div
      className={`prose prose-sm md:prose-base dark:prose-invert max-w-none ${className}`}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: This is safe
      dangerouslySetInnerHTML={{ __html: markup }}
    />
  )
}
