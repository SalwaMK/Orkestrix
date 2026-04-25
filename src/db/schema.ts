/** Drizzle ORM schema — SQLite table definitions for Orkestrix */
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const tools = sqliteTable('tools', {
  id:           text('id').primaryKey(),
  userId:       text('user_id').notNull().default('local'),
  toolName:     text('tool_name').notNull(),
  /** Stored as integer cents — e.g. $16.00 = 1600 */
  cost:         integer('cost').notNull(),
  billingCycle: text('billing_cycle').notNull(),
  renewalDate:  text('renewal_date').notNull(),
  category:     text('category').notNull(),
  status:       text('status').notNull().default('active'),
  /** 0 = false, 1 = true */
  isAiTool:     integer('is_ai_tool', { mode: 'boolean' }).notNull().default(false),
  notes:        text('notes'),
  createdAt:    text('created_at').notNull(),
})

export type ToolRow = typeof tools.$inferSelect
export type NewToolRow = typeof tools.$inferInsert

export const aiProviders = sqliteTable('ai_providers', {
  id:           text('id').primaryKey(),
  userId:       text('user_id').notNull().default('local'),
  provider:     text('provider').notNull(), // 'openai' | 'anthropic'
  encryptedKey: text('encrypted_key').notNull(),
  keyHint:      text('key_hint').notNull(),
  isActive:     integer('is_active', { mode: 'boolean' }).default(true),
  lastSyncedAt: text('last_synced_at'),
  createdAt:    text('created_at').notNull(),
})

export const aiUsage = sqliteTable('ai_usage', {
  id:           text('id').primaryKey(),
  providerId:   text('provider_id').notNull().references(() => aiProviders.id),
  userId:       text('user_id').notNull().default('local'),
  date:         text('date').notNull(),
  model:        text('model').notNull(),
  inputTokens:  integer('input_tokens').notNull().default(0),
  outputTokens: integer('output_tokens').notNull().default(0),
  costCents:    integer('cost_cents').notNull().default(0),
  createdAt:    text('created_at').notNull(),
})

export type AiProviderRow = typeof aiProviders.$inferSelect
export type NewAiProviderRow = typeof aiProviders.$inferInsert
export type AiUsageRow = typeof aiUsage.$inferSelect
export type NewAiUsageRow = typeof aiUsage.$inferInsert

export const gmailConnections = sqliteTable('gmail_connections', {
  id:              text('id').primaryKey(),
  userId:          text('user_id').notNull().default('local'),
  email:           text('email').notNull(),
  accessToken:     text('access_token').notNull(),   // encrypted
  refreshToken:    text('refresh_token').notNull(),  // encrypted
  lastScannedAt:   text('last_scanned_at'),
  totalFound:      integer('total_found').default(0),
  createdAt:       text('created_at').notNull(),
})

export const discoveredSubs = sqliteTable('discovered_subs', {
  id:              text('id').primaryKey(),
  userId:          text('user_id').notNull().default('local'),
  toolName:        text('tool_name').notNull(),
  cost:            integer('cost').notNull(),         // cents
  billingCycle:    text('billing_cycle').notNull(),
  category:        text('category').notNull(),
  isAiTool:        integer('is_ai_tool', { mode: 'boolean' }).default(false),
  sourceEmail:     text('source_email').notNull(),   // email subject
  confidence:      integer('confidence').notNull(),  // 0-100
  status:          text('status').notNull().default('pending'),
                   // 'pending' | 'confirmed' | 'dismissed'
  createdAt:       text('created_at').notNull(),
})

export type GmailConnectionRow = typeof gmailConnections.$inferSelect
export type NewGmailConnectionRow = typeof gmailConnections.$inferInsert
export type DiscoveredSubRow = typeof discoveredSubs.$inferSelect
export type NewDiscoveredSubRow = typeof discoveredSubs.$inferInsert
