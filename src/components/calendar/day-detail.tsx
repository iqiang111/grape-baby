"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Baby, Moon, Droplets } from "lucide-react";
import { getFeedings } from "@/actions/feeding";
import { getSleepRecords } from "@/actions/sleep";
import { getDiapers } from "@/actions/diaper";
import { FEEDING_TYPES, DIAPER_TYPES } from "@/lib/constants";
import { formatTime } from "@/lib/utils";

interface DayDetailProps {
  dateStr: string | null;
}

type FeedingItem = Awaited<ReturnType<typeof getFeedings>>[number];
type SleepItem = Awaited<ReturnType<typeof getSleepRecords>>[number];
type DiaperItem = Awaited<ReturnType<typeof getDiapers>>[number];

export function DayDetail({ dateStr }: DayDetailProps) {
  const [feedings, setFeedings] = useState<FeedingItem[]>([]);
  const [sleeps, setSleeps] = useState<SleepItem[]>([]);
  const [diapers, setDiapers] = useState<DiaperItem[]>([]);
  const [loadedDate, setLoadedDate] = useState<string | null>(null);

  const loading = dateStr !== null && dateStr !== loadedDate;

  useEffect(() => {
    if (!dateStr) return;
    let cancelled = false;
    const date = new Date(dateStr);
    Promise.all([
      getFeedings(date),
      getSleepRecords(date),
      getDiapers(date),
    ]).then(([f, s, d]) => {
      if (cancelled) return;
      setFeedings(f);
      setSleeps(s);
      setDiapers(d);
      setLoadedDate(dateStr);
    });
    return () => { cancelled = true; };
  }, [dateStr]);

  const feedingTotalMl = feedings.reduce((s, f) => s + (f.amount ?? 0), 0);
  const sleepTotalHours = sleeps.reduce((s, r) => {
    if (!r.endTime) return s;
    return s + (new Date(r.endTime).getTime() - new Date(r.startTime).getTime()) / 3600000;
  }, 0);

  // Build timeline
  const events: { time: Date; icon: typeof Baby; color: string; desc: string }[] = [];
  for (const f of feedings) {
    const typeLabel = FEEDING_TYPES[f.type as keyof typeof FEEDING_TYPES] ?? f.type;
    const amt = f.amount ? ` ${f.amount}ml` : "";
    events.push({
      time: new Date(f.time),
      icon: Baby,
      color: "text-rose-500 bg-rose-50",
      desc: `${typeLabel}${amt}`,
    });
  }
  for (const s of sleeps) {
    const dur = s.endTime
      ? `${((new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) / 3600000).toFixed(1)}小时`
      : "进行中";
    events.push({
      time: new Date(s.startTime),
      icon: Moon,
      color: "text-indigo-500 bg-indigo-50",
      desc: `睡眠 ${dur}`,
    });
  }
  for (const d of diapers) {
    const typeLabel = DIAPER_TYPES[d.type as keyof typeof DIAPER_TYPES] ?? d.type;
    events.push({
      time: new Date(d.time),
      icon: Droplets,
      color: "text-cyan-500 bg-cyan-50",
      desc: `换尿布 · ${typeLabel}`,
    });
  }
  events.sort((a, b) => b.time.getTime() - a.time.getTime());

  return (
    <AnimatePresence mode="wait">
      {dateStr && (
        <motion.div
          key={dateStr}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="overflow-hidden"
        >
          <div className="glass-card p-4 space-y-3">
            <h3 className="text-sm font-semibold text-gray-900">
              {new Date(dateStr).toLocaleDateString("zh-CN", {
                month: "long",
                day: "numeric",
                weekday: "long",
                timeZone: "Asia/Shanghai",
              })}
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
              </div>
            ) : events.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">暂无记录</p>
            ) : (
              <>
                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-2">
                  <div className="flex flex-col items-center rounded-lg bg-rose-50 py-2">
                    <span className="text-xs text-rose-600">喂奶</span>
                    <span className="text-sm font-semibold text-rose-700">
                      {feedings.length}次 {feedingTotalMl > 0 && `${feedingTotalMl}ml`}
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-indigo-50 py-2">
                    <span className="text-xs text-indigo-600">睡眠</span>
                    <span className="text-sm font-semibold text-indigo-700">
                      {sleepTotalHours.toFixed(1)}小时
                    </span>
                  </div>
                  <div className="flex flex-col items-center rounded-lg bg-cyan-50 py-2">
                    <span className="text-xs text-cyan-600">尿布</span>
                    <span className="text-sm font-semibold text-cyan-700">
                      {diapers.length}次
                    </span>
                  </div>
                </div>

                {/* Event list */}
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {events.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${ev.color}`}
                      >
                        <ev.icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700 truncate">{ev.desc}</p>
                      </div>
                      <span className="text-xs text-gray-400 shrink-0">
                        {formatTime(ev.time)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
