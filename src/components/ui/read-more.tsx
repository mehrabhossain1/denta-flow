import { useState, type ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ReadMoreProps {
  content: string
  maxCharacters?: number
  className?: string
  textClassName?: string
  buttonClassName?: string
  children?: (content: string) => ReactNode
}

export function ReadMore({
  content,
  maxCharacters = 200,
  className,
  textClassName,
  buttonClassName,
  children,
}: ReadMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (!content) return null

  const shouldShowReadMore = content.length > maxCharacters
  const displayContent =
    isExpanded || !shouldShowReadMore
      ? content
      : `${content.slice(0, maxCharacters)}...`

  return (
    <div className={cn('space-y-1.5', className)}>
      {children ? (
        children(displayContent)
      ) : (
        <p className={cn('leading-normal whitespace-pre-line', textClassName)}>
          {displayContent}
        </p>
      )}

      {shouldShowReadMore && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className={cn(
            'text-muted-foreground hover:text-foreground p-0 h-auto font-normal text-xs',
            buttonClassName,
          )}
        >
          {isExpanded ? 'Show less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}
