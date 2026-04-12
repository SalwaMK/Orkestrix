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
  ai: "#534AB7",
  development: "#0F766E",
  design: "#D85A30",
  productivity: "#378ADD",
  marketing: "#D4537E",
  communication: "#1D9E75",
  finance: "#BA7517",
  other: "#888780",
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

  const chartHeight = Math.max(120, data.length * 40);

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
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
          formatter={(v: number) => [`$${(v / 100).toFixed(2)}`, "Monthly spend"]}
          contentStyle={{
            background: "rgba(16, 24, 25, 0.95)",
            border: "1px solid rgba(34, 211, 238, 0.20)",
            borderRadius: 8,
            color: "#f3fbfb",
          }}
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
  );
}
