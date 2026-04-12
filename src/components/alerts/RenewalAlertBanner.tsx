/** RenewalAlertBanner — dismissible alert for tools renewing within 7 days */
import { useState, useEffect } from "react";
import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  getUpcomingRenewals,
  daysUntilRenewal,
  formatCurrency,
} from "@/lib/utils";
import { requestNotificationPermission } from "@/lib/notifications";
import type { Tool } from "@/types";

interface RenewalAlertBannerProps {
  tools: Tool[];
}

const DISMISS_KEY = "orkestrix-alert-dismissed";

export function RenewalAlertBanner({ tools }: RenewalAlertBannerProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if already dismissed this session
    const dismissed = sessionStorage.getItem(DISMISS_KEY);
    if (dismissed === "true") {
      setIsDismissed(true);
    }

    // Request notification permission on mount
    requestNotificationPermission().catch(() => {
      // Silently fail if permission denied
    });
  }, []);

  const criticalRenewals = getUpcomingRenewals(tools, 7);

  if (criticalRenewals.length === 0 || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "true");
    setIsDismissed(true);
  };

  return (
    <div
      style={{
        background: "#FAEEDA",
        borderBottom: "1px solid #FDE68A",
        padding: "14px 0",
      }}
    >
      <div
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        {/* Left side - warning content */}
        <div style={{ display: "flex", gap: 12, flex: 1, minWidth: 0 }}>
          <AlertCircle
            size={20}
            style={{ color: "#BA7517", flexShrink: 0, marginTop: 2 }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontWeight: 600,
                color: "#78350F",
                marginBottom: 6,
              }}
            >
              {criticalRenewals.length} tool
              {criticalRenewals.length === 1 ? "" : "s"} renewing within 7 days:
            </div>
            <div style={{ color: "#92400E", fontSize: "0.9rem" }}>
              {criticalRenewals.map((tool) => {
                const days = daysUntilRenewal(tool.renewalDate);
                const daysText =
                  days === 0
                    ? "today"
                    : days === 1
                      ? "tomorrow"
                      : `in ${days} days`;
                return (
                  <div key={tool.id} style={{ marginBottom: 4 }}>
                    • {tool.toolName} — renews {daysText} (
                    {formatCurrency(tool.cost)})
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right side - dismiss button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          style={{
            color: "#78350F",
            flexShrink: 0,
          }}
        >
          <X size={16} />
          Dismiss
        </Button>
      </div>
    </div>
  );
}
