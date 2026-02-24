import { getFeedings, getFeedingStats, getRecentFeedings } from "@/actions/feeding";
import { getSleepRecords, getSleepStats } from "@/actions/sleep";
import { getDiapers } from "@/actions/diaper";
import { FEEDING_TYPES, DIAPER_TYPES } from "@/lib/constants";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { RecentActivity, type ActivityItem } from "@/components/dashboard/recent-activity";
import { FeedingChart, type FeedingChartData } from "@/components/dashboard/feeding-chart";
import { SleepChart, type SleepChartData } from "@/components/dashboard/sleep-chart";

const DAY_LABELS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

export default async function Home() {
  const [feedings, sleepRecords, diapers, feedingStats, sleepStats, recentFeedings] =
    await Promise.all([
      getFeedings(),
      getSleepRecords(),
      getDiapers(),
      getFeedingStats(7),
      getSleepStats(7),
      getRecentFeedings(5),
    ]);

  // --- Overview stats ---
  const feedingCount = feedings.length;
  const feedingTotalMl = feedings.reduce((sum, f) => sum + (f.amount ?? 0), 0);
  const lastFeedingTime = feedings.length > 0 ? feedings[0].time.toISOString() : null;

  const sleepTotalMinutes = sleepRecords.reduce((sum, s) => {
    if (!s.endTime) return sum;
    return sum + (s.endTime.getTime() - s.startTime.getTime()) / 60000;
  }, 0);
  const sleepTotalHours = sleepTotalMinutes / 60;

  const diaperCount = diapers.length;

  const stats = {
    feedingCount,
    feedingTotalMl,
    sleepTotalHours,
    diaperCount,
    lastFeedingTime,
  };

  // --- 7-day feeding chart data ---
  const feedingChartMap = new Map<string, { totalMl: number; count: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    feedingChartMap.set(key, { totalMl: 0, count: 0 });
  }
  for (const f of feedingStats) {
    const key = f.time.toISOString().slice(0, 10);
    const entry = feedingChartMap.get(key);
    if (entry) {
      entry.totalMl += f.amount ?? 0;
      entry.count += 1;
    }
  }
  const feedingChartData: FeedingChartData[] = Array.from(
    feedingChartMap.entries()
  ).map(([dateStr, val]) => ({
    day: DAY_LABELS[new Date(dateStr).getDay()],
    totalMl: val.totalMl,
    count: val.count,
    _weekOrder: (new Date(dateStr).getDay() + 6) % 7, // Mon=0 … Sun=6
  }))
    .sort((a, b) => a._weekOrder - b._weekOrder)
    .map(({ _weekOrder, ...rest }) => rest);

  // --- 7-day sleep chart data ---
  const sleepChartMap = new Map<string, { daytime: number; nighttime: number }>();
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    sleepChartMap.set(key, { daytime: 0, nighttime: 0 });
  }
  for (const s of sleepStats) {
    if (!s.endTime) continue;
    const key = s.startTime.toISOString().slice(0, 10);
    const entry = sleepChartMap.get(key);
    if (!entry) continue;
    const hours = (s.endTime.getTime() - s.startTime.getTime()) / 3600000;
    const startHour = s.startTime.getHours();
    if (startHour >= 19 || startHour < 7) {
      entry.nighttime += hours;
    } else {
      entry.daytime += hours;
    }
  }
  const sleepChartData: SleepChartData[] = Array.from(
    sleepChartMap.entries()
  ).map(([dateStr, val]) => ({
    day: DAY_LABELS[new Date(dateStr).getDay()],
    daytime: Math.round(val.daytime * 10) / 10,
    nighttime: Math.round(val.nighttime * 10) / 10,
    _weekOrder: (new Date(dateStr).getDay() + 6) % 7,
  }))
    .sort((a, b) => a._weekOrder - b._weekOrder)
    .map(({ _weekOrder, ...rest }) => rest);

  // --- Recent activity timeline ---
  const activities: ActivityItem[] = [];

  for (const f of recentFeedings) {
    const typeLabel =
      FEEDING_TYPES[f.type as keyof typeof FEEDING_TYPES] ?? f.type;
    const amountStr = f.amount ? ` ${f.amount}ml` : "";
    activities.push({
      id: f.id,
      type: "feeding",
      description: `${typeLabel}${amountStr}`,
      time: f.time.toISOString(),
    });
  }

  for (const s of sleepRecords.slice(0, 5)) {
    const dur = s.endTime
      ? `${((s.endTime.getTime() - s.startTime.getTime()) / 3600000).toFixed(1)}小时`
      : "进行中";
    activities.push({
      id: s.id,
      type: "sleep",
      description: `睡眠 ${dur}`,
      time: s.startTime.toISOString(),
    });
  }

  for (const d of diapers.slice(0, 5)) {
    const typeLabel =
      DIAPER_TYPES[d.type as keyof typeof DIAPER_TYPES] ?? d.type;
    activities.push({
      id: d.id,
      type: "diaper",
      description: `换尿布 · ${typeLabel}`,
      time: d.time.toISOString(),
    });
  }

  activities.sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );
  const recentActivities = activities.slice(0, 10);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">
          小葡萄的一天
        </h2>
        <p className="text-sm text-muted-foreground">
          {new Date().toLocaleDateString("zh-CN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            weekday: "long",
          })}
        </p>
      </div>

      <OverviewCards stats={stats} />

      <QuickActions />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FeedingChart data={feedingChartData} />
        <SleepChart data={sleepChartData} />
      </div>

      <RecentActivity activities={recentActivities} />
    </div>
  );
}
