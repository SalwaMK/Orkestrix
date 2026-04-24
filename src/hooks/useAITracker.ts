/** useAITracker — React hook for AI provider management and usage analytics */
import { useState, useEffect, useCallback, useMemo } from 'react'
import { encryptKey, getKeyHint } from '@/lib/encryption'

export interface AiProvider {
  id: string
  provider: 'openai' | 'anthropic'
  keyHint: string
  isActive: boolean | null
  lastSyncedAt: string | null
  createdAt: string
}

export interface AiUsage {
  id: string
  providerId: string
  userId: string
  date: string
  model: string
  inputTokens: number
  outputTokens: number
  costCents: number
  createdAt: string
}

export interface UsageByDay {
  date: string
  openai: number
  anthropic: number
  total: number
}

export interface UsageByModel {
  model: string
  provider: string
  inputTokens: number
  outputTokens: number
  costCents: number
}

interface UseAITrackerReturn {
  providers: AiProvider[]
  usage: AiUsage[]
  totalThisMonth: number
  totalLastMonth: number
  usageByDay: UsageByDay[]
  usageByModel: UsageByModel[]
  loading: boolean
  syncing: boolean
  error: string | null
  addProvider: (provider: 'openai' | 'anthropic', apiKey: string) => Promise<void>
  removeProvider: (id: string) => Promise<void>
  syncAll: () => Promise<void>
}

function getMonthRange(monthsAgo: number): { start: string; end: string } {
  const now  = new Date()
  const year  = now.getFullYear()
  const month = now.getMonth() - monthsAgo
  const d     = new Date(year, month, 1)
  const start = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
  const lastDay = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate()
  const end   = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`
  return { start, end }
}

export function useAITracker(): UseAITrackerReturn {
  const [providers, setProviders] = useState<AiProvider[]>([])
  const [usage, setUsage]         = useState<AiUsage[]>([])
  const [loading,  setLoading]    = useState(true)
  const [syncing,  setSyncing]    = useState(false)
  const [error,    setError]      = useState<string | null>(null)

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchProviders = useCallback(async () => {
    const res = await fetch('/api/ai-providers')
    if (!res.ok) throw new Error('Failed to fetch providers')
    setProviders((await res.json()) as AiProvider[])
  }, [])

  const fetchUsage = useCallback(async () => {
    const res = await fetch('/api/ai-usage')
    if (!res.ok) throw new Error('Failed to fetch usage')
    setUsage((await res.json()) as AiUsage[])
  }, [])

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      await Promise.all([fetchProviders(), fetchUsage()])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }, [fetchProviders, fetchUsage])

  // ── Sync ──────────────────────────────────────────────────────────────────
  const syncAll = useCallback(async () => {
    setSyncing(true)
    setError(null)
    try {
      // Fetch current providers list fresh for sync
      const res = await fetch('/api/ai-providers')
      if (!res.ok) throw new Error('Failed to fetch providers for sync')
      const freshProviders = (await res.json()) as AiProvider[]

      await Promise.all(
        freshProviders
          .filter(p => p.isActive)
          .map(p =>
            fetch(`/api/ai-providers/${p.id}/sync`, { method: 'POST' }).catch(() => null),
          ),
      )
      await fetchUsage()
      await fetchProviders()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sync failed')
    } finally {
      setSyncing(false)
    }
  }, [fetchUsage, fetchProviders])

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const addProvider = useCallback(
    async (provider: 'openai' | 'anthropic', apiKey: string) => {
      const encryptedKey = encryptKey(apiKey)
      const keyHint      = getKeyHint(apiKey)
      const id           = crypto.randomUUID()

      const res = await fetch('/api/ai-providers', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ id, provider, encryptedKey, keyHint }),
      })
      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        throw new Error(body.error ?? 'Failed to add provider')
      }

      await fetchProviders()
      // Trigger sync in background — don't await so UI responds immediately
      fetch(`/api/ai-providers/${id}/sync`, { method: 'POST' })
        .then(() => fetchUsage())
        .catch(() => null)
    },
    [fetchProviders, fetchUsage],
  )

  const removeProvider = useCallback(
    async (id: string) => {
      const res = await fetch(`/api/ai-providers/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const body = (await res.json()) as { error?: string }
        throw new Error(body.error ?? 'Failed to remove provider')
      }
      await fetchAll()
    },
    [fetchAll],
  )

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    void fetchAll()
  }, [fetchAll])

  // ── Derived stats ─────────────────────────────────────────────────────────
  const thisMonth = getMonthRange(0)
  const lastMonth = getMonthRange(1)

  const totalThisMonth = useMemo(
    () =>
      usage
        .filter(u => u.date >= thisMonth.start && u.date <= thisMonth.end)
        .reduce((s, u) => s + u.costCents, 0),
    [usage, thisMonth.start, thisMonth.end],
  )

  const totalLastMonth = useMemo(
    () =>
      usage
        .filter(u => u.date >= lastMonth.start && u.date <= lastMonth.end)
        .reduce((s, u) => s + u.costCents, 0),
    [usage, lastMonth.start, lastMonth.end],
  )

  // Build daily chart data for last 30 days
  const usageByDay = useMemo((): UsageByDay[] => {
    const days: UsageByDay[] = []
    const providerMap = new Map(providers.map(p => [p.id, p.provider]))

    for (let i = 29; i >= 0; i--) {
      const d = new Date(Date.now() - i * 24 * 60 * 60 * 1000)
      const dateStr = d.toISOString().slice(0, 10)
      const dayUsage = usage.filter(u => u.date === dateStr)

      let openai = 0, anthropic = 0
      for (const u of dayUsage) {
        const provider = providerMap.get(u.providerId)
        if (provider === 'openai')    openai    += u.costCents
        if (provider === 'anthropic') anthropic += u.costCents
      }
      days.push({ date: dateStr, openai, anthropic, total: openai + anthropic })
    }
    return days
  }, [usage, providers])

  // Build per-model breakdown for this month
  const usageByModel = useMemo((): UsageByModel[] => {
    const providerMap = new Map(providers.map(p => [p.id, p.provider]))
    const modelMap = new Map<string, UsageByModel>()

    usage
      .filter(u => u.date >= thisMonth.start && u.date <= thisMonth.end)
      .forEach(u => {
        const key = `${u.model}:${u.providerId}`
        const cur = modelMap.get(key) ?? {
          model:        u.model,
          provider:     providerMap.get(u.providerId) ?? 'unknown',
          inputTokens:  0,
          outputTokens: 0,
          costCents:    0,
        }
        cur.inputTokens  += u.inputTokens
        cur.outputTokens += u.outputTokens
        cur.costCents    += u.costCents
        modelMap.set(key, cur)
      })

    return Array.from(modelMap.values()).sort((a, b) => b.costCents - a.costCents)
  }, [usage, providers, thisMonth.start, thisMonth.end])

  return {
    providers,
    usage,
    totalThisMonth,
    totalLastMonth,
    usageByDay,
    usageByModel,
    loading,
    syncing,
    error,
    addProvider,
    removeProvider,
    syncAll,
  }
}
