import * as Sentry from '@sentry/tanstackstart-react'

const dsn =
  process.env.SENTRY_DSN ||
  'https://efa147d1d995a2d60df91424c9db01dc@o4510378804969472.ingest.us.sentry.io/4510378811654144'

Sentry.init({
  dsn,
  environment: process.env.NODE_ENV || 'development',
  release: process.env.COMMIT_SHA || 'unknown',
  sendDefaultPii: true,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
})
