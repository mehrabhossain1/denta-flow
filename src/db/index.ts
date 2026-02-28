import { env } from '@/env'
import { drizzle } from 'drizzle-orm/node-postgres'
import pkg from 'pg'
import * as schema from './schema'

const { Pool } = pkg

const pool = new Pool({
  connectionString: env.DATABASE_URL,
})

export const db = drizzle({ client: pool, schema })
