export const AUTH_ROUTES = {
  SIGN_IN: 'sign-in',
  SIGN_UP: 'sign-up',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
  VERIFY: 'verify',
} as const

export const AUTH_ROUTES_INVALID_WHEN_LOGGED_IN = [
  AUTH_ROUTES.SIGN_IN,
  'signin',
  AUTH_ROUTES.SIGN_UP,
  'signup',
] as const

export const OTP_CONFIG = {
  LENGTH: 6,
  EXPIRES_IN_SECONDS: 300, // 5 minutes
} as const

export type AuthRoute = (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES]
