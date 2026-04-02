import { AlreadyLoggedInCard } from '@/components/_common/AlreadyLoggedInCard'
import Logo from '@/components/_common/Logo'
import {
  AUTH_ROUTES,
  AUTH_ROUTES_INVALID_WHEN_LOGGED_IN,
} from '@/constants/auth'
import { useSession } from '@/lib/auth/client'
import { generatePageSEO } from '@/lib/seo'
import { AuthView } from '@daveyplate/better-auth-ui'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'

const authViewMap = {
  [AUTH_ROUTES.SIGN_IN]: {
    title: 'Sign In',
    description: 'Access your account by signing in',
  },
  [AUTH_ROUTES.SIGN_UP]: {
    title: 'Sign Up',
    description: 'Create a new account to get started',
  },
  [AUTH_ROUTES.FORGOT_PASSWORD]: {
    title: 'Forgot Password',
    description: 'Reset your password',
  },
  [AUTH_ROUTES.RESET_PASSWORD]: {
    title: 'Reset Password',
    description: 'Enter your new password',
  },
}

export const Route = createFileRoute('/auth/$authView')({
  head: (ctx) => {
    const config = authViewMap[ctx.match.params.authView] || {
      title: 'Auth',
      description: '',
    }
    return {
      meta: generatePageSEO({
        title: config.title,
        description: config.description,
      }),
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  const navigate = useNavigate()
  const { authView } = Route.useParams()
  const isLoggedIn = useSession().data?.user
  const normalizedAuthView = authView.toLowerCase()
  const paramsInValidForLoggedInUser = new Set<string>(
    AUTH_ROUTES_INVALID_WHEN_LOGGED_IN,
  )
  const showIsLoggedInMessage =
    paramsInValidForLoggedInUser.has(normalizedAuthView) && isLoggedIn

  useEffect(() => {
    if (showIsLoggedInMessage) {
      navigate({ to: '/dashboard' })
    }
  }, [showIsLoggedInMessage, navigate])

  return (
    <main className="flex grow flex-col items-center justify-center gap-3 self-center p-4 md:p-6">
      <Logo size="xl" />
      {showIsLoggedInMessage ? (
        <AlreadyLoggedInCard />
      ) : (
        <AuthView pathname={normalizedAuthView} />
      )}
    </main>
  )
}
