"use client";

import { useTransition } from "react";
import { deleteGrowthRecord } from "@/actions/growth";
import { formatDateTime } from "@/lib/utils";
import { Trash2, Scale, Ruler, Circle, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface GrowthRecord {
  id: string;
  date: Date;
  weight: number | null;
  height: number | null;
  headCirc: number | null;
  note: string | null;
}

interface GrowthTableProps {
  records: GrowthRecord[];
}

export function GrowthTable({ records }: GrowthTableProps) {
  const [isPending, startTransition] = useTransition();

  // Display in descending order (newest first)
  const sorted = [...records].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteGrowthRecord(id);
    });
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-gray-500" />
        历史记录
      </h3>

      {sorted.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <TrendingUp className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">还没有成长记录</p>
        </div>
      ) : (
        <AnimatePresence initial={false}>
          {sorted.map((record, i) => (
            <motion.div
              key={record.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ delay: i * 0.04 }}
              className="glass-card p-4 flex items-center gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {formatDateTime(record.date)}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                  {record.weight != null && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Scale className="h-3 w-3" />
                      {record.weight} kg
                    </span>
                  )}
                  {record.height != null && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Ruler className="h-3 w-3" />
                      {record.height} cm
                    </span>
                  )}
                  {record.headCirc != null && (
                    <span className="flex items-center gap-1 text-xs text-gray-600">
                      <Circle className="h-3 w-3" />
                      {record.headCirc} cm
                    </span>
                  )}
                </div>
                {record.note && (
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    {record.note}
                  </p>
                )}
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
          ))}
        </AnimatePresence>
      )}
    </div>
  );
}
