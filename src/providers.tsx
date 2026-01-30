import { authClient } from '@/lib/auth/client'
import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
import { AuthQueryProvider } from '@daveyplate/better-auth-tanstack'
import { AuthUIProviderTanstack } from '@daveyplate/better-auth-ui/tanstack'
import { Link, useRouter } from '@tanstack/react-router'
import type { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()

  return (
    <ReactQueryProvider>
      <AuthQueryProvider>
        <AuthUIProviderTanstack
          credentials={false}
          social={{ providers: ['google'] }}
          authClient={authClient}
          emailOTP
          navigate={(href) => router.navigate({ href })}
          replace={(href) => router.navigate({ href, replace: true })}
          Link={({ href, ...props }) => <Link to={href} {...props} />}
        >
          {children}
        </AuthUIProviderTanstack>
      </AuthQueryProvider>
    </ReactQueryProvider>
  )
}
