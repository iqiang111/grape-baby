import { TrendingUp, Scale, Ruler, Circle } from "lucide-react";
import { getGrowthRecords, getBabyInfo } from "@/actions/growth";
import { GrowthChart } from "@/components/growth/growth-chart";
import { GrowthForm } from "@/components/growth/growth-form";
import { GrowthTable } from "@/components/growth/growth-table";

export default async function GrowthPage() {
  const [records, baby] = await Promise.all([
    getGrowthRecords(),
    getBabyInfo(),
  ]);

  // Latest record (records are sorted asc, so last is newest)
  const latest = records.length > 0 ? records[records.length - 1] : null;
  const gender = baby?.gender === "男" ? "male" : "female";
  const birthDate = baby?.birthDate?.toISOString() ?? new Date().toISOString();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <TrendingUp className="h-7 w-7 text-teal-400" />
          成长指标
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          记录小葡萄的成长轨迹
        </p>
      </div>

      {/* Latest Measurements Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card p-4 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100">
            <Scale className="h-5 w-5 text-teal-500" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">体重</p>
            <p className="text-lg font-bold text-gray-700">
              {latest?.weight != null ? `${latest.weight} kg` : "暂无"}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100">
            <Ruler className="h-5 w-5 text-teal-500" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">身长</p>
            <p className="text-lg font-bold text-gray-700">
              {latest?.height != null ? `${latest.height} cm` : "暂无"}
            </p>
          </div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-teal-50 to-teal-100">
            <Circle className="h-5 w-5 text-teal-500" />
          </div>
          <div className="text-center">
            <p className="text-xs text-muted-foreground">头围</p>
            <p className="text-lg font-bold text-gray-700">
              {latest?.headCirc != null ? `${latest.headCirc} cm` : "暂无"}
            </p>
          </div>
        </div>
      </div>

      {/* WHO Growth Chart */}
      <GrowthChart records={records} gender={gender} birthDate={birthDate} />

      {/* Add Record Form */}
      <GrowthForm />

      {/* Records Table */}
      <GrowthTable records={records} />
    </div>
  );
}
