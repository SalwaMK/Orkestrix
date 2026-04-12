/** Shared TypeScript types for Orkestrix */

export type BillingCycle = 'monthly' | 'yearly' | 'one_time'

export type ToolStatus = 'active' | 'paused' | 'cancelled'

export type ToolCategory =
  | 'productivity'
  | 'design'
  | 'development'
  | 'marketing'
  | 'ai'
  | 'communication'
  | 'finance'
  | 'other'

export interface Tool {
  id: string
  userId: string
  toolName: string
  /** Stored as integer cents — e.g. $16.00 = 1600. Divide by 100 to display. */
  cost: number
  billingCycle: BillingCycle
  /** ISO date string YYYY-MM-DD */
  renewalDate: string
  category: ToolCategory
  status: ToolStatus
  isAiTool: boolean
  notes?: string
  /** ISO timestamp */
  createdAt: string
}

/** Form input type — cost is in dollars (e.g. 16.00), converted to cents before saving */
export type ToolFormInput = {
  toolName: string
  /** Dollar amount — e.g. 16.00. Multiplied × 100 before INSERT. */
  cost: number
  billingCycle: BillingCycle
  renewalDate: string
  category: ToolCategory
  status: ToolStatus
  isAiTool: boolean
  notes?: string
}

/** API response shape for tool list */
export interface ToolsApiResponse {
  tools: Tool[]
}

/** API response for mutations */
export interface MutationResponse {
  success: boolean
  error?: string
}
