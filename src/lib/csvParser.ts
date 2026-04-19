/**
 * csvParser.ts — CSV parsing utilities for the bulk import wizard.
 * Uses PapaParse for reliable CSV tokenisation.
 */
import Papa from 'papaparse'
import { parse, isValid, format } from 'date-fns'
import type { BillingCycle, ToolCategory } from '@/types'

// ── Public types ────────────────────────────────────────────────────────────

export interface RawCSVRow {
  [key: string]: string
}

export interface ColumnMapping {
  toolName:     string | null
  cost:         string | null
  billingCycle: string | null
  renewalDate:  string | null
  category:     string | null
  notes:        string | null
}

export interface ParsedImportRow {
  raw:         RawCSVRow
  parsed: {
    toolName?:    string
    cost?:        number    // in dollars (will be × 100 on save)
    billingCycle?: BillingCycle
    renewalDate?: string    // YYYY-MM-DD
    category?:    ToolCategory
    notes?:       string
  }
  errors:      string[]
  isDuplicate: boolean
  selected:    boolean
}

// ── Fuzzy helpers ────────────────────────────────────────────────────────────

/** Normalise a header string for fuzzy comparison */
function norm(s: string): string {
  return s.toLowerCase().replace(/[\s_\-()$#%]/g, '')
}

const FIELD_ALIASES: Record<keyof ColumnMapping, string[]> = {
  toolName:     ['toolname', 'name', 'tool', 'app', 'service', 'product', 'software'],
  cost:         ['cost', 'price', 'amount', 'fee', 'charge', 'monthly', 'usd', 'payment'],
  billingCycle: ['billingcycle', 'cycle', 'billing', 'frequency', 'period', 'recurrence', 'plan'],
  renewalDate:  ['renewaldate', 'renewal', 'nextbilling', 'duedate', 'due', 'nextpayment', 'expiry', 'expiration', 'date'],
  category:     ['category', 'type', 'group', 'tag', 'section'],
  notes:        ['notes', 'note', 'description', 'comment', 'remarks', 'details'],
}

// ── CSV file parsing ────────────────────────────────────────────────────────

/** Parse a CSV File object → { rows, headers } */
export function parseCSVFile(file: File): Promise<{ rows: RawCSVRow[]; headers: string[] }> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawCSVRow>(file, {
      header:          true,
      skipEmptyLines:  true,
      transformHeader: (h: string) => h.trim(),
      complete: (result) => {
        const headers = result.meta.fields ?? []
        resolve({ rows: result.data, headers })
      },
      error: (err: Error) => reject(err),
    })
  })
}

// ── Auto-detect column mapping ───────────────────────────────────────────────

/** Fuzzy-match CSV headers to Orkestrix fields */
export function autoDetectMapping(headers: string[]): ColumnMapping {
  const mapping: ColumnMapping = {
    toolName: null, cost: null, billingCycle: null,
    renewalDate: null, category: null, notes: null,
  }

  for (const header of headers) {
    const n = norm(header)
    for (const [field, aliases] of Object.entries(FIELD_ALIASES) as [keyof ColumnMapping, string[]][]) {
      if (mapping[field] === null && aliases.some(a => n.includes(a) || a.includes(n))) {
        mapping[field] = header
      }
    }
  }

  return mapping
}

// ── Value parsers ────────────────────────────────────────────────────────────

function parseBillingCycle(raw: string): BillingCycle | null {
  const n = raw.toLowerCase().trim()
  if (/^(month|mo|monthly|m)/.test(n)) return 'monthly'
  if (/^(year|yr|yearly|annual|annually|y)/.test(n)) return 'yearly'
  if (/^(one.?time|once|lifetime|onetime)/.test(n)) return 'one_time'
  return null
}

