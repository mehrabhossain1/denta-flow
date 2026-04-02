import { signOut } from '@/lib/auth/client'
import { useRouter } from '@tanstack/react-router'

export function useLogout() {
  const router = useRouter()

  return async () => {
    await signOut()
    router.invalidate()
  }
}
