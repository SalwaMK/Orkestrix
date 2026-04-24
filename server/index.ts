/** Express API server — SQLite CRUD routes for Orkestrix (local mode) */
import express from 'express'
import Database from 'better-sqlite3'
import { drizzle } from 'drizzle-orm/better-sqlite3'
import { eq, desc } from 'drizzle-orm'
import { tools, aiProviders, aiUsage } from '../src/db/schema'
import type { NewToolRow } from '../src/db/schema'
import { decryptKey } from '../src/lib/encryption'
import { syncProviderUsage } from '../src/lib/aiSync'

const app = express()
app.use(express.json())

// ── DB bootstrap ────────────────────────────────────────────────────────────
const sqlite = new Database('orkestrix.db')

// Auto-create tables so `npm run dev` works without running db:migrate first
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

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS ai_providers (
    id            TEXT PRIMARY KEY,
    user_id       TEXT NOT NULL DEFAULT 'local',
    provider      TEXT NOT NULL,
    encrypted_key TEXT NOT NULL,
    key_hint      TEXT NOT NULL,
    is_active     INTEGER DEFAULT 1,
    last_synced_at TEXT,
    created_at    TEXT NOT NULL
  )
`)

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS ai_usage (
    id            TEXT PRIMARY KEY,
    provider_id   TEXT NOT NULL REFERENCES ai_providers(id),
    user_id       TEXT NOT NULL DEFAULT 'local',
    date          TEXT NOT NULL,
    model         TEXT NOT NULL,
    input_tokens  INTEGER NOT NULL DEFAULT 0,
    output_tokens INTEGER NOT NULL DEFAULT 0,
    cost_cents    INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL
  )
`)

const db = drizzle(sqlite, { schema: { tools, aiProviders, aiUsage } })

// ── Tools routes ─────────────────────────────────────────────────────────────

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

// ── AI Provider routes ───────────────────────────────────────────────────────

/** GET /api/ai-providers — list all providers */
app.get('/api/ai-providers', (_req, res) => {
  try {
    const rows = db
      .select()
      .from(aiProviders)
      .where(eq(aiProviders.userId, 'local'))
      .orderBy(desc(aiProviders.createdAt))
      .all()
    // Never return the encrypted key in listings — return safe fields only
    const safe = rows.map(r => ({
      id:           r.id,
      provider:     r.provider,
      keyHint:      r.keyHint,
      isActive:     r.isActive,
      lastSyncedAt: r.lastSyncedAt,
      createdAt:    r.createdAt,
    }))
    res.json(safe)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

/** POST /api/ai-providers — add a new provider (key must already be encrypted) */
app.post('/api/ai-providers', (req, res) => {
  try {
    const body = req.body as {
      id: string
      provider: string
      encryptedKey: string
      keyHint: string
    }
    if (!body.id || !body.provider || !body.encryptedKey || !body.keyHint) {
      res.status(400).json({ error: 'Missing required fields' })
      return
    }
    db.insert(aiProviders).values({
      id:           body.id,
      userId:       'local',
      provider:     body.provider,
      encryptedKey: body.encryptedKey,
      keyHint:      body.keyHint,
      isActive:     true,
      lastSyncedAt: null,
      createdAt:    new Date().toISOString(),
    }).run()
    res.status(201).json({ success: true })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

/** DELETE /api/ai-providers/:id — remove provider and cascade delete usage */
app.delete('/api/ai-providers/:id', (req, res) => {
  try {
    const { id } = req.params
    if (!id) {
      res.status(400).json({ error: 'Missing provider id' })
      return
    }
    // Delete usage first (foreign-key cascade not enforced in SQLite without pragma)
    sqlite.prepare('DELETE FROM ai_usage WHERE provider_id = ?').run(id)
    db.delete(aiProviders).where(eq(aiProviders.id, id)).run()
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// ── AI Usage routes ──────────────────────────────────────────────────────────

/** GET /api/ai-usage — list all usage rows */
app.get('/api/ai-usage', (_req, res) => {
  try {
    const rows = db
      .select()
      .from(aiUsage)
      .where(eq(aiUsage.userId, 'local'))
      .orderBy(desc(aiUsage.date))
      .all()
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

/** POST /api/ai-providers/:id/sync — trigger a usage sync for a provider */
app.post('/api/ai-providers/:id/sync', async (req, res) => {
  const { id } = req.params
  if (!id) {
    res.status(400).json({ error: 'Missing provider id' })
    return
  }

  // Fetch from db — we need the encrypted key for decryption
  const row = sqlite
    .prepare('SELECT * FROM ai_providers WHERE id = ?')
    .get(id) as {
      id: string
      provider: string
      encrypted_key: string
    } | undefined

  if (!row) {
    res.status(404).json({ error: 'Provider not found' })
    return
  }

  let plaintextKey: string
  try {
    plaintextKey = decryptKey(row.encrypted_key)
    if (!plaintextKey) throw new Error('Decryption returned empty string')
  } catch (err) {
    res.status(500).json({ error: 'Failed to decrypt API key: ' + String(err) })
    return
  }

  // Build a lightweight DB adapter for the sync service
  const dbAdapter = {
    getExistingKeys: (providerId: string): Set<string> => {
      const rows = sqlite
        .prepare('SELECT provider_id, date, model FROM ai_usage WHERE provider_id = ?')
        .all(providerId) as Array<{ provider_id: string; date: string; model: string }>
      return new Set(rows.map(r => `${r.provider_id}:${r.date}:${r.model}`))
    },
    insertUsage: (entry: {
      id: string
      providerId: string
      date: string
      model: string
      inputTokens: number
      outputTokens: number
      costCents: number
      createdAt: string
    }) => {
      sqlite.prepare(`
        INSERT INTO ai_usage
          (id, provider_id, user_id, date, model, input_tokens, output_tokens, cost_cents, created_at)
        VALUES (?, ?, 'local', ?, ?, ?, ?, ?, ?)
      `).run(
        entry.id,
        entry.providerId,
        entry.date,
        entry.model,
        entry.inputTokens,
        entry.outputTokens,
        entry.costCents,
        entry.createdAt,
      )
    },
    updateLastSynced: (providerId: string, ts: string) => {
      sqlite
        .prepare('UPDATE ai_providers SET last_synced_at = ? WHERE id = ?')
        .run(ts, providerId)
    },
  }

  try {
    const result = await syncProviderUsage(id, row.provider, plaintextKey, dbAdapter)
    res.json(result)
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})

// ── Start ────────────────────────────────────────────────────────────────────
const PORT = 3001
app.listen(PORT, () => {
  console.log(`[orkestrix] API server → http://localhost:${PORT}`)
})
