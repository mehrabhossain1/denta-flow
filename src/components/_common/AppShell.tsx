import { FooterSlim } from '@/components/_common/Footer'
import { AppSidebar } from '@/components/AppSidebar'
import { SiteHeader } from '@/components/SiteHeader'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import type React from 'react'

type PropTypes = {
  title?: string
  children: React.ReactNode
}

export function AppShell({ title, children }: PropTypes) {
  return (
    <SidebarProvider
      style={
        {
          '--sidebar-width': 'calc(var(--spacing) * 72)',
          '--header-height': 'calc(var(--spacing) * 12)',
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader title={title} />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            {children}
          </div>
          <FooterSlim />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
