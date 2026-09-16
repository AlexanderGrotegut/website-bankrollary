"use client";

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatMoney } from "@/lib/domain";

export function BankrollChart({
  data,
  currency,
}: {
  data: { date: string; value: number }[];
  currency: string;
}) {
  const chartData = data.map((point) => ({
    ...point,
    label: new Intl.DateTimeFormat("de-DE", {
      day: "2-digit",
      month: "short",
    }).format(new Date(point.date)),
  }));

  return (
    <div className="h-[310px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey="label"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            minTickGap={35}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "var(--muted)", fontSize: 12 }}
            width={64}
            tickFormatter={(value: number) => Intl.NumberFormat("de-DE", { notation: "compact" }).format(value)}
          />
          <Tooltip
            cursor={{ stroke: "var(--accent)", strokeDasharray: "4 4" }}
            contentStyle={{
              background: "var(--panel)",
              border: "1px solid var(--border)",
              borderRadius: 12,
            }}
            formatter={(value) => [
              formatMoney(typeof value === "number" ? value : Number(value), currency),
              "Bankroll",
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="var(--accent)"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 5, fill: "var(--accent)" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
