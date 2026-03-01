import { getDiapers, getDiaperStats } from "@/actions/diaper";
import { DIAPER_TYPES } from "@/lib/constants";
import { formatTime } from "@/lib/utils";
import { Droplets, Circle } from "lucide-react";
import { DiaperForm } from "@/components/diaper/diaper-form";
import { DeleteDiaperButton } from "./delete-button";

function getTypeIcon(type: string) {
  switch (type) {
    case "wet":
      return <Droplets className="h-4 w-4 text-cyan-500" />;
    case "dirty":
      return <Circle className="h-4 w-4 text-amber-500" />;
    case "both":
      return <Droplets className="h-4 w-4 text-emerald-500" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
}

function getTypeBg(type: string) {
  switch (type) {
    case "wet":
      return "bg-cyan-50";
    case "dirty":
      return "bg-amber-50";
    case "both":
      return "bg-emerald-50";
    default:
      return "bg-gray-50";
  }
}

function buildWeekData(
  stats: { time: Date; type: string }[]
): { label: string; wet: number; dirty: number; both: number; total: number }[] {
  const days: {
    label: string;
    wet: number;
    dirty: number;
    both: number;
    total: number;
  }[] = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toLocaleDateString("zh-CN", { weekday: "short", timeZone: "Asia/Shanghai" });
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);

    const dayRecords = stats.filter(
      (r) => r.time >= dayStart && r.time <= dayEnd
    );

    days.push({
      label: i === 0 ? "今天" : key,
      wet: dayRecords.filter((r) => r.type === "wet").length,
      dirty: dayRecords.filter((r) => r.type === "dirty").length,
      both: dayRecords.filter((r) => r.type === "both").length,
      total: dayRecords.length,
    });
  }

  return days;
}

export default async function DiaperPage() {
  const [records, stats] = await Promise.all([getDiapers(), getDiaperStats(7)]);

  const wetCount = records.filter((r) => r.type === "wet").length;
  const dirtyCount = records.filter((r) => r.type === "dirty").length;
  const bothCount = records.filter((r) => r.type === "both").length;
  const totalCount = records.length;

  const weekData = buildWeekData(stats);
  const maxTotal = Math.max(...weekData.map((d) => d.total), 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Droplets className="h-7 w-7 text-cyan-400" />
          换尿布
        </h1>
        <p className="text-sm text-muted-foreground">轻触按钮快速记录</p>
      </div>

      {/* Today summary */}
      <div className="grid grid-cols-4 gap-3">
        <div className="glass-card flex flex-col items-center px-3 py-3">
          <span className="text-2xl font-bold text-gray-700">{totalCount}</span>
          <span className="text-xs text-muted-foreground">今日总计</span>
        </div>
        <div className="glass-card flex flex-col items-center px-3 py-3">
          <div className="flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5 text-cyan-500" />
            <span className="text-2xl font-bold text-cyan-600">{wetCount}</span>
          </div>
          <span className="text-xs text-muted-foreground">小便</span>
        </div>
        <div className="glass-card flex flex-col items-center px-3 py-3">
          <div className="flex items-center gap-1">
            <Circle className="h-3.5 w-3.5 text-amber-500" />
            <span className="text-2xl font-bold text-amber-600">{dirtyCount}</span>
          </div>
          <span className="text-xs text-muted-foreground">大便</span>
        </div>
        <div className="glass-card flex flex-col items-center px-3 py-3">
          <div className="flex items-center gap-1">
            <Droplets className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-2xl font-bold text-emerald-600">{bothCount}</span>
          </div>
          <span className="text-xs text-muted-foreground">大小便</span>
        </div>
      </div>

      {/* Quick record form */}
      <DiaperForm />

      {/* 7-day bar chart */}
      <div className="glass-card p-4">
        <h2 className="mb-4 text-sm font-semibold text-gray-700">近7天趋势</h2>
        <div className="flex items-end justify-between gap-2" style={{ height: 120 }}>
          {weekData.map((day, i) => {
            const barH = maxTotal > 0 ? (day.total / maxTotal) * 100 : 0;
            return (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-gray-600">
                  {day.total || ""}
                </span>
                <div
                  className="w-full rounded-t-lg bg-gray-800 transition-all duration-500"
                  style={{
                    height: `${Math.max(barH, 4)}%`,
                    minHeight: day.total > 0 ? 8 : 4,
                  }}
                />
                <span className="text-[10px] text-muted-foreground">
                  {day.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Today's records */}
      <div className="glass-card p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-700">
          今日记录
          {totalCount > 0 && (
            <span className="ml-2 text-xs font-normal text-muted-foreground">
              共 {totalCount} 次
            </span>
          )}
        </h2>

        {records.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            还没有记录，点击上方按钮开始记录吧
          </p>
        ) : (
          <div className="space-y-2">
            {records.map((record) => (
              <div
                key={record.id}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 ${getTypeBg(record.type)}`}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80">
                  {getTypeIcon(record.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {DIAPER_TYPES[record.type as keyof typeof DIAPER_TYPES] ??
                        record.type}
                    </span>
                    {record.color && (
                      <span className="text-xs text-muted-foreground">
                        · {record.color === "yellow" ? "黄色" : record.color === "green" ? "绿色" : record.color === "brown" ? "棕色" : record.color === "black" ? "黑色" : record.color}
                      </span>
                    )}
                  </div>
                  {record.note && (
                    <p className="truncate text-xs text-muted-foreground">
                      {record.note}
                    </p>
                  )}
                </div>
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {formatTime(record.time)}
                </span>
                <DeleteDiaperButton id={record.id} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
