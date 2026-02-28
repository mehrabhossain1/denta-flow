import { AUTH_ROUTES } from '@/constants/auth'
import { Link, useRouterState } from '@tanstack/react-router'
import config from '../../appConfig'
import BuiltWithBadge from './BuiltWithBadge'
import Logo from './Logo'
import { ThemeToggle } from './ThemeToggle'

type FooterLink = {
  label: string
  to: string
  params?: Record<string, string>
}

type FooterLinkGroup = {
  label: string
  children: FooterLink[]
}

const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
  {
    label: 'Company',
    children: [
      {
        label: 'Blog',
        to: '/blog',
      },
      {
        label: 'Docs',
        to: '/docs',
      },
      {
        label: 'Terms',
        to: '/legal/terms',
      },
      {
        label: 'Privacy',
        to: '/legal/privacy',
      },
    ],
  },
  {
    label: 'Links',
    children: [
      {
        label: 'Login',
        to: '/auth/$authView',
        params: { authView: AUTH_ROUTES.SIGN_IN },
      },
    ],
  },
]
const Footer = () => {
  const routerState = useRouterState()
  const isFullWidth = routerState.location.pathname.startsWith('/docs')

  return (
    <footer className="relative border-t border-border/50">
      <BuiltWithBadge />
      <div
        className={`mx-auto ${isFullWidth ? 'w-full' : 'max-w-7xl'} px-2 sm:px-8 py-12`}
      >
        <div className="flex flex-col flex-wrap gap-8 md:flex-row md:flex-nowrap lg:items-start">
          <div className="max-w-64 shrink-0 md:mx-0 md:text-left">
            <Logo shouldLink={false} />

            <p className="mt-3 text-sm text-muted-foreground">
              {config.appDescription}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              © {new Date().getFullYear()} {config.appName}. All rights
              reserved.
            </p>
            <div className="mt-4">
              <ThemeToggle showLabel={true} />
            </div>
          </div>
          <div className="flex grow flex-wrap md:mt-0">
            <div className="flex w-full flex-col justify-center gap-1.5 text-sm md:flex-row md:items-start">
              {FOOTER_LINK_GROUPS.map((group) => (
                <div key={group.label} className="mb-4 w-full md:w-1/3">
                  <div className="mb-2 text-sm font-semibold text-foreground">
                    {group.label}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {group.children.map((link) => (
                      <Link
                        key={link.label}
                        to={link.to}
                        params={link.params}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        aria-label={link.label}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
