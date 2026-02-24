"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export interface FeedingChartData {
  day: string;
  totalMl: number;
  count: number;
}

export function FeedingChart({ data }: { data: FeedingChartData[] }) {
  return (
    <div className="glass-card px-3 py-6 md:px-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 px-3 md:px-0">喂奶趋势</h3>
      <div className="h-64 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              yAxisId="ml"
              tick={{ fontSize: 12, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="count"
              orientation="right"
              tick={{ fontSize: 12, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "0.75rem",
                fontSize: 12,
              }}
              formatter={((value: any, name: any) => [
                name === "totalMl" ? `${value}ml` : `${value}次`,
                name === "totalMl" ? "奶量" : "次数",
              ]) as any}
            />
            <Bar
              yAxisId="ml"
              dataKey="totalMl"
              fill="#f43f5e"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
            <Bar
              yAxisId="count"
              dataKey="count"
              fill="#fda4af"
              radius={[4, 4, 0, 0]}
              barSize={12}
              opacity={0.7}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
