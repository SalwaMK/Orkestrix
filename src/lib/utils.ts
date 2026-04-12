/** Pure utility functions for Orkestrix */
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import type { BillingCycle } from '@/types'

/** Merge Tailwind classes safely — used by shadcn/ui components */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

/**
 * Convert integer cents to a formatted dollar string.
 * @example formatCurrency(1600) → "$16.00"
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`
}

/**
 * Normalise a cost (in cents) to its monthly equivalent.
 * one_time costs are excluded from recurring totals (returns 0).
 */
export function normalizeToMonthly(cents: number, cycle: BillingCycle): number {
  switch (cycle) {
    case 'monthly':  return cents
    case 'yearly':   return Math.round(cents / 12)
    case 'one_time': return 0
  }
}

/**
 * Format an ISO date string as a human-readable renewal date.
 * @example formatRenewalDate("2027-01-14") → "Jan 14, 2027"
 */
export function formatRenewalDate(isoDate: string): string {
  // Parse as UTC to avoid timezone-induced date shifts
  const [year, month, day] = isoDate.split('-').map(Number)
  const date = new Date(Date.UTC(year!, month! - 1, day!))
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day:   'numeric',
    year:  'numeric',
    timeZone: 'UTC',
  })
}

/**
 * Returns true if the renewal date falls within `days` days from today.
 * Past dates return false.
 */
export function isRenewingSoon(isoDate: string, days = 30): boolean {
  const [year, month, day] = isoDate.split('-').map(Number)
  const renewal = new Date(Date.UTC(year!, month! - 1, day!))
  const today   = new Date()
  today.setHours(0, 0, 0, 0)
  const diffMs  = renewal.getTime() - today.getTime()
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000
}
