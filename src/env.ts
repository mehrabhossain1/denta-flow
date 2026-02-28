import { createEnv } from '@t3-oss/env-core'
import { z } from 'zod'

export const env = createEnv({
  server: {
    APP_BASE_URL: z.url(),
    DATABASE_URL: z.url(),
    BETTER_AUTH_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(1),
    PLUNK_SECRET_API_KEY: z.string().min(1),
    TRANSACTIONAL_EMAIL: z.email(),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SECRET: z.string().min(1),
  },
  clientPrefix: 'VITE_',
  client: {
    VITE_GOOGLE_CLIENT_ID: z.string().min(1),
    VITE_STRIPE_PROMOTION_CODE_ID: z.string().min(1),
    VITE_STRIPE_PRODUCT_CORE_ID: z.string().min(1),
    VITE_STRIPE_PRICE_CORE_ONE_TIME_ID: z.string().min(1),
  },
  runtimeEnv: {
    ...process.env,
    ...import.meta.env,
  },
  emptyStringAsUndefined: true,
})
