import { type Config } from 'drizzle-kit'

import { env } from './src/env'

export default {
  schema: './src/db/schema.ts',
  driver: 'mysql2',
  dbCredentials: {
    connectionString: env.DATABASE_URL
  },
  tablesFilter: ['feibot_*']
} satisfies Config
