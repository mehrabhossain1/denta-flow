import { env } from '@/env'
import { Resend } from 'resend'

const resend = new Resend(env.RESEND_API_KEY)
const FROM_EMAIL = env.TRANSACTIONAL_EMAIL

export async function sendOTPEmail({
  email,
  otp,
  type,
}: {
  email: string
  otp: string
  type: 'sign-in' | 'email-verification' | 'forget-password'
}) {
  const subjects = {
    'sign-in': `Your login code is ${otp}`,
    'email-verification': 'Verify your email',
    'forget-password': 'Reset your password',
  }

  const body = `Your verification code is: ${otp}

This code will expire in 5 minutes.

If you didn't request this code, please ignore this email.`

  if (!env.RESEND_API_KEY) {
    if (import.meta.env.DEV) {
      console.log(`[DEV] OTP for ${email}: ${otp}`)
    }
    return
  }

  try {
    const { error } = await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: subjects[type],
      text: body,
    })

    if (error) {
      console.error('Failed to send OTP email:', error)
    }
  } catch (error) {
    console.error('Failed to send OTP email:', error)
  }
}
