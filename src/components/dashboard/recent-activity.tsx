"use client";

import { Baby, Moon, Droplets } from "lucide-react";
import { getRelativeTime } from "@/lib/utils";

export interface ActivityItem {
  id: string;
  type: "feeding" | "sleep" | "diaper";
  description: string;
  time: string;
}

const iconMap = {
  feeding: { icon: Baby, color: "bg-rose-50 text-rose-400" },
  sleep: { icon: Moon, color: "bg-indigo-50 text-indigo-400" },
  diaper: { icon: Droplets, color: "bg-cyan-50 text-cyan-400" },
};

export function RecentActivity({ activities }: { activities: ActivityItem[] }) {
  if (activities.length === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-base font-semibold text-gray-900 mb-4">
          最近动态
        </h3>
        <p className="text-sm text-muted-foreground text-center py-8">
          暂无记录，快去添加第一条吧
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-base font-semibold text-gray-900 mb-4">最近动态</h3>
      <div className="relative">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-gray-200" />
        <div className="space-y-4">
          {activities.map((activity) => {
            const config = iconMap[activity.type];
            const Icon = config.icon;
            return (
              <div
                key={activity.id}
                className="flex items-start gap-3 relative"
              >
                <div
                  className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-sm text-foreground truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {getRelativeTime(activity.time)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
