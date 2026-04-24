/**
 * aiSync — fetches AI provider usage from OpenAI and Anthropic APIs,
 * calculates costs, and upserts into the local SQLite database.
 *
 * NOTE: This file is imported by the Express server (server/index.ts),
 * so it must use CommonJS-compatible imports when bundled by tsx.
 */
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { calculateCostCents } from '../data/tokenPricing'

export interface UsageEntry {
  date: string        // YYYY-MM-DD
  model: string
  inputTokens: number
  outputTokens: number
}

// ── OpenAI ──────────────────────────────────────────────────────────────────

export async function fetchOpenAIUsage(
  apiKey: string,
  startDate: string,
  endDate: string,
): Promise<UsageEntry[]> {
  const client = new OpenAI({ apiKey })

  const results: UsageEntry[] = []

  // OpenAI usage API v1 — iterate day by day
  const start = new Date(startDate)
  const end   = new Date(endDate)

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().slice(0, 10)
    const [year, month, day] = dateStr.split('-').map(Number)

    try {
      const response = await fetch(
        `https://api.openai.com/v1/usage?date=${dateStr}`,
        { headers: { Authorization: `Bearer ${apiKey}` } },
      )

      if (response.status === 401) throw new Error('Invalid API key')
      if (response.status === 429) throw new Error('Rate limited')
      if (!response.ok) continue  // skip days with API errors

      const data = await response.json() as {
        data?: Array<{
          model: string
          n_context_tokens_total?: number
          n_generated_tokens_total?: number
        }>
      }

      if (!data.data) continue

      // Aggregate per model for this day
      const modelMap = new Map<string, { input: number; output: number }>()
      for (const entry of data.data) {
        const model = entry.model ?? 'unknown'
        const cur = modelMap.get(model) ?? { input: 0, output: 0 }
        cur.input  += entry.n_context_tokens_total   ?? 0
        cur.output += entry.n_generated_tokens_total ?? 0
        modelMap.set(model, cur)
      }

      for (const [model, tokens] of modelMap.entries()) {
        if (tokens.input > 0 || tokens.output > 0) {
          results.push({
            date:         dateStr,
            model,
            inputTokens:  tokens.input,
            outputTokens: tokens.output,
          })
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg === 'Invalid API key' || msg === 'Rate limited') throw err
      // Network errors: skip this day
    }
  }

  return results
}

// ── Anthropic ───────────────────────────────────────────────────────────────

export async function fetchAnthropicUsage(
  apiKey: string,
  startDate: string,
  endDate: string,
): Promise<UsageEntry[]> {
  // Anthropic usage endpoint (beta)
  const client = new Anthropic({ apiKey })
  void client // client kept for future SDK calls

  const results: UsageEntry[] = []

  try {
    const response = await fetch(
      `https://api.anthropic.com/v1/usage?start_date=${startDate}&end_date=${endDate}`,
      {
        headers: {
          'x-api-key':         apiKey,
          'anthropic-version': '2023-06-01',
          'anthropic-beta':    'usage-1',
        },
      },
    )

    if (response.status === 401) throw new Error('Invalid API key')
    if (response.status === 429) throw new Error('Rate limited')
    if (!response.ok) return results

    const data = await response.json() as {
      data?: Array<{
        timestamp?: string
        model?:     string
        input_tokens?:  number
        output_tokens?: number
      }>
    }

    if (!data.data) return results

    for (const entry of data.data) {
      const date  = (entry.timestamp ?? '').slice(0, 10)
      const model = entry.model ?? 'unknown'
      if (!date) continue
      results.push({
        date,
        model,
        inputTokens:  entry.input_tokens  ?? 0,
        outputTokens: entry.output_tokens ?? 0,
      })
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    if (msg === 'Invalid API key' || msg === 'Rate limited') throw err
  }

  return results
}

// ── Main sync ────────────────────────────────────────────────────────────────

export interface SyncResult {
  synced: number
  errors: string[]
}

/**
 * Sync 30 days of usage for a provider.
 * Caller is responsible for decrypting the key before calling this.
 */
export async function syncProviderUsage(
  providerId: string,
  providerType: string,
  plaintextKey: string,
  db: {
    getExistingKeys: (providerId: string) => Set<string>
    insertUsage: (row: {
      id: string
      providerId: string
      date: string
      model: string
      inputTokens: number
      outputTokens: number
      costCents: number
      createdAt: string
    }) => void
    updateLastSynced: (providerId: string, ts: string) => void
  },
): Promise<SyncResult> {
  const errors: string[] = []
  let synced = 0

  const endDate   = new Date().toISOString().slice(0, 10)
  const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10)

  let entries: UsageEntry[] = []

  try {
    if (providerType === 'openai') {
      entries = await fetchOpenAIUsage(plaintextKey, startDate, endDate)
    } else if (providerType === 'anthropic') {
      entries = await fetchAnthropicUsage(plaintextKey, startDate, endDate)
    } else {
      errors.push(`Unknown provider type: ${providerType}`)
      return { synced: 0, errors }
    }
  } catch (err) {
    errors.push(err instanceof Error ? err.message : String(err))
    return { synced: 0, errors }
  }

  // Get existing (providerId+date+model) combos to skip duplicates
  const existing = db.getExistingKeys(providerId)

  for (const entry of entries) {
    const dedupeKey = `${providerId}:${entry.date}:${entry.model}`
    if (existing.has(dedupeKey)) continue

    const costCents = calculateCostCents(entry.model, entry.inputTokens, entry.outputTokens)

    db.insertUsage({
      id:           crypto.randomUUID(),
      providerId,
      date:         entry.date,
      model:        entry.model,
      inputTokens:  entry.inputTokens,
      outputTokens: entry.outputTokens,
      costCents,
      createdAt:    new Date().toISOString(),
    })
    synced++
  }

  db.updateLastSynced(providerId, new Date().toISOString())

  return { synced, errors }
}
