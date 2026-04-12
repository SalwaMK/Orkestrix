/** RenewalTimeline — visual timeline of upcoming renewals with urgency indicators */
import { getUpcomingRenewals, daysUntilRenewal, formatCurrency, formatRenewalDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/types";

interface RenewalTimelineProps {
  tools: Tool[];
}

function getUrgencyColor(days: number): string {
  if (days <= 3) return "#E24B4A"; // red
  if (days <= 7) return "#BA7517"; // amber
  if (days <= 30) return "#EF9F27"; // yellow
  return "#888780"; // gray
}

function categoryLabel(cat: string): string {
  return cat.charAt(0).toUpperCase() + cat.slice(1);
}

export function RenewalTimeline({ tools }: RenewalTimelineProps) {
  const upcomingRenewals = getUpcomingRenewals(tools, 90);

  if (upcomingRenewals.length === 0) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "40px 20px",
          color: "rgba(219, 243, 244, 0.45)",
          fontSize: "0.9rem",
        }}
      >
        No renewals in the next 90 days
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {upcomingRenewals.map((tool) => {
        const days = daysUntilRenewal(tool.renewalDate);
        const urgencyColor = getUrgencyColor(days);
        const daysText =
          days === 0 ? "today" : days === 1 ? "tomorrow" : `in ${days} days`;

        return (
          <div
            key={tool.id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "14px 16px",
              borderRadius: 12,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.008))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            {/* Urgency dot */}
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                backgroundColor: urgencyColor,
                flexShrink: 0,
              }}
            />

            {/* Tool info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: "#f3fbfb",
                    fontSize: "0.95rem",
                  }}
                >
                  {tool.toolName}
                </span>
                <Badge variant="cyan" style={{ fontSize: "0.7rem" }}>
                  {categoryLabel(tool.category)}
                </Badge>
              </div>
              <div
                style={{
                  fontSize: "0.8rem",
                  color: "rgba(219, 243, 244, 0.45)",
                  marginTop: 4,
                }}
              >
                {formatRenewalDate(tool.renewalDate)}
              </div>
            </div>

            {/* Days + cost (responsive) */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-end",
                gap: 4,
                flexShrink: 0,
              }}
              className="renewal-timeline-right"
            >
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "rgba(219, 243, 244, 0.65)",
                }}
              >
                {daysText}
              </span>
              <span
                style={{
                  fontWeight: 600,
                  color: "#22d3ee",
                  fontSize: "0.9rem",
                }}
              >
                {formatCurrency(tool.cost)}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
