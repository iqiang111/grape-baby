"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Thermometer, Plus, Minus } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { TEMPERATURE_METHODS } from "@/lib/constants";
import { addTemperature } from "@/actions/health";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";

interface Temperature {
  id: string;
  time: Date | string;
  value: number;
  method: string | null;
  note: string | null;
}

interface TemperatureTrackerProps {
  temperatures: Temperature[];
}

const NORMAL_LOW = 36.0;
const NORMAL_HIGH = 37.5;

function getTemperatureColor(value: number): string {
  if (value < NORMAL_LOW) return "text-blue-500";
  if (value <= NORMAL_HIGH) return "text-emerald-500";
  if (value <= 38.5) return "text-orange-500";
  return "text-red-500";
}

function getTemperatureLabel(value: number): string {
  if (value < NORMAL_LOW) return "偏低";
  if (value <= NORMAL_HIGH) return "正常";
  if (value <= 38.5) return "低烧";
  return "高烧";
}

export function TemperatureTracker({ temperatures }: TemperatureTrackerProps) {
  const [isPending, startTransition] = useTransition();
  const [value, setValue] = useState(36.5);
  const [method, setMethod] = useState<string>("ear");

  function adjust(delta: number) {
    setValue((prev) => {
      const next = Math.round((prev + delta) * 10) / 10;
      return Math.max(34.0, Math.min(42.0, next));
    });
  }

  function handleSubmit() {
    startTransition(async () => {
      await addTemperature({
        time: new Date().toISOString(),
        value,
        method,
      });
      setValue(36.5);
    });
  }

  // Chart data: reverse so oldest first
  const chartData = [...temperatures]
    .reverse()
    .map((t) => ({
      time: new Date(t.time).toLocaleTimeString("zh-CN", {
        month: "numeric",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: typeof t.value === "number" ? t.value : Number(t.value),
    }));

  const chartMin = chartData.length > 0
    ? Math.min(Math.floor(Math.min(...chartData.map((d) => d.value)) * 10) / 10, NORMAL_LOW) - 0.3
    : 35.0;
  const chartMax = chartData.length > 0
    ? Math.max(Math.ceil(Math.max(...chartData.map((d) => d.value)) * 10) / 10, NORMAL_HIGH) + 0.3
    : 39.0;

  return (
    <div className="space-y-4">
      {/* Quick input */}
      <div className="glass-card p-5">
        <div className="flex flex-col items-center">
          {/* Temperature display */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => adjust(-0.1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 active:scale-95"
            >
              <Minus className="h-5 w-5" />
            </button>
            <div className="text-center">
              <span className={cn("text-5xl font-bold tabular-nums", getTemperatureColor(value))}>
                {value.toFixed(1)}
              </span>
              <span className="ml-1 text-lg text-muted-foreground">°C</span>
              <p className={cn("mt-1 text-sm font-medium", getTemperatureColor(value))}>
                {getTemperatureLabel(value)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => adjust(0.1)}
              className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-50 text-gray-600 transition-colors hover:bg-gray-100 active:scale-95"
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>

          {/* Method selector */}
          <div className="mt-4 flex gap-2">
            {(Object.entries(TEMPERATURE_METHODS) as [string, string][]).map(
              ([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setMethod(key)}
                  className={cn(
                    "rounded-xl px-3 py-2 text-xs font-medium transition-all active:scale-95",
                    method === key
                      ? "bg-gray-900 text-white shadow-sm"
                      : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {label}
                </button>
              )
            )}
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isPending}
            className="mt-4 w-full rounded-2xl bg-gray-900 py-3.5 text-sm font-semibold text-white shadow-lg shadow-lg transition-all active:scale-[0.98]"
          >
            {isPending ? "记录中..." : "记录体温"}
          </button>
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 1 && (
        <div className="glass-card p-4">
          <h3 className="mb-3 text-sm font-semibold text-gray-700">
            近期体温趋势
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 10, left: -15, bottom: 5 }}>
                <ReferenceArea
                  y1={NORMAL_LOW}
                  y2={NORMAL_HIGH}
                  fill="#86efac"
                  fillOpacity={0.2}
                  strokeOpacity={0}
                />
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  domain={[chartMin, chartMax]}
                  tick={{ fontSize: 10, fill: "#9ca3af" }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => v.toFixed(1)}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e5e5",
                    fontSize: 12,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                  }}
                  formatter={((v: any) => [`${Number(v).toFixed(1)}°C`, "体温"]) as any}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#171717"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#171717", strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 6, fill: "#171717" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Recent readings */}
      <div className="glass-card p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">
          最近记录
          {temperatures.length > 0 && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              共 {temperatures.length} 条
            </span>
          )}
        </h3>
        {temperatures.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            暂无体温记录
          </p>
        ) : (
          <div className="space-y-2">
            {temperatures.slice(0, 20).map((t) => {
              const v = typeof t.value === "number" ? t.value : Number(t.value);
              return (
                <motion.div
                  key={t.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 rounded-xl bg-gray-50 px-3 py-2.5"
                >
                  <Thermometer className={cn("h-4 w-4 shrink-0", getTemperatureColor(v))} />
                  <span className={cn("text-base font-bold tabular-nums", getTemperatureColor(v))}>
                    {v.toFixed(1)}°C
                  </span>
                  {t.method && (
                    <span className="rounded-md bg-white px-1.5 py-0.5 text-xs text-muted-foreground">
                      {TEMPERATURE_METHODS[t.method as keyof typeof TEMPERATURE_METHODS] ?? t.method}
                    </span>
                  )}
                  <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                    {formatDateTime(t.time)}
                  </span>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
