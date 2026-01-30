import { drizzle } from 'drizzle-orm/node-postgres'
import pkg from 'pg'
import * as schema from './schema'

const { Pool } = pkg

const dbUrl = process.env.DATABASE_URL as string

const pool = new Pool({
  connectionString: dbUrl,
})

export const db = drizzle({ client: pool, schema })
