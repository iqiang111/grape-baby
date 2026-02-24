import { Moon, Clock } from "lucide-react";
import { getSleepRecords, getActiveSleep } from "@/actions/sleep";
import { minutesToHoursMinutes } from "@/lib/utils";
import { SleepForm } from "@/components/sleep/sleep-form";
import { SleepList } from "@/components/sleep/sleep-list";

export default async function SleepPage() {
  const [records, activeSleep] = await Promise.all([
    getSleepRecords(),
    getActiveSleep(),
  ]);

  // Calculate today's stats
  const completedRecords = records.filter((r) => r.endTime);
  const totalMinutes = completedRecords.reduce((sum, r) => {
    const start = new Date(r.startTime).getTime();
    const end = new Date(r.endTime!).getTime();
    return sum + Math.round((end - start) / 60000);
  }, 0);
  const napCount = completedRecords.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Moon className="h-7 w-7 text-indigo-400" />
          睡眠记录
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          记录小葡萄的每一次安睡
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Clock className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">今日总睡眠</p>
            <p className="text-lg font-bold text-gray-900">
              {totalMinutes > 0 ? minutesToHoursMinutes(totalMinutes) : "暂无"}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50">
            <Moon className="h-5 w-5 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">小睡次数</p>
            <p className="text-lg font-bold text-gray-900">
              {napCount > 0 ? `${napCount} 次` : "暂无"}
            </p>
          </div>
        </div>
      </div>

      {/* Timer / Form */}
      <SleepForm
        activeSleep={
          activeSleep
            ? { id: activeSleep.id, startTime: activeSleep.startTime }
            : null
        }
      />

      {/* Timeline + Record List */}
      <SleepList records={records} />
    </div>
  );
}
