"use client";

import { useMemo, useState } from "react";
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
  const [axisMode, setAxisMode] = useState<"date" | "sessions">("date");

  const dateConsolidated = useMemo(() => {
    const byDate = new Map<string, { date: string; value: number }>();
    for (const point of data) {
      const key = new Intl.DateTimeFormat("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(point.date));
      byDate.set(key, point);
    }
    return [...byDate.values()];
  }, [data]);

  const source = axisMode === "date" ? dateConsolidated : data;
  const chartData = source.map((point, index) => ({
    ...point,
    label: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
    }).format(new Date(point.date)),
    sessionLabel: index === 0 ? "Start" : String(index),
  }));

  return (
    <>
      <div className="mb-4 flex justify-end">
        <div className="segmented">
          <button
            className={axisMode === "date" ? "active" : ""}
            type="button"
            onClick={() => setAxisMode("date")}
          >
            Date
          </button>
          <button
            className={axisMode === "sessions" ? "active" : ""}
            type="button"
            onClick={() => setAxisMode("sessions")}
          >
            Sessions
          </button>
        </div>
      </div>
      <div className="h-[310px] w-full">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 12, right: 8, left: 4, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
          <XAxis
            dataKey={axisMode === "date" ? "label" : "sessionLabel"}
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
            tickFormatter={(value: number) => Intl.NumberFormat("en-US", { notation: "compact" }).format(value)}
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
    </>
  );
}
