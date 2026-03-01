"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { CalendarGrid } from "@/components/calendar/calendar-grid";
import { DayDetail } from "@/components/calendar/day-detail";
import {
  TrendCharts,
  type FeedingTrendData,
  type SleepTrendData,
  type DiaperTrendData,
} from "@/components/calendar/trend-charts";
import type { DaySummary } from "@/actions/calendar";

interface CalendarPageClientProps {
  monthSummary: Record<string, DaySummary>;
  currentMonth: string;
  currentRange: string;
  feedingChartData: FeedingTrendData[];
  sleepChartData: SleepTrendData[];
  diaperChartData: DiaperTrendData[];
}

export function CalendarPageClient({
  monthSummary,
  currentMonth,
  currentRange,
  feedingChartData,
  sleepChartData,
  diaperChartData,
}: CalendarPageClientProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [year, month] = currentMonth.split("-").map(Number);

  const navigateMonth = (delta: number) => {
    const d = new Date(year, month - 1 + delta, 1);
    const newMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    router.push(`/calendar?month=${newMonth}&range=${currentRange}`);
    setSelectedDate(null);
  };

  const handleRangeChange = (range: string) => {
    router.push(`/calendar?month=${currentMonth}&range=${range}`);
  };

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigateMonth(-1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-bold text-gray-900">
          {year}年{month}月
        </h2>
        <button
          type="button"
          onClick={() => navigateMonth(1)}
          className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Calendar grid */}
      <CalendarGrid
        currentMonth={currentMonth}
        monthSummary={monthSummary}
        selectedDate={selectedDate}
        onSelectDay={(d) => setSelectedDate(selectedDate === d ? null : d)}
      />

      {/* Day detail */}
      <DayDetail dateStr={selectedDate} />

      {/* Trend charts */}
      <TrendCharts
        currentRange={currentRange}
        feedingData={feedingChartData}
        sleepData={sleepChartData}
        diaperData={diaperChartData}
        onRangeChange={handleRangeChange}
      />
    </div>
  );
}
