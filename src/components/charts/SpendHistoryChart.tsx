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
          formatter={(v: any) => `$${(Number(v) / 100).toFixed(2)}`}
          contentStyle={{ display: "none" }}
          cursor={{ stroke: "rgba(34, 211, 238, 0.4)", strokeWidth: 1, strokeDasharray: "3 3" }}
          wrapperClassName="chart-tooltip-glass"
        />
        <Legend
          wrapperStyle={{
            color: "#f3fbfb",
            fontSize: 12,
          }}
        />
        <defs>
          <linearGradient id="colorSaaS" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#22d3ee" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="colorAI" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#c084fc" stopOpacity={0.8} />
            <stop offset="95%" stopColor="#c084fc" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="saasTotal"
          stackId="spend"
          stroke="#22d3ee"
          strokeWidth={3}
          fill="url(#colorSaaS)"
          name="SaaS"
        />
        <Area
          type="monotone"
          dataKey="aiTotal"
          stackId="spend"
          stroke="#c084fc"
          strokeWidth={3}
          fill="url(#colorAI)"
          name="AI tools"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
