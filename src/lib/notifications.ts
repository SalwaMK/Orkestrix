/** Browser notification service for renewal alerts */
import { getUpcomingRenewals, daysUntilRenewal, formatCurrency } from "./utils";
import type { Tool } from "@/types";

// Store timeout IDs so we can clear them if needed
let scheduledTimeouts: number[] = [];

/**
 * Request browser notification permission.
 * Returns true if granted, false otherwise.
 * Does not request if already denied.
 */
export async function requestNotificationPermission(): Promise<boolean> {
  if (!("Notification" in window)) {
    return false;
  }

  // Don't request if already denied
  if (Notification.permission === "denied") {
    return false;
  }

  // Already granted
  if (Notification.permission === "granted") {
    return true;
  }

  // Request permission
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch (error) {
    console.error("Failed to request notification permission:", error);
    return false;
  }
}

/**
 * Schedule renewal reminder notifications for tools renewing within `days` days.
 * Cap at 5 notifications to avoid spam.
 */
export function scheduleRenewalNotifications(
  tools: Tool[],
  days = 7,
): void {
  if (!("Notification" in window) || Notification.permission !== "granted") {
    return;
  }

  // Clear any existing scheduled notifications
  clearScheduledNotifications();

  const upcomingRenewals = getUpcomingRenewals(tools, days);
  const maxNotifications = Math.min(upcomingRenewals.length, 5);

  for (let i = 0; i < maxNotifications; i++) {
    const tool = upcomingRenewals[i];
    if (!tool) continue;

    const daysLeft = daysUntilRenewal(tool.renewalDate);
    const cost = formatCurrency(tool.cost);

    if (daysLeft === 0) {
      // Renewing today - fire immediately
      new Notification(`Renewing today — ${tool.toolName}`, {
        body: `Your ${tool.toolName} subscription renews today. Cost: ${cost}`,
        icon: "/assets/orkestrix_logo.svg",
        tag: `renewal-${tool.id}`,
      });
    } else if (daysLeft === 1) {
      // Renewing tomorrow - schedule for 9am tomorrow
      const tomorrow9am = new Date();
      tomorrow9am.setDate(tomorrow9am.getDate() + 1);
      tomorrow9am.setHours(9, 0, 0, 0);
      const msUntil9am = tomorrow9am.getTime() - Date.now();

      if (msUntil9am > 0) {
        const timeoutId = window.setTimeout(() => {
          new Notification(`Renewing tomorrow — ${tool.toolName}`, {
            body: `Your ${tool.toolName} renews tomorrow. Cost: ${cost}`,
            icon: "/assets/orkestrix_logo.svg",
            tag: `renewal-${tool.id}`,
          });
        }, msUntil9am);

        scheduledTimeouts.push(timeoutId);
      }
    } else if (daysLeft <= 7) {
      // Renewing within 7 days - fire immediately
      new Notification(`Upcoming renewal — ${tool.toolName}`, {
        body: `Renews in ${daysLeft} days. Cost: ${cost}`,
        icon: "/assets/orkestrix_logo.svg",
        tag: `renewal-${tool.id}`,
      });
    }
  }
}

/**
 * Clear all pending notification timeouts.
 */
export function clearScheduledNotifications(): void {
  scheduledTimeouts.forEach((id) => window.clearTimeout(id));
  scheduledTimeouts = [];
}
