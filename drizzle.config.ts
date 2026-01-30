import type { Config } from 'drizzle-kit'

// Used purely for Drizzle CLI for generation, migration and push
export default {
  out: './drizzle',
  schema: './src/db/schema/',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL as string,
  },
} satisfies Config
