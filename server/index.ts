/** Express API server — SQLite CRUD routes for Orkestrix (local mode) */
import express from 'express'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq, desc } from 'drizzle-orm'
import { tools } from '../src/db/schema'
import type { NewToolRow } from '../src/db/schema'

const app = express()
app.use(express.json())

// ── DB bootstrap ────────────────────────────────────────────────────────────
const sqlite = new Database('orkestrix.db')

// Auto-create table so `npm run dev` works without running db:migrate first
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS tools (
    id           TEXT    PRIMARY KEY,
    user_id      TEXT    NOT NULL DEFAULT 'local',
    tool_name    TEXT    NOT NULL,
    cost         INTEGER NOT NULL,
    billing_cycle TEXT   NOT NULL,
    renewal_date TEXT    NOT NULL,
    category     TEXT    NOT NULL,
    status       TEXT    NOT NULL DEFAULT 'active',
    is_ai_tool   INTEGER NOT NULL DEFAULT 0,
    notes        TEXT,
    created_at   TEXT    NOT NULL
  )
`)

const db = drizzle(sqlite, { schema: { tools } })

// ── Routes ──────────────────────────────────────────────────────────────────

/** GET /api/tools — list all tools for userId 'local', newest first */
app.get('/api/tools', (_req, res) => {
  try {
    const result = db
      .select()
      .from(tools)
      .where(eq(tools.userId, 'local'))
      .orderBy(desc(tools.createdAt))
      .all()
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

/** POST /api/tools — insert a new tool row */
app.post('/api/tools', (req, res) => {
  try {
    const body = req.body as NewToolRow
    if (!body.id || !body.toolName || body.cost === undefined) {
      res.status(400).json({ error: 'Missing required fields: id, toolName, cost' })
      return
    }
    db.insert(tools).values({
      id:           body.id,
      userId:       body.userId ?? 'local',
      toolName:     body.toolName,
      cost:         body.cost,
      billingCycle: body.billingCycle,
      renewalDate:  body.renewalDate,
      category:     body.category,
      status:       body.status ?? 'active',
      isAiTool:     body.isAiTool ?? false,
      notes:        body.notes ?? null,
      createdAt:    body.createdAt,
    }).run()
    res.status(201).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

/** DELETE /api/tools/:id — remove a tool by id */
app.delete('/api/tools/:id', (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      res.status(400).json({ error: 'Missing tool id' })
      return
    }
    db.delete(tools).where(eq(tools.id, id)).run()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = 3001
app.listen(PORT, () => {
  console.log(`[orkestrix] API server → http://localhost:${PORT}`)
})
