import type { Config } from 'drizzle-kit'

/** Drizzle Kit configuration — SQLite local mode */
export default {
  schema:    './src/db/schema.ts',
  out:       './migrations',
  dialect:   'sqlite',
  dbCredentials: { url: 'orkestrix.db' },
} satisfies Config
