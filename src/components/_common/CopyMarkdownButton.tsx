import { Button } from '@/components/ui/button'
import { Check, Copy } from 'lucide-react'
import { useState } from 'react'

interface CopyMarkdownButtonProps {
  content: string
  className?: string
}

export function CopyMarkdownButton({
  content,
  className,
}: CopyMarkdownButtonProps) {
  const [isCopied, setIsCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={className}
    >
      {isCopied ? (
        <>
          <Check className="h-3.5 w-3.5" />
          <span className="text-xs">Copied</span>
        </>
      ) : (
        <>
          <Copy className="h-3.5 w-3.5" />
          <span className="text-xs">Copy MD</span>
        </>
      )}
    </Button>
  )
}
