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

export interface SleepChartData {
  day: string;
  daytime: number;
  nighttime: number;
}

export function SleepChart({ data }: { data: SleepChartData[] }) {
  return (
    <div className="glass-card px-3 py-6 md:px-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4 px-3 md:px-0">睡眠模式</h3>
      <div className="h-64 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 24, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#737373" }}
              axisLine={false}
              tickLine={false}
              unit="h"
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "1px solid #e5e5e5",
                borderRadius: "0.75rem",
                fontSize: 12,
              }}
              formatter={((value: any, name: any) => [
                `${Number(value).toFixed(1)}小时`,
                name === "nighttime" ? "夜间睡眠" : "日间小睡",
              ]) as any}
            />
            <Bar
              dataKey="nighttime"
              stackId="sleep"
              fill="#6366f1"
              radius={[0, 0, 0, 0]}
              barSize={28}
            />
            <Bar
              dataKey="daytime"
              stackId="sleep"
              fill="#c7d2fe"
              radius={[6, 6, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex items-center justify-center gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#6366f1]" />
          <span className="text-xs text-muted-foreground">夜间睡眠</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-[#c7d2fe]" />
          <span className="text-xs text-muted-foreground">日间小睡</span>
        </div>
      </div>
    </div>
  );
}
