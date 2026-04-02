import { UserAvatar } from '@/components/_common/UserAvatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLogout } from '@/hooks/useLogout'
import { Link } from '@tanstack/react-router'

interface HeaderUserMenuProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  }
}

export default function HeaderUserMenu({ user }: HeaderUserMenuProps) {
  const logout = useLogout()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 overflow-hidden rounded-full"
        >
          <UserAvatar
            name={user.name}
            email={user.email}
            image={user.image}
            className="h-6 w-6"
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link to="/account/$accountView" params={{ accountView: 'settings' }}>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </Link>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
