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
import { cn } from "@/lib/utils";

export interface FeedingTrendData {
  day: string;
  totalMl: number;
  count: number;
}

export interface SleepTrendData {
  day: string;
  daytime: number;
  nighttime: number;
}

export interface DiaperTrendData {
  day: string;
  wet: number;
  dirty: number;
  both: number;
}

interface TrendChartsProps {
  currentRange: string;
  feedingData: FeedingTrendData[];
  sleepData: SleepTrendData[];
  diaperData: DiaperTrendData[];
  onRangeChange: (range: string) => void;
}

const RANGES = [
  { key: "7", label: "7天" },
  { key: "30", label: "30天" },
  { key: "90", label: "90天" },
  { key: "all", label: "全部" },
];

const tooltipStyle = {
  background: "#ffffff",
  border: "1px solid #e5e5e5",
  borderRadius: "0.75rem",
  fontSize: 12,
};

function getInterval(dataLength: number, range: string): number {
  if (range === "7") return 0;
  if (range === "30") return 2;
  return Math.max(0, Math.ceil(dataLength / 12) - 1);
}

export function TrendCharts({
  currentRange,
  feedingData,
  sleepData,
  diaperData,
  onRangeChange,
}: TrendChartsProps) {
  const interval = getInterval(
    Math.max(feedingData.length, sleepData.length, diaperData.length),
    currentRange
  );

  return (
    <div className="space-y-4">
      {/* Range switcher */}
      <div className="flex gap-1 rounded-2xl bg-gray-100 p-1">
        {RANGES.map(({ key, label }) => (
          <button
            key={key}
            type="button"
            onClick={() => onRangeChange(key)}
            className={cn(
              "flex-1 rounded-xl py-2 text-xs font-medium transition-all",
              currentRange === key
                ? "bg-white text-gray-700 shadow-sm"
                : "text-gray-500 hover:text-gray-600"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Feeding trend */}
      <div className="glass-card px-3 py-6 md:px-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 px-3 md:px-0">
          喂奶趋势
        </h3>
        <div className="h-56 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={feedingData}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
                interval={interval}
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
                contentStyle={tooltipStyle}
                formatter={((value: number, name: string) => [
                  name === "totalMl" ? `${value}ml` : `${value}次`,
                  name === "totalMl" ? "奶量" : "次数",
                ]) as never}
              />
              <Bar
                yAxisId="ml"
                dataKey="totalMl"
                fill="#f43f5e"
                radius={[6, 6, 0, 0]}
                barSize={currentRange === "7" ? 28 : undefined}
              />
              <Bar
                yAxisId="count"
                dataKey="count"
                fill="#fda4af"
                radius={[4, 4, 0, 0]}
                barSize={currentRange === "7" ? 12 : undefined}
                opacity={0.7}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sleep trend */}
      <div className="glass-card px-3 py-6 md:px-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 px-3 md:px-0">
          睡眠趋势
        </h3>
        <div className="h-56 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={sleepData}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
                interval={interval}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
                unit="h"
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={((value: number, name: string) => [
                  `${Number(value).toFixed(1)}小时`,
                  name === "nighttime" ? "夜间睡眠" : "日间小睡",
                ]) as never}
              />
              <Bar
                dataKey="nighttime"
                stackId="sleep"
                fill="#6366f1"
                radius={[0, 0, 0, 0]}
                barSize={currentRange === "7" ? 28 : undefined}
              />
              <Bar
                dataKey="daytime"
                stackId="sleep"
                fill="#c7d2fe"
                radius={[6, 6, 0, 0]}
                barSize={currentRange === "7" ? 28 : undefined}
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

      {/* Diaper trend */}
      <div className="glass-card px-3 py-6 md:px-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4 px-3 md:px-0">
          尿布趋势
        </h3>
        <div className="h-56 -mx-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={diaperData}
              margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 11, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
                interval={interval}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#737373" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                formatter={((value: number, name: string) => {
                  const labels: Record<string, string> = {
                    wet: "小便",
                    dirty: "大便",
                    both: "大小便",
                  };
                  return [`${value}次`, labels[name] ?? name];
                }) as never}
              />
              <Bar
                dataKey="wet"
                stackId="diaper"
                fill="#06b6d4"
                radius={[0, 0, 0, 0]}
                barSize={currentRange === "7" ? 28 : undefined}
              />
              <Bar
                dataKey="dirty"
                stackId="diaper"
                fill="#f59e0b"
                radius={[0, 0, 0, 0]}
                barSize={currentRange === "7" ? 28 : undefined}
              />
              <Bar
                dataKey="both"
                stackId="diaper"
                fill="#10b981"
                radius={[6, 6, 0, 0]}
                barSize={currentRange === "7" ? 28 : undefined}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-4 mt-3">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#06b6d4]" />
            <span className="text-xs text-muted-foreground">小便</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
            <span className="text-xs text-muted-foreground">大便</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            <span className="text-xs text-muted-foreground">大小便</span>
          </div>
        </div>
      </div>
    </div>
  );
}
