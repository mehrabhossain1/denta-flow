import { OTP_CONFIG } from '@/constants/auth'
import { db } from '@/db'
import * as authSchema from '@/db/schema/auth'
import { env } from '@/env'
import { sendOTPEmail } from '@/lib/email'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { emailOTP } from 'better-auth/plugins'
import { tanstackStartCookies } from 'better-auth/tanstack-start'

if (!env.VITE_GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
  console.warn(
    'Google OAuth credentials not configured. Google sign-in will not work.',
  )
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),
  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days in seconds
    updateAge: 60 * 60 * 24, // Update session every 24 hours (sliding window)
    cookieCache: {
      enabled: true,
      maxAge: 60 * 60 * 24 * 60, // 60 days maximum absolute session length
    },
  },
  socialProviders: {
    google: {
      clientId: env.VITE_GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        console.log({ email, otp, type })
        await sendOTPEmail({ email, otp, type })
      },
      otpLength: OTP_CONFIG.LENGTH,
      expiresIn: OTP_CONFIG.EXPIRES_IN_SECONDS,
    }),
    tanstackStartCookies(), // Must be last plugin in the array
  ],
})
