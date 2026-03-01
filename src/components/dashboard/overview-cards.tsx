"use client";

import { Baby, Droplets, Moon, Clock } from "lucide-react";

const BIRTH_DATE = new Date("2026-01-06");

interface OverviewStats {
  feedingCount: number;
  feedingTotalMl: number;
  sleepTotalHours: number;
  diaperCount: number;
  lastFeedingTime: string | null;
}

function getBabyAgeDays() {
  const now = new Date();
  const diff = now.getTime() - BIRTH_DATE.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getRelativeTime(dateStr: string | null) {
  if (!dateStr) return "暂无记录";
  const now = new Date();
  const d = new Date(dateStr);
  const diff = now.getTime() - d.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes}分钟前`;
  if (hours < 24) return `${hours}小时前`;
  return d.toLocaleDateString("zh-CN", { month: "long", day: "numeric", timeZone: "Asia/Shanghai" });
}

export function OverviewCards({ stats }: { stats: OverviewStats }) {
  const ageDays = getBabyAgeDays();
  const ageWeeks = Math.floor(ageDays / 7);
  const remainDays = ageDays % 7;

  const cards = [
    {
      title: "宝宝年龄",
      value: `小葡萄 ${ageDays}天`,
      sub: `${ageWeeks}周${remainDays > 0 ? `${remainDays}天` : ""}`,
      icon: <span className="text-2xl">🍇</span>,
    },
    {
      title: "今日喂奶",
      value: `${stats.feedingCount}次`,
      sub: `共 ${stats.feedingTotalMl}ml`,
      icon: <Baby className="h-5 w-5 text-rose-400" />,
    },
    {
      title: "今日睡眠",
      value: `${stats.sleepTotalHours.toFixed(1)}小时`,
      sub: "总睡眠时长",
      icon: <Moon className="h-5 w-5 text-indigo-400" />,
    },
    {
      title: "今日换尿布",
      value: `${stats.diaperCount}次`,
      sub: "换尿布次数",
      icon: <Droplets className="h-5 w-5 text-cyan-400" />,
    },
    {
      title: "上次喂奶",
      value: getRelativeTime(stats.lastFeedingTime),
      sub: stats.lastFeedingTime
        ? new Date(stats.lastFeedingTime).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Asia/Shanghai",
          })
        : "--:--",
      icon: <Clock className="h-5 w-5 text-rose-300" />,
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {cards.map((card, i) => (
        <div
          key={card.title}
          className={`glass-card p-4 ${
            i === 0 ? "col-span-2 md:col-span-1" : ""
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-medium">
              {card.title}
            </span>
            {card.icon}
          </div>
          <p className="text-lg font-bold text-foreground">{card.value}</p>
          <p className="text-xs text-muted-foreground mt-1">{card.sub}</p>
        </div>
      ))}
    </div>
  );
}
