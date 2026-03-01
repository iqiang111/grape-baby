"use client";

import { cn } from "@/lib/utils";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import type { DaySummary } from "@/actions/calendar";

const WEEKDAY_LABELS = ["一", "二", "三", "四", "五", "六", "日"];

interface CalendarGridProps {
  currentMonth: string; // "2026-03"
  monthSummary: Record<string, DaySummary>;
  selectedDate: string | null;
  onSelectDay: (dateStr: string) => void;
}

export function CalendarGrid({
  currentMonth,
  monthSummary,
  selectedDate,
  onSelectDay,
}: CalendarGridProps) {
  const [year, month] = currentMonth.split("-").map(Number);
  const monthDate = new Date(year, month - 1, 1);

  const monthStart = startOfMonth(monthDate);
  const monthEnd = endOfMonth(monthDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="glass-card p-4">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-gray-400 py-1"
          >
            {label}
          </div>
        ))}
      </div>

      {/* Date cells */}
      <div className="grid grid-cols-7 gap-y-1">
        {days.map((day) => {
          const dateStr = format(day, "yyyy-MM-dd");
          const inMonth = isSameMonth(day, monthDate);
          const today = isToday(day);
          const selected = selectedDate === dateStr;
          const summary = monthSummary[dateStr];
          const hasFeeding = summary && summary.feedingCount > 0;
          const hasSleep = summary && summary.sleepTotalHours > 0;
          const hasDiaper = summary && summary.diaperCount > 0;

          return (
            <button
              key={dateStr}
              type="button"
              onClick={() => onSelectDay(dateStr)}
              className={cn(
                "flex flex-col items-center gap-0.5 py-1.5 rounded-lg transition-colors",
                !inMonth && "opacity-30",
                selected && "bg-indigo-50",
                !selected && inMonth && "hover:bg-gray-50"
              )}
            >
              <span
                className={cn(
                  "text-sm leading-6 w-7 h-7 flex items-center justify-center rounded-full",
                  today && !selected && "ring-2 ring-indigo-400",
                  selected && "bg-indigo-500 text-white",
                  !selected && inMonth && "text-gray-900",
                  !selected && !inMonth && "text-gray-400"
                )}
              >
                {format(day, "d")}
              </span>
              {/* Dots */}
              <div className="flex gap-0.5 h-1.5">
                {hasFeeding && (
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                )}
                {hasSleep && (
                  <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                )}
                {hasDiaper && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-rose-400" />
          <span className="text-xs text-gray-500">喂奶</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-indigo-400" />
          <span className="text-xs text-gray-500">睡眠</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-cyan-400" />
          <span className="text-xs text-gray-500">尿布</span>
        </div>
      </div>
    </div>
  );
}
