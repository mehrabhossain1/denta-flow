import { createAuthClient } from 'better-auth/react'
import { emailOTPClient } from 'better-auth/client/plugins'

export const authClient = createAuthClient({
  plugins: [emailOTPClient()],
})

const { useSession, signOut, getSession } = authClient

export { useSession, signOut, getSession }
