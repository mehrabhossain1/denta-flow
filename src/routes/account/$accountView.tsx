import { PageHeader } from '@/components/_common/PageHeader'
import { AUTH_ROUTES } from '@/constants/auth'
import { useSession } from '@/lib/auth/client'
import { generatePageSEO } from '@/lib/seo'
import { AccountView } from '@daveyplate/better-auth-ui'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useEffect } from 'react'

export const Route = createFileRoute('/account/$accountView')({
  head: ({ params }) => {
    // Capitalize first letter and replace dashes with spaces for title
    const viewName = params.accountView
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    return {
      meta: generatePageSEO({
        title: `${viewName} - Account`,
        description: `Manage your ${viewName.toLowerCase()} settings and preferences`,
      }),
    }
  },
  component: Settings,
})

// TODO: Make this into a hook
// TODO: Search a better way so it can be done on Serverside as well.
function Settings() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const { accountView } = Route.useParams()

  useEffect(() => {
    if (!session && !isPending) {
      router.navigate({
        to: '/auth/$authView',
        params: { authView: AUTH_ROUTES.SIGN_IN },
        search: { redirect: location.href },
      })
    }
  }, [session, router, isPending])

  if (!session && !isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Redirecting to login...</p>
      </div>
    )
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <>
      <PageHeader
        title="Account Settings"
        description="Manage your account preferences and personal information"
      />
      <AccountView pathname={accountView} />
    </>
  )
}
