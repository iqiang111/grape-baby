"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  boysWeight,
  girlsWeight,
  boysLength,
  girlsLength,
  boysHeadCirc,
  girlsHeadCirc,
  type GrowthDataPoint,
} from "@/data/who-standards";

interface GrowthRecord {
  id: string;
  date: Date;
  weight: number | null;
  height: number | null;
  headCirc: number | null;
}

interface GrowthChartProps {
  records: GrowthRecord[];
  gender: string;
  birthDate: string;
}

type TabKey = "weight" | "height" | "headCirc";

const TABS: { key: TabKey; label: string; unit: string }[] = [
  { key: "weight", label: "体重", unit: "kg" },
  { key: "height", label: "身长", unit: "cm" },
  { key: "headCirc", label: "头围", unit: "cm" },
];

function getWhoData(gender: string, tab: TabKey): GrowthDataPoint[] {
  const isBoy = gender === "male";
  switch (tab) {
    case "weight":
      return isBoy ? boysWeight : girlsWeight;
    case "height":
      return isBoy ? boysLength : girlsLength;
    case "headCirc":
      return isBoy ? boysHeadCirc : girlsHeadCirc;
  }
}

function monthsBetween(birth: Date, date: Date) {
  const b = new Date(birth);
  const d = new Date(date);
  const diffMs = d.getTime() - b.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.max(0, Math.round((diffDays / 30.44) * 10) / 10);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-gray-100 bg-white px-3 py-2 shadow-lg text-xs">
      <p className="font-medium text-gray-700 mb-1">{label} 个月</p>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <p key={i} style={{ color: entry.color }} className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function GrowthChart({ records, gender, birthDate }: GrowthChartProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("weight");

  const chartData = useMemo(() => {
    const who = getWhoData(gender, activeTab);

    // Build base data from all WHO months (0-12)
    const data = who.map((point) => ({
      month: point.month,
      p3: point.p3,
      p15: point.p15,
      p50: point.p50,
      p85: point.p85,
      p97: point.p97,
      actual: undefined as number | undefined,
    }));

    // Overlay baby's actual data at precise month positions
    records.forEach((record) => {
      const value = record[activeTab];
      if (value == null) return;
      const month = monthsBetween(new Date(birthDate), new Date(record.date));
      if (month < 0 || month > 12) return;

      // Interpolate WHO percentiles at this exact month
      const roundedMonth = Math.round(month * 10) / 10;
      const lower = who.filter((p) => p.month <= month).pop();
      const upper = who.find((p) => p.month >= month);

      let p3 = 0, p15 = 0, p50 = 0, p85 = 0, p97 = 0;
      if (lower && upper && lower.month !== upper.month) {
        const t = (month - lower.month) / (upper.month - lower.month);
        p3 = lower.p3 + t * (upper.p3 - lower.p3);
        p15 = lower.p15 + t * (upper.p15 - lower.p15);
        p50 = lower.p50 + t * (upper.p50 - lower.p50);
        p85 = lower.p85 + t * (upper.p85 - lower.p85);
        p97 = lower.p97 + t * (upper.p97 - lower.p97);
      } else if (lower) {
        p3 = lower.p3; p15 = lower.p15; p50 = lower.p50; p85 = lower.p85; p97 = lower.p97;
      } else if (upper) {
        p3 = upper.p3; p15 = upper.p15; p50 = upper.p50; p85 = upper.p85; p97 = upper.p97;
      }

      data.push({
        month: roundedMonth,
        p3: Math.round(p3 * 10) / 10,
        p15: Math.round(p15 * 10) / 10,
        p50: Math.round(p50 * 10) / 10,
        p85: Math.round(p85 * 10) / 10,
        p97: Math.round(p97 * 10) / 10,
        actual: value,
      });
    });

    return data.sort((a, b) => a.month - b.month);
  }, [records, gender, activeTab, birthDate]);

  const currentTab = TABS.find((t) => t.key === activeTab)!;

  return (
    <div className="glass-card p-4 sm:p-5">
      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-xl bg-gray-50 p-1 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              "flex-1 rounded-lg py-2 text-sm font-medium transition-all",
              activeTab === tab.key
                ? "bg-white text-gray-700 shadow-sm"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3 text-[11px] text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="inline-block h-2 w-6 rounded-full bg-gray-200" /> P3-P97 范围
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-0.5 w-6 bg-gray-300" /> P50 中位数
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-[3px] w-6 bg-teal-500" /> 实际测量
        </span>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f5" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: "#737373" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e5e5" }}
              label={{ value: "月龄", position: "insideBottomRight", offset: -5, fontSize: 11, fill: "#737373" }}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#737373" }}
              tickLine={false}
              axisLine={{ stroke: "#e5e5e5" }}
              label={{ value: currentTab.unit, position: "insideTopLeft", offset: 10, fontSize: 11, fill: "#737373" }}
            />
            <Tooltip content={<CustomTooltip />} />

            {/* P3-P97 shaded band */}
            <Area
              dataKey="p97"
              stroke="none"
              fill="#f5f5f5"
              fillOpacity={0.5}
              name="P97"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />
            <Area
              dataKey="p3"
              stroke="none"
              fill="#ffffff"
              fillOpacity={1}
              name="P3"
              dot={false}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Percentile lines */}
            <Line dataKey="p3" stroke="#d4d4d4" strokeWidth={1} strokeDasharray="4 4" dot={false} name="P3" isAnimationActive={false} />
            <Line dataKey="p15" stroke="#d4d4d4" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P15" isAnimationActive={false} />
            <Line dataKey="p50" stroke="#737373" strokeWidth={1.5} dot={false} name="P50" isAnimationActive={false} />
            <Line dataKey="p85" stroke="#d4d4d4" strokeWidth={1} strokeDasharray="3 3" dot={false} name="P85" isAnimationActive={false} />
            <Line dataKey="p97" stroke="#d4d4d4" strokeWidth={1} strokeDasharray="4 4" dot={false} name="P97" isAnimationActive={false} />

            {/* Baby's actual data */}
            <Line
              dataKey="actual"
              stroke="#14b8a6"
              strokeWidth={2.5}
              dot={{ r: 4, fill: "#14b8a6", stroke: "#fff", strokeWidth: 2 }}
              activeDot={{ r: 6, fill: "#14b8a6", stroke: "#fff", strokeWidth: 2 }}
              name="实际测量"
              connectNulls
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
