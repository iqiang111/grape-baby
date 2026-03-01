import { getMonthSummary } from "@/actions/calendar";
import { getFeedingStats } from "@/actions/feeding";
import { getSleepStats } from "@/actions/sleep";
import { getDiaperStats } from "@/actions/diaper";
import { CalendarPageClient } from "./calendar-client";

const RANGE_DAYS: Record<string, number> = {
  "7": 7,
  "30": 30,
  "90": 90,
  all: 3650,
};

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; range?: string }>;
}) {
  const params = await searchParams;
  const now = new Date();
  const currentMonth =
    params.month || `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const currentRange = params.range || "30";

  const [yearStr, monthStr] = currentMonth.split("-");
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);

  const rangeDays = RANGE_DAYS[currentRange] ?? 30;

  const [monthSummary, feedingRaw, sleepRaw, diaperRaw] = await Promise.all([
    getMonthSummary(year, month),
    getFeedingStats(rangeDays),
    getSleepStats(rangeDays),
    getDiaperStats(rangeDays),
  ]);

  // --- Feeding chart data ---
  const feedingMap = new Map<string, { totalMl: number; count: number }>();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    feedingMap.set(key, { totalMl: 0, count: 0 });
  }
  for (const f of feedingRaw) {
    const key = f.time.toISOString().slice(0, 10);
    const entry = feedingMap.get(key);
    if (entry) {
      entry.totalMl += f.amount ?? 0;
      entry.count += 1;
    }
  }
  const feedingChartData = Array.from(feedingMap.entries()).map(
    ([dateStr, val]) => ({
      day: formatDayLabel(dateStr),
      totalMl: val.totalMl,
      count: val.count,
    })
  );

  // --- Sleep chart data ---
  const sleepMap = new Map<string, { daytime: number; nighttime: number }>();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    sleepMap.set(key, { daytime: 0, nighttime: 0 });
  }
  for (const s of sleepRaw) {
    if (!s.endTime) continue;
    const key = s.startTime.toISOString().slice(0, 10);
    const entry = sleepMap.get(key);
    if (!entry) continue;
    const hours =
      (s.endTime.getTime() - s.startTime.getTime()) / 3600000;
    const startHour = s.startTime.getHours();
    if (startHour >= 19 || startHour < 7) {
      entry.nighttime += hours;
    } else {
      entry.daytime += hours;
    }
  }
  const sleepChartData = Array.from(sleepMap.entries()).map(
    ([dateStr, val]) => ({
      day: formatDayLabel(dateStr),
      daytime: Math.round(val.daytime * 10) / 10,
      nighttime: Math.round(val.nighttime * 10) / 10,
    })
  );

  // --- Diaper chart data ---
  const diaperMap = new Map<
    string,
    { wet: number; dirty: number; both: number }
  >();
  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    diaperMap.set(key, { wet: 0, dirty: 0, both: 0 });
  }
  for (const d of diaperRaw) {
    const key = d.time.toISOString().slice(0, 10);
    const entry = diaperMap.get(key);
    if (!entry) continue;
    if (d.type === "wet") entry.wet += 1;
    else if (d.type === "dirty") entry.dirty += 1;
    else if (d.type === "both") entry.both += 1;
  }
  const diaperChartData = Array.from(diaperMap.entries()).map(
    ([dateStr, val]) => ({
      day: formatDayLabel(dateStr),
      wet: val.wet,
      dirty: val.dirty,
      both: val.both,
    })
  );

  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <CalendarPageClient
        monthSummary={monthSummary}
        currentMonth={currentMonth}
        currentRange={currentRange}
        feedingChartData={feedingChartData}
        sleepChartData={sleepChartData}
        diaperChartData={diaperChartData}
      />
    </div>
  );
}

function formatDayLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getMonth() + 1}/${d.getDate()}`;
}
