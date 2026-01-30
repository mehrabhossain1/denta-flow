const PLUNK_SECRET_API_KEY = process.env.PLUNK_SECRET_API_KEY || ''
const PLUNK_BASE_URL = 'https://next-api.useplunk.com'
const PLUNK_API_URL = `${PLUNK_BASE_URL}/v1/send`
const TRANSACTIONAL_EMAIL =
  process.env.TRANSACTIONAL_EMAIL || 'noreply@my-awesome-site.com'

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

  if (!PLUNK_SECRET_API_KEY) {
    if (import.meta.env.DEV) {
      console.log(`[DEV] OTP for ${email}: ${otp}`)
    }
    return
  }

  try {
    const response = await fetch(PLUNK_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${PLUNK_SECRET_API_KEY}`,
      },
      body: JSON.stringify({
        from: TRANSACTIONAL_EMAIL,
        to: email,
        subject: subjects[type],
        body,
      }),
    })

    if (!response.ok) {
      console.error('Failed to send OTP email:', await response.text())
    }
  } catch (error) {
    console.error('Failed to send OTP email:', error)
  }
}
