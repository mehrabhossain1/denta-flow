import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

type PropTypes = {
  name?: string | null
  email?: string | null
  image?: string | null
  className?: string
}

export function UserAvatar({ name, email, image, className }: PropTypes) {
  const fallback = name
    ? name.charAt(0).toUpperCase()
    : (email?.charAt(0).toUpperCase() ?? '?')

  return (
    <Avatar className={cn('h-8 w-8 rounded-lg', className)}>
      <AvatarImage src={image ?? ''} alt={name ?? email ?? ''} />
      <AvatarFallback className="rounded-lg">{fallback}</AvatarFallback>
    </Avatar>
  )
}
