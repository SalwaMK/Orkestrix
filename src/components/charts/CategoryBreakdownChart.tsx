/** CategoryBreakdownChart — horizontal bar chart showing spend per category */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { getSpendByCategory } from "@/lib/utils";
import type { Tool } from "@/types";

interface CategoryBreakdownChartProps {
  tools: Tool[];
}

const CATEGORY_COLORS: Record<string, string> = {
  ai: "#c084fc",
  development: "#22d3ee",
  design: "#f472b6",
  productivity: "#38bdf8",
  marketing: "#fb7185",
  communication: "#34d399",
  finance: "#fbbf24",
  other: "#94a3b8",
};

export function CategoryBreakdownChart({ tools }: CategoryBreakdownChartProps) {
  const data = getSpendByCategory(tools);

  if (data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 120,
          color: "rgba(219, 243, 244, 0.45)",
          fontSize: "0.9rem",
        }}
      >
        No category data available
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 85, bottom: 5 }}
        >
        <XAxis
          type="number"
          tickFormatter={(v) => `$${(v / 100).toFixed(0)}`}
          tick={{ fill: "rgba(219, 243, 244, 0.65)", fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="category"
          tick={{ fill: "rgba(219, 243, 244, 0.65)", fontSize: 12 }}
        />
        <Tooltip
          formatter={(v: any) => [`$${(Number(v) / 100).toFixed(2)}`, "Monthly spend"]}
          contentStyle={{ display: "none" }}
          cursor={{ fill: "rgba(34, 211, 238, 0.05)" }}
          wrapperClassName="chart-tooltip-glass"
        />
        <Bar dataKey="total" radius={[0, 8, 8, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={CATEGORY_COLORS[entry.category] || "#888780"}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
    </div>
  );
}
