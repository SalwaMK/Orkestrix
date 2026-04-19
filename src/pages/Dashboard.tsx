/** Dashboard — main app view with spend stats and tool list */
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Plus, TrendingUp, Wrench, Bot, Bell, Loader2 } from "lucide-react";
import { useTools } from "@/hooks/useTools";
import { ToolCard } from "@/components/tools/ToolCard";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  normalizeToMonthly,
  isRenewingSoon,
} from "@/lib/utils";
import { RenewalTimeline } from "@/components/alerts/RenewalTimeline";
import { SpendHistoryChart } from "@/components/charts/SpendHistoryChart";
import { AiVsSaasChart } from "@/components/charts/AiVsSaasChart";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { ExportButton } from "@/components/export/ExportButton";
import { ExportSummaryCard } from "@/components/export/ExportSummaryCard";
import type { Tool } from "@/types";

// ── Stat card ──────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: boolean;
  warn?: boolean;
}

function StatCard({ icon, label, value, warn }: StatCardProps) {
  return (
    <div className="glass-panel" style={{ padding: "22px 24px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <span
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            background: warn
              ? "rgba(251,191,36,0.12)"
              : "rgba(15,118,110,0.16)",
            border: warn
              ? "1px solid rgba(251,191,36,0.25)"
              : "1px solid rgba(34,211,238,0.16)",
            color: warn ? "#fbbf24" : "#22d3ee",
          }}
        >
          {icon}
        </span>
        <span
          style={{
            fontSize: "0.78rem",
            letterSpacing: "0.07em",
            textTransform: "uppercase",
            color: "rgba(219,243,244,0.55)",
          }}
        >
          {label}
        </span>
      </div>
      <p
        className={warn ? "glow-text-warning" : "glow-text"}
        style={{
          margin: 0,
          fontSize: "2rem",
          fontWeight: 700,
          lineHeight: 1,
          color: warn ? "#fbbf24" : "#f3fbfb",
        }}
      >
        {value}
      </p>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────────────────────

function SectionHeader({ label, count }: { label: string; count: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        marginBottom: 14,
      }}
    >
      <span
        style={{
          padding: "4px 12px",
          borderRadius: 999,
          background: "rgba(15,118,110,0.12)",
          border: "1px solid rgba(15,118,110,0.22)",
          color: "#b6f6ef",
          fontSize: "0.78rem",
          letterSpacing: "0.07em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span style={{ color: "rgba(219,243,244,0.35)", fontSize: "0.78rem" }}>
        {count} {count === 1 ? "tool" : "tools"}
      </span>
      <hr
        style={{
          flex: 1,
          border: "none",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          margin: 0,
        }}
      />
    </div>
  );
}

// ── Dashboard ──────────────────────────────────────────────────────────────

export function Dashboard() {
  const { tools, loading, error, deleteTool } = useTools();

  // ── Computed stats ───────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const active = tools.filter((t) => t.status === "active");

    const monthlySpend = active.reduce(
      (sum, t) => sum + normalizeToMonthly(t.cost, t.billingCycle),
      0,
    );

    const aiSpend = active
      .filter((t) => t.isAiTool)
      .reduce((sum, t) => sum + normalizeToMonthly(t.cost, t.billingCycle), 0);

    const renewingSoon = tools.filter((t) =>
      isRenewingSoon(t.renewalDate),
    ).length;

    return {
      monthlySpend,
      activeCount: active.length,
      aiSpend,
      renewingSoon,
    };
  }, [tools]);

  // ── Split and sort tools ─────────────────────────────────────────────────
  const { aiTools, saasTools } = useMemo(() => {
    const sortByCost = (a: Tool, b: Tool) => b.cost - a.cost;
    return {
      aiTools: tools.filter((t) => t.isAiTool).sort(sortByCost),
      saasTools: tools.filter((t) => !t.isAiTool).sort(sortByCost),
    };
  }, [tools]);

  // ── Loading state ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 12,
          color: "rgba(219,243,244,0.50)",
        }}
      >
        <Loader2 size={20} style={{ animation: "spin 1s linear infinite" }} />
        <span>Loading tools…</span>
      </div>
    );
  }

  // ── Error state ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 12,
          color: "rgba(239,68,68,0.80)",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0, fontWeight: 600 }}>Failed to load tools</p>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "rgba(219,243,244,0.45)",
          }}
        >
          {error}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "0.8rem",
            color: "rgba(219,243,244,0.35)",
          }}
        >
          Make sure the API server is running on port 3001.
        </p>
      </div>
    );
  }

  const isEmpty = tools.length === 0;

  return (
    <>
      <div
        style={{
          width: "min(1180px, calc(100vw - 40px))",
          margin: "0 auto",
          padding: "40px 0 80px",
        }}
      >
        {/* ── Page header ── */}
        <div style={{ marginBottom: 36, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: "clamp(1.6rem, 3vw, 2.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.04em",
                color: "#f3fbfb",
              }}
            >
              Dashboard
            </h1>
            <p
              style={{
                margin: "6px 0 0",
                color: "rgba(219,243,244,0.55)",
                fontSize: "0.95rem",
              }}
            >
              Your SaaS subscriptions and AI spend at a glance.
            </p>
          </div>
          {!isEmpty && (
            <ExportButton tools={tools} />
          )}
        </div>

        {/* ── Stat cards ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 18,
            marginBottom: 48,
          }}
          className="grid-cols-2 md:grid-cols-4"
        >
          <StatCard
            icon={<TrendingUp size={16} />}
            label="Monthly spend"
            value={formatCurrency(stats.monthlySpend)}
          />
          <StatCard
            icon={<Wrench size={16} />}
            label="Active tools"
            value={stats.activeCount}
          />
          <StatCard
            icon={<Bot size={16} />}
            label="AI spend / mo"
            value={formatCurrency(stats.aiSpend)}
          />
          <StatCard
            icon={<Bell size={16} />}
            label="Renewing soon"
            value={stats.renewingSoon}
            warn={stats.renewingSoon > 0}
          />
        </div>

        {/* ── Charts section ── */}
        {!isEmpty && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(15,118,110,0.12)",
                  border: "1px solid rgba(15,118,110,0.22)",
                  color: "#b6f6ef",
                  fontSize: "0.78rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                Spend overview
              </span>
            </div>

            {/* Three-column chart grid */}
            <div
              style={{
                display: "grid",
                gap: 24,
                marginBottom: 24,
              }}
              className="grid-cols-1 lg:grid-cols-3"
            >
              <div className="glass-panel" style={{ padding: "20px" }}>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#f3fbfb",
                  }}
                >
                  Monthly spend trend
                </h3>
                <SpendHistoryChart tools={tools} />
              </div>

              <div className="glass-panel" style={{ padding: "20px" }}>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#f3fbfb",
                  }}
                >
                  AI vs SaaS breakdown
                </h3>
                <AiVsSaasChart tools={tools} />
              </div>

              <div className="glass-panel" style={{ padding: "20px" }}>
                <h3
                  style={{
                    margin: "0 0 16px",
                    fontSize: "0.95rem",
                    fontWeight: 600,
                    color: "#f3fbfb",
                  }}
                >
                  Spend by category
                </h3>
                <CategoryBreakdownChart tools={tools} />
              </div>
            </div>
          </section>
        )}

        {/* ── Empty state ── */}
        {isEmpty && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: 340,
              gap: 18,
              textAlign: "center",
              borderRadius: 24,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.018), rgba(255,255,255,0.008))",
              border: "1px dashed rgba(34,211,238,0.18)",
            }}
          >
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: "rgba(15,118,110,0.14)",
                border: "1px solid rgba(34,211,238,0.18)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#22d3ee",
              }}
            >
              <Wrench size={24} />
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  fontWeight: 700,
                  fontSize: "1.1rem",
                  color: "#f3fbfb",
                }}
              >
                No tools yet
              </p>
              <p
                style={{
                  margin: "6px 0 0",
                  color: "rgba(219,243,244,0.50)",
                  fontSize: "0.9rem",
                }}
              >
                Start tracking your SaaS subscriptions and AI spend.
              </p>
            </div>
            <Button
              asChild
              style={{
                background:
                  "linear-gradient(135deg, rgba(34,211,238,0.92), rgba(15,118,110,0.92))",
                color: "#041012",
                borderRadius: 999,
                fontWeight: 700,
                height: 44,
                padding: "0 24px",
                border: "none",
                boxShadow: "0 8px 24px rgba(34,211,238,0.18)",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Link to="/add">
                <Plus size={16} />
                Add your first tool
              </Link>
            </Button>
          </div>
        )}

        {/* ── All tools section ── */}
        {!isEmpty && (
          <section style={{ marginBottom: 40 }}>
            <div style={{ marginBottom: 24 }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(15,118,110,0.12)",
                  border: "1px solid rgba(15,118,110,0.22)",
                  color: "#b6f6ef",
                  fontSize: "0.78rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                All tools
              </span>
            </div>
          </section>
        )}

        {/* ── AI Tools section ── */}
        {aiTools.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <SectionHeader label="AI Tools" count={aiTools.length} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {aiTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onDelete={deleteTool} />
              ))}
            </div>
          </section>
        )}

        {/* ── SaaS Tools section ── */}
        {saasTools.length > 0 && (
          <section style={{ marginBottom: 40 }}>
            <SectionHeader label="SaaS Tools" count={saasTools.length} />
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 16,
              }}
            >
              {saasTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} onDelete={deleteTool} />
              ))}
            </div>
          </section>
        )}

        {/* ── Renewals section ── */}
        {!isEmpty && (
          <section style={{ marginBottom: 48 }}>
            <div style={{ marginBottom: 24 }}>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(15,118,110,0.12)",
                  border: "1px solid rgba(15,118,110,0.22)",
                  color: "#b6f6ef",
                  fontSize: "0.78rem",
                  letterSpacing: "0.07em",
                  textTransform: "uppercase",
                }}
              >
                Upcoming renewals
              </span>
            </div>
            <RenewalTimeline tools={tools} />
          </section>
        )}

        {/* ── Export summary card ── */}
        <ExportSummaryCard tools={tools} />
      </div>
    </>
  );
}