const CATEGORY_MAP: Record<string, ToolCategory> = {
  productivity: 'productivity', produc: 'productivity', prod: 'productivity',
  design: 'design', ui: 'design', ux: 'design',
  development: 'development', dev: 'development', engineering: 'development', code: 'development',
  marketing: 'marketing', growth: 'marketing', seo: 'marketing',
  ai: 'ai', 'artificial intelligence': 'ai', ml: 'ai',
  communication: 'communication', comms: 'communication', messaging: 'communication',
  finance: 'finance', accounting: 'finance', payment: 'finance',
  other: 'other',
}

function parseCategory(raw: string): ToolCategory {
  const n = raw.toLowerCase().trim()
  for (const [key, val] of Object.entries(CATEGORY_MAP)) {
    if (n.includes(key) || key.includes(n)) return val
  }
  return 'other'
}

/** Attempt to parse various date formats → YYYY-MM-DD string */
function parseDate(raw: string): string | null {
  const formats = [
    'yyyy-MM-dd', 'MM/dd/yyyy', 'dd/MM/yyyy', 'MM-dd-yyyy',
    'dd-MM-yyyy', 'MM/dd/yy', 'dd/MM/yy', 'MMMM d, yyyy',
    'MMM d, yyyy','MMM dd yyyy', 'd MMM yyyy',
  ]
  const trimmed = raw.trim()
  for (const fmt of formats) {
    const d = parse(trimmed, fmt, new Date())
    if (isValid(d)) return format(d, 'yyyy-MM-dd')
  }
  return null
}

// ── Apply mapping ────────────────────────────────────────────────────────────

/** Apply column mapping to raw rows and validate each */
export function applyMapping(
  rows: RawCSVRow[],
  mapping: ColumnMapping,
  existingToolNames: string[],
): ParsedImportRow[] {
  const existingSet = new Set(existingToolNames.map(n => n.toLowerCase()))

  return rows.map((raw) => {
    const errors: string[] = []
    const parsed: ParsedImportRow['parsed'] = {}

    // ── toolName ──
    const rawName = mapping.toolName ? (raw[mapping.toolName] ?? '').trim() : ''
    if (!rawName) {
      errors.push('Tool name is required')
    } else {
      parsed.toolName = rawName
    }

    // ── cost ──
    if (mapping.cost) {
      const rawCost = (raw[mapping.cost] ?? '').replace(/[$,\s]/g, '')
      const n = parseFloat(rawCost)
      if (isNaN(n) || n < 0) {
        errors.push(`Invalid cost: "${raw[mapping.cost] ?? ''}"`)
      } else {
        parsed.cost = n
      }
    } else {
      errors.push('Cost column not mapped')
    }

    // ── billingCycle ──
    if (mapping.billingCycle) {
      const rawCycle = raw[mapping.billingCycle] ?? ''
      const cycle = parseBillingCycle(rawCycle)
      if (!cycle) {
        errors.push(`Unknown billing cycle: "${rawCycle}"`)
      } else {
        parsed.billingCycle = cycle
      }
    } else {
      parsed.billingCycle = 'monthly'   // sensible default
    }

    // ── renewalDate ──
    if (mapping.renewalDate) {
      const rawDate = (raw[mapping.renewalDate] ?? '').trim()
      const d = parseDate(rawDate)
      if (!d) {
        errors.push(`Invalid date: "${rawDate}"`)
      } else {
        parsed.renewalDate = d
      }
    } else {
      errors.push('Renewal date column not mapped')
    }

    // ── category (optional) ──
    if (mapping.category) {
      const rawCat = (raw[mapping.category] ?? '').trim()
      parsed.category = rawCat ? parseCategory(rawCat) : 'other'
    } else {
      parsed.category = 'other'
    }

    // ── notes (optional) ──
    if (mapping.notes) {
      const rawNotes = (raw[mapping.notes] ?? '').trim()
      if (rawNotes) parsed.notes = rawNotes
    }

    const isDuplicate = !!parsed.toolName && existingSet.has(parsed.toolName.toLowerCase())

    return {
      raw,
      parsed,
      errors,
      isDuplicate,
      selected: errors.length === 0,   // pre-select valid rows
    }
  })
}
