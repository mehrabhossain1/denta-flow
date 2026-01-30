import { createMiddleware } from '@tanstack/react-start'
import { auth } from '@/lib/auth'

export const authMiddleware = createMiddleware().server(
  async ({ next, request }) => {
    const session = await auth.api.getSession({ headers: request.headers })

    const user = session?.user
      ? {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
        }
      : null

    return await next({
      context: {
        user,
      },
    })
  },
)
