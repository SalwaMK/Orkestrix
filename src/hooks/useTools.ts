/** useTools — React hook for fetching and mutating tools via the local API */
import { useState, useEffect, useCallback } from 'react'
import type { Tool, ToolFormInput } from '@/types'

interface UseToolsReturn {
  tools: Tool[]
  loading: boolean
  error: string | null
  fetchTools: () => Promise<void>
  addTool: (data: ToolFormInput) => Promise<void>
  deleteTool: (id: string) => Promise<void>
}

export function useTools(): UseToolsReturn {
  const [tools, setTools] = useState<Tool[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTools = useCallback(async (): Promise<void> => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/tools')
      if (!res.ok) throw new Error(`Failed to fetch tools: ${res.statusText}`)
      const data = (await res.json()) as Tool[]
      setTools(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error fetching tools')
    } finally {
      setLoading(false)
    }
  }, [])

  const addTool = useCallback(async (data: ToolFormInput): Promise<void> => {
    const payload: Tool = {
      id:           crypto.randomUUID(),
      userId:       'local',
      toolName:     data.toolName,
      /** Multiply dollars × 100 to store as integer cents */
      cost:         Math.round(data.cost * 100),
      billingCycle: data.billingCycle,
      renewalDate:  data.renewalDate,
      category:     data.category,
      status:       data.status,
      isAiTool:     data.isAiTool,
      notes:        data.notes ?? undefined,
      createdAt:    new Date().toISOString(),
    }

    const res = await fetch('/api/tools', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(payload),
    })

    if (!res.ok) {
      const body = (await res.json()) as { error?: string }
      throw new Error(body.error ?? `Failed to add tool: ${res.statusText}`)
    }

    await fetchTools()
  }, [fetchTools])

  const deleteTool = useCallback(async (id: string): Promise<void> => {
    const res = await fetch(`/api/tools/${id}`, { method: 'DELETE' })
    if (!res.ok) {
      const body = (await res.json()) as { error?: string }
      throw new Error(body.error ?? `Failed to delete tool: ${res.statusText}`)
    }
    await fetchTools()
  }, [fetchTools])

  useEffect(() => {
    void fetchTools()
  }, [fetchTools])

  return { tools, loading, error, fetchTools, addTool, deleteTool }
}
