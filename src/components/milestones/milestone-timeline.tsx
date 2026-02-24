"use client";

import { useState } from "react";
import { MILESTONE_CATEGORIES } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { Star, Filter, Camera, Trash2, Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { deleteMilestone } from "@/actions/milestones";
import { useTransition } from "react";

interface Milestone {
  id: string;
  date: Date;
  title: string;
  category: string;
  description: string | null;
  photo: string | null;
}

interface MilestoneTimelineProps {
  milestones: Milestone[];
}

const CATEGORY_COLORS: Record<string, {
  dot: string;
  badge: string;
  badgeText: string;
  line: string;
  icon: string;
}> = {
  motor: {
    dot: "bg-orange-400",
    badge: "bg-orange-50 border-orange-200",
    badgeText: "text-orange-600",
    line: "from-orange-200 to-orange-100",
    icon: "text-orange-400",
  },
  language: {
    dot: "bg-blue-400",
    badge: "bg-blue-50 border-blue-200",
    badgeText: "text-blue-600",
    line: "from-blue-200 to-blue-100",
    icon: "text-blue-400",
  },
  social: {
    dot: "bg-pink-400",
    badge: "bg-pink-50 border-pink-200",
    badgeText: "text-pink-600",
    line: "from-pink-200 to-pink-100",
    icon: "text-pink-400",
  },
  cognitive: {
    dot: "bg-violet-400",
    badge: "bg-violet-50 border-violet-200",
    badgeText: "text-violet-600",
    line: "from-violet-200 to-violet-100",
    icon: "text-violet-400",
  },
};

const DEFAULT_COLOR = CATEGORY_COLORS.language;

function getCategoryColor(cat: string) {
  return CATEGORY_COLORS[cat] || DEFAULT_COLOR;
}

export function MilestoneTimeline({ milestones }: MilestoneTimelineProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [detail, setDetail] = useState<Milestone | null>(null);

  const filtered = filter
    ? milestones.filter((m) => m.category === filter)
    : milestones;

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteMilestone(id);
      if (detail?.id === id) setDetail(null);
    });
  }

  return (
    <div className="space-y-5">
      {/* Category filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <Filter className="h-4 w-4 shrink-0 text-gray-400" />
        <button
          type="button"
          onClick={() => setFilter(null)}
          className={cn(
            "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
            !filter
              ? "border-gray-400 bg-gray-900 text-white"
              : "border-gray-200 bg-white text-muted-foreground hover:border-gray-300"
          )}
        >
          全部
        </button>
        {(Object.entries(MILESTONE_CATEGORIES) as [string, string][]).map(
          ([key, label]) => {
            const colors = getCategoryColor(key);
            const active = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(active ? null : key)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                  active
                    ? `${colors.dot} text-white border-transparent`
                    : `${colors.badge} ${colors.badgeText} hover:opacity-80`
                )}
              >
                {label}
              </button>
            );
          }
        )}
      </div>

      {/* Timeline */}
      {filtered.length === 0 ? (
        <div className="glass-card p-10 text-center">
          <Star className="h-10 w-10 text-gray-200 mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">
            {filter ? "该类别暂无里程碑记录" : "还没有里程碑记录"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            点击下方按钮记录宝宝的第一个里程碑
          </p>
        </div>
      ) : (
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-[13px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-gray-200 via-gray-100 to-transparent" />

          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((milestone, i) => {
              const colors = getCategoryColor(milestone.category);
              const catLabel =
                MILESTONE_CATEGORIES[milestone.category as keyof typeof MILESTONE_CATEGORIES] ||
                milestone.category;

              return (
                <motion.div
                  key={milestone.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20, scale: 0.95 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                  className="relative mb-6 last:mb-0"
                >
                  {/* Dot on timeline */}
                  <div
                    className={cn(
                      "absolute -left-8 top-3 h-[14px] w-[14px] rounded-full border-[3px] border-white shadow-sm",
                      colors.dot
                    )}
                  />

                  {/* Card */}
                  <div
                    className="glass-card p-4 transition-all hover:shadow-md cursor-pointer"
                    onClick={() => setDetail(milestone)}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Date + category badge */}
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(milestone.date)}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                              colors.badge,
                              colors.badgeText
                            )}
                          >
                            <Sparkles className="h-2.5 w-2.5" />
                            {catLabel}
                          </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-sm font-semibold text-foreground leading-snug">
                          {milestone.title}
                        </h3>

                        {/* Description */}
                        {milestone.description && (
                          <p className="mt-1 text-xs text-muted-foreground leading-relaxed line-clamp-3">
                            {milestone.description}
                          </p>
                        )}

                        {/* Photo thumbnail */}
                        {milestone.photo && (
                          <div className="mt-2">
                            <img
                              src={milestone.photo}
                              alt={milestone.title}
                              className="h-20 w-20 rounded-lg object-cover border border-gray-100"
                            />
                          </div>
                        )}
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        onClick={(e) => { e.stopPropagation(); handleDelete(milestone.id); }}
                        disabled={isPending}
                        className="shrink-0 flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-destructive hover:bg-red-50 transition-colors disabled:opacity-50"
                        aria-label="删除里程碑"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      {/* Detail modal */}
      <AnimatePresence>
        {detail && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              onClick={() => setDetail(null)}
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-[60] max-h-[85vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl pb-safe"
            >
              <div className="flex justify-center pt-3 pb-1">
                <div className="h-1.5 w-12 rounded-full bg-gray-200" />
              </div>

              <div className="px-6 pb-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(detail.date)}
                    </span>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium",
                        getCategoryColor(detail.category).badge,
                        getCategoryColor(detail.category).badgeText
                      )}
                    >
                      <Sparkles className="h-2.5 w-2.5" />
                      {MILESTONE_CATEGORIES[detail.category as keyof typeof MILESTONE_CATEGORIES] || detail.category}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDetail(null)}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-50 text-gray-500 transition-colors hover:bg-gray-100"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-gray-900 mb-3">
                  {detail.title}
                </h2>

                {/* Photo */}
                {detail.photo && (
                  <div className="mb-4">
                    <img
                      src={detail.photo}
                      alt={detail.title}
                      className="w-full max-h-80 rounded-2xl object-cover border border-gray-100"
                    />
                  </div>
                )}

                {/* Description */}
                {detail.description && (
                  <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {detail.description}
                  </p>
                )}

                {/* Delete */}
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleDelete(detail.id); }}
                  disabled={isPending}
                  className="mt-6 w-full rounded-2xl border border-red-200 py-3 text-sm font-medium text-destructive transition-colors hover:bg-red-50 disabled:opacity-50"
                >
                  {isPending ? "删除中..." : "删除此里程碑"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
