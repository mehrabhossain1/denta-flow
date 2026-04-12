import Logo from '@/components/_common/Logo'
import LogoIcon from '@/components/_common/LogoIcon'
import { NavUser } from '@/components/NavUser'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar'
import { Link } from '@tanstack/react-router'
import { Bot, FileText, LayoutDashboard, User, Users } from 'lucide-react'
import type * as React from 'react'

const navItems = [
  { title: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { title: 'Patients', href: '/dashboard/patients', icon: Users },
  { title: 'AI Assistant', href: '/dashboard/ai-assistant', icon: Bot },
  { title: 'AI Blog', href: '/dashboard/ai-blog', icon: FileText },
  { title: 'Account', href: '/account/settings', icon: User },
]

function SidebarLogo() {
  const { state } = useSidebar()
  const isCollapsed = state === 'collapsed'
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          asChild
          className={isCollapsed ? 'justify-center' : ''}
        >
          <Link to="/">
            {isCollapsed ? (
              <LogoIcon size="sm" />
            ) : (
              <Logo shouldLink={false} size="sm" />
            )}
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarLogo />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild tooltip={item.title}>
                  <Link to={item.href}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
