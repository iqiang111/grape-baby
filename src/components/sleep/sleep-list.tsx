"use client";

import { useTransition } from "react";
import { deleteSleep } from "@/actions/sleep";
import { formatTime, minutesToHoursMinutes } from "@/lib/utils";
import { Moon, Trash2, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SleepRecord {
  id: string;
  startTime: Date;
  endTime: Date | null;
  quality: string | null;
  note: string | null;
}

interface SleepListProps {
  records: SleepRecord[];
}

const qualityEmoji: Record<string, string> = {
  good: "😴",
  normal: "😐",
  poor: "😫",
};

const qualityLabel: Record<string, string> = {
  good: "好",
  normal: "一般",
  poor: "差",
};

function getMinutesBetween(start: Date, end: Date) {
  return Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
}

// Convert a Date to its position in a 24-hour bar (0-100%)
function timeToPercent(date: Date) {
  const d = new Date(date);
  const h = parseInt(d.toLocaleTimeString("en-US", { hour: "numeric", hour12: false, timeZone: "Asia/Shanghai" }), 10);
  const m = parseInt(d.toLocaleTimeString("en-US", { minute: "numeric", timeZone: "Asia/Shanghai" }), 10);
  return ((h * 60 + m) / 1440) * 100;
}

export function SleepList({ records }: SleepListProps) {
  const [isPending, startTransition] = useTransition();
  const completedRecords = records.filter((r) => r.endTime);
  const hours = [0, 3, 6, 9, 12, 15, 18, 21, 24];

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteSleep(id);
    });
  }

  return (
    <div className="space-y-6">
      {/* 24-Hour Timeline */}
      <div className="glass-card p-5">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-4 w-4 text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-700">今日睡眠时间线</h3>
        </div>

        <div className="relative">
          {/* Hour labels */}
          <div className="flex justify-between text-[10px] text-muted-foreground mb-1 px-0">
            {hours.map((h) => (
              <span key={h} className="w-0 text-center">
                {h === 24 ? "" : `${h}时`}
              </span>
            ))}
          </div>

          {/* Timeline bar */}
          <div className="relative h-10 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden">
            {/* Hour grid lines */}
            {hours.slice(1, -1).map((h) => (
              <div
                key={h}
                className="absolute top-0 bottom-0 w-px bg-gray-100"
                style={{ left: `${(h / 24) * 100}%` }}
              />
            ))}

            {/* Sleep blocks */}
            {completedRecords.map((record) => {
              const left = timeToPercent(record.startTime);
              const right = record.endTime ? timeToPercent(record.endTime) : 100;
              const width = Math.max(right - left, 0.5);
              return (
                <motion.div
                  key={record.id}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  className="absolute top-1 bottom-1 rounded-lg bg-indigo-500 opacity-80"
                  style={{
                    left: `${left}%`,
                    width: `${width}%`,
                    transformOrigin: "left",
                  }}
                  title={`${formatTime(record.startTime)} - ${record.endTime ? formatTime(record.endTime) : "进行中"}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Record List */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
          <Moon className="h-4 w-4 text-gray-500" />
          睡眠记录
        </h3>

        {records.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Moon className="h-10 w-10 text-gray-200 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">今天还没有睡眠记录</p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {records.map((record, i) => {
              const duration = record.endTime
                ? getMinutesBetween(record.startTime, record.endTime)
                : null;
              return (
                <motion.div
                  key={record.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-4 flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
                    <Moon className="h-5 w-5 text-indigo-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">
                        {formatTime(record.startTime)}
                        {" - "}
                        {record.endTime ? formatTime(record.endTime) : "进行中..."}
                      </span>
                      {record.quality && (
                        <span className="text-base" title={qualityLabel[record.quality] || ""}>
                          {qualityEmoji[record.quality] || ""}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      {duration !== null ? (
                        <span className="text-xs text-gray-600 font-medium">
                          {minutesToHoursMinutes(duration)}
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500 font-medium">睡眠中</span>
                      )}
                      {record.note && (
                        <span className="text-xs text-muted-foreground truncate">
                          · {record.note}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDelete(record.id)}
                    disabled={isPending}
                    className="shrink-0 flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:text-destructive hover:bg-red-50 transition-colors disabled:opacity-50"
                    aria-label="删除记录"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
