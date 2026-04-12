/** AiVsSaasChart — donut pie chart comparing AI vs SaaS spend */
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { normalizeToMonthly, formatCurrency } from "@/lib/utils";
import type { Tool } from "@/types";

interface AiVsSaasChartProps {
  tools: Tool[];
}

const COLORS = {
  ai: "#534AB7",
  saas: "#0F766E",
};

export function AiVsSaasChart({ tools }: AiVsSaasChartProps) {
  const activeTools = tools.filter((t) => t.status === "active");

  let aiTotal = 0;
  let saasTotal = 0;

  activeTools.forEach((tool) => {
    const monthlyAmount = normalizeToMonthly(tool.cost, tool.billingCycle);
    if (tool.isAiTool) {
      aiTotal += monthlyAmount;
    } else {
      saasTotal += monthlyAmount;
    }
  });

  const total = aiTotal + saasTotal;

  if (total === 0) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: 280,
          color: "rgba(219, 243, 244, 0.45)",
          fontSize: "0.9rem",
        }}
      >
        No spend data available
      </div>
    );
  }

  const data = [
    { name: "AI tools", value: aiTotal, color: COLORS.ai },
    { name: "SaaS", value: saasTotal, color: COLORS.saas },
  ].filter((entry) => entry.value > 0);

  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
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
            verticalAlign="bottom"
            height={36}
            formatter={(value, entry: any) => {
              const percentage = ((entry.payload.value / total) * 100).toFixed(0);
              return `${value} (${percentage}%)`;
            }}
            wrapperStyle={{
              color: "#f3fbfb",
              fontSize: 12,
            }}
          />
        </PieChart>
      </ResponsiveContainer>

      {/* Center label */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
          marginTop: -18,
        }}
      >
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: 700,
            color: "#f3fbfb",
            lineHeight: 1,
          }}
        >
          {formatCurrency(total)}
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "rgba(219, 243, 244, 0.55)",
            marginTop: 4,
          }}
        >
          / mo
        </div>
      </div>
    </div>
  );
}
