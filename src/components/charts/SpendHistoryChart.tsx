/** SpendHistoryChart — 6-month stacked area chart showing AI vs SaaS spend */
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getMonthlySpendHistory } from "@/lib/utils";
import type { Tool } from "@/types";

interface SpendHistoryChartProps {
  tools: Tool[];
}

export function SpendHistoryChart({ tools }: SpendHistoryChartProps) {
  const data = getMonthlySpendHistory(tools, 6);

  // Check if there's any spend data
  const hasData = data.some((d) => d.total > 0);

  if (!hasData) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 240,
          color: "rgba(219, 243, 244, 0.45)",
          fontSize: "0.9rem",
        }}
      >
        Add tools to see your spend history
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
        <XAxis
          dataKey="month"
          tick={{ fill: "rgba(219, 243, 244, 0.65)", fontSize: 12 }}
        />
        <YAxis
          tickFormatter={(v) => `$${(v / 100).toFixed(0)}`}
          tick={{ fill: "rgba(219, 243, 244, 0.65)", fontSize: 12 }}
        />
        <Tooltip
          formatter={(v: number) => `$${(v / 100).toFixed(2)}`}
          contentStyle={{
            background: "rgba(16, 24, 25, 0.95)",
            border: "1px solid rgba(34, 211, 238, 0.20)",
            borderRadius: 8,
            color: "#f3fbfb",
          }}
        />
        <Legend
          wrapperStyle={{
            color: "#f3fbfb",
            fontSize: 12,
          }}
        />
        <Area
          type="monotone"
          dataKey="saasTotal"
          stackId="spend"
          stroke="#0F766E"
          fill="#0F766E"
          fillOpacity={0.6}
          name="SaaS"
        />
        <Area
          type="monotone"
          dataKey="aiTotal"
          stackId="spend"
          stroke="#534AB7"
          fill="#534AB7"
          fillOpacity={0.6}
          name="AI tools"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
