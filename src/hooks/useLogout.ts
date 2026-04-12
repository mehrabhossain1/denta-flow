import { signOut } from '@/lib/auth/client'
import { useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'

export function useLogout() {
  const router = useRouter()
  const queryClient = useQueryClient()

  return async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          queryClient.clear()
          router.navigate({
            to: '/auth/$authView',
            params: { authView: 'sign-in' },
            search: { redirectTo: '/dashboard' },
          })
        },
      },
    })
  }
}
