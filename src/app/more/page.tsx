import Link from "next/link";
import { TrendingUp, Heart, Star, CalendarDays, Download } from "lucide-react";

const entries = [
  { href: "/growth", label: "成长", desc: "身高体重头围记录", icon: TrendingUp, color: "text-indigo-500 bg-indigo-50" },
  { href: "/health", label: "健康", desc: "疫苗接种与就诊记录", icon: Heart, color: "text-pink-500 bg-pink-50" },
  { href: "/milestones", label: "里程碑", desc: "发育里程碑记录", icon: Star, color: "text-amber-500 bg-amber-50" },
  { href: "/calendar", label: "日历", desc: "按日查看记录与趋势", icon: CalendarDays, color: "text-purple-500 bg-purple-50" },
  { href: "/api/export", label: "导出数据", desc: "导出全部数据为 JSON", icon: Download, color: "text-emerald-500 bg-emerald-50" },
];

export default function MorePage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-6 pb-24">
      <h1 className="text-xl font-bold text-gray-900 mb-4">更多</h1>
      <div className="grid grid-cols-2 gap-3">
        {entries.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="glass-card flex flex-col items-center gap-3 p-5 transition-colors hover:bg-gray-50"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}>
              <item.icon className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-900">{item.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
