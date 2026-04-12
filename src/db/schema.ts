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
