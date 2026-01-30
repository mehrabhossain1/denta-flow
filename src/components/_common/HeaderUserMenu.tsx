import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { signOut } from '@/lib/auth/client'
import { Link, useRouter } from '@tanstack/react-router'

interface HeaderUserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    // Force reload to clear all cached state
    router.invalidate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage src={user.image ?? ''} alt={user.name ?? ''} />
            <AvatarFallback>
              {user.name
                ? user.name.charAt(0).toUpperCase()
                : user.email?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link to="/account/$accountView" params={{ accountView: 'settings' }}>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
