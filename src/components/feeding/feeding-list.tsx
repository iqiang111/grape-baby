"use client";

import { useState, useTransition } from "react";
import { deleteFeeding } from "@/actions/feeding";
import { FEEDING_TYPES } from "@/lib/constants";
import { cn, formatTime } from "@/lib/utils";
import { FlaskConical, Wheat, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Feeding {
  id: string;
  time: Date | string;
  type: string;
  amount: number | null;
  duration: number | null;
  note: string | null;
}

interface FeedingListProps {
  feedings: Feeding[];
}

const TYPE_ICONS: Record<string, typeof FlaskConical> = {
  formula: FlaskConical,
  rice_cereal: Wheat,
};

const TYPE_COLORS: Record<string, string> = {
  formula: "bg-rose-50 text-rose-600",
  rice_cereal: "bg-amber-50 text-amber-600",
};

function getTimePeriod(date: Date | string): string {
  const h = new Date(date).getHours();
  if (h >= 6 && h < 12) return "上午";
  if (h >= 12 && h < 18) return "下午";
  if (h >= 18 && h < 22) return "晚上";
  return "夜间";
}

const PERIOD_ORDER = ["夜间", "晚上", "下午", "上午"];

function groupByPeriod(feedings: Feeding[]) {
  const groups: Record<string, Feeding[]> = {};
  for (const f of feedings) {
    const period = getTimePeriod(f.time);
    if (!groups[period]) groups[period] = [];
    groups[period].push(f);
  }
  return PERIOD_ORDER
    .filter((p) => groups[p])
    .map((p) => ({ period: p, items: groups[p] }));
}

export function FeedingList({ feedings }: FeedingListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteFeeding(id);
      setDeleteId(null);
    });
  }

  if (feedings.length === 0) {
    return (
      <div className="glass-card flex flex-col items-center justify-center px-6 py-12 text-center">
        <FlaskConical className="mb-3 h-12 w-12 text-gray-200" />
        <p className="text-sm text-muted-foreground">今天还没有喂奶记录</p>
        <p className="mt-1 text-xs text-muted-foreground">
          点击下方 + 按钮添加记录
        </p>
      </div>
    );
  }

  const groups = groupByPeriod(feedings);

  return (
    <>
      <div className="space-y-6">
        {groups.map(({ period, items }) => (
          <div key={period}>
            <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <span className="h-px flex-1 bg-gray-200" />
              {period}
              <span className="h-px flex-1 bg-gray-200" />
            </h3>
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {items.map((feeding) => {
                  const Icon = TYPE_ICONS[feeding.type] || FlaskConical;
                  const colorClass =
                    TYPE_COLORS[feeding.type] || "bg-gray-100 text-gray-600";
                  const label =
                    FEEDING_TYPES[
                      feeding.type as keyof typeof FEEDING_TYPES
                    ] || feeding.type;

                  return (
                    <motion.div
                      key={feeding.id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -80 }}
                      transition={{ duration: 0.2 }}
                      className="glass-card flex items-center gap-4 px-4 py-3"
                    >
                      {/* Icon */}
                      <div
                        className={cn(
                          "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                          colorClass
                        )}
                      >
                        <Icon className="h-5 w-5" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {label}
                          </span>
                          {feeding.amount && (
                            <span className="text-xs text-gray-600 font-medium">
                              {feeding.amount}ml
                            </span>
                          )}
                          {feeding.duration && (
                            <span className="text-xs text-gray-500 font-medium">
                              {feeding.duration}分钟
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {formatTime(feeding.time)}
                          </span>
                          {feeding.note && (
                            <span className="truncate text-xs text-muted-foreground">
                              · {feeding.note}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={() => setDeleteId(feeding.id)}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-300 transition-colors hover:bg-red-50 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteId && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/30"
              onClick={() => setDeleteId(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 mx-auto max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
            >
              <h3 className="text-base font-bold text-foreground">
                确认删除
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                确定要删除这条喂奶记录吗？此操作无法撤销。
              </p>
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteId(null)}
                  className="flex-1 rounded-xl border border-gray-200 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-gray-50"
                >
                  取消
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => deleteId && handleDelete(deleteId)}
                  className="flex-1 rounded-xl bg-destructive py-3 text-sm font-medium text-white transition-colors hover:bg-red-600"
                >
                  {isPending ? "删除中..." : "删除"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
