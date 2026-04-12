/** Pure utility functions for Orkestrix */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  subMonths,
  format,
  isWithinInterval,
  addDays,
  parseISO,
  startOfDay,
  differenceInDays,
} from "date-fns";
import type { BillingCycle, Tool } from "@/types";

/** Merge Tailwind classes safely — used by shadcn/ui components */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Convert integer cents to a formatted dollar string.
 * @example formatCurrency(1600) → "$16.00"
 */
export function formatCurrency(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/**
 * Normalise a cost (in cents) to its monthly equivalent.
 * one_time costs are excluded from recurring totals (returns 0).
 */
export function normalizeToMonthly(cents: number, cycle: BillingCycle): number {
  switch (cycle) {
    case "monthly":
      return cents;
    case "yearly":
      return Math.round(cents / 12);
    case "one_time":
      return 0;
  }
}

/**
 * Format an ISO date string as a human-readable renewal date.
 * @example formatRenewalDate("2027-01-14") → "Jan 14, 2027"
 */
export function formatRenewalDate(isoDate: string): string {
  // Parse as UTC to avoid timezone-induced date shifts
  const [year, month, day] = isoDate.split("-").map(Number);
  const date = new Date(Date.UTC(year!, month! - 1, day!));
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Returns true if the renewal date falls within `days` days from today.
 * Past dates return false.
 */
export function isRenewingSoon(isoDate: string, days = 30): boolean {
  const [year, month, day] = isoDate.split("-").map(Number);
  const renewal = new Date(Date.UTC(year!, month! - 1, day!));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffMs = renewal.getTime() - today.getTime();
  return diffMs >= 0 && diffMs <= days * 24 * 60 * 60 * 1000;
}

/**
 * Returns last N months as monthly spend history with AI/SaaS split.
 * @example getMonthlySpendHistory(tools, 6) → [{ month: 'Jan 25', total: 5400, aiTotal: 2000, saasTotal: 3400 }, ...]
 */
export function getMonthlySpendHistory(
  tools: Tool[],
  monthsBack = 6,
): { month: string; total: number; aiTotal: number; saasTotal: number }[] {
  const now = new Date();
  const activeTool = tools.filter((t) => t.status === "active");

  return Array.from({ length: monthsBack }, (_, i) => {
    const monthDate = subMonths(now, monthsBack - 1 - i);
    const month = format(monthDate, "MMM yy");

    let aiTotal = 0;
    let saasTotal = 0;

    activeTool.forEach((tool) => {
      const monthlyAmount = normalizeToMonthly(tool.cost, tool.billingCycle);
      if (tool.isAiTool) {
        aiTotal += monthlyAmount;
      } else {
        saasTotal += monthlyAmount;
      }
    });

    return {
      month,
      total: aiTotal + saasTotal,
      aiTotal,
      saasTotal,
    };
  });
}

/**
 * Groups tools by category and returns total monthly spend per category.
 * Returns sorted descending by total spend.
 */
export function getSpendByCategory(
  tools: Tool[],
): { category: string; total: number }[] {
  const activeTools = tools.filter((t) => t.status === "active");
  const categoryMap = new Map<string, number>();

  activeTools.forEach((tool) => {
    const monthlyAmount = normalizeToMonthly(tool.cost, tool.billingCycle);
    const current = categoryMap.get(tool.category) || 0;
    categoryMap.set(tool.category, current + monthlyAmount);
  });

  return Array.from(categoryMap.entries())
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Returns tools renewing within the next `days` days, sorted by renewal date ascending.
 */
export function getUpcomingRenewals(tools: Tool[], days = 30): Tool[] {
  const today = startOfDay(new Date());
  const endDate = addDays(today, days);

  return tools
    .filter((tool) => {
      try {
        const renewalDate = startOfDay(parseISO(tool.renewalDate));
        return isWithinInterval(renewalDate, { start: today, end: endDate });
      } catch {
        return false;
      }
    })
    .sort((a, b) => {
      const dateA = parseISO(a.renewalDate);
      const dateB = parseISO(b.renewalDate);
      return dateA.getTime() - dateB.getTime();
    });
}

/**
 * Returns days until renewal (0 if today, negative if past, positive if future).
 */
export function daysUntilRenewal(isoDate: string): number {
  try {
    const today = startOfDay(new Date());
    const renewalDate = startOfDay(parseISO(isoDate));
    return differenceInDays(renewalDate, today);
  } catch {
    return 999;
  }
}
