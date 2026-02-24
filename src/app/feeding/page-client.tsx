"use client";

import { useState } from "react";
import { getRelativeTime } from "@/lib/utils";
import { Baby, Droplets, Clock, Plus } from "lucide-react";
import { FeedingList } from "@/components/feeding/feeding-list";
import { FeedingForm } from "@/components/feeding/feeding-form";

interface Feeding {
  id: string;
  time: Date | string;
  type: string;
  amount: number | null;
  duration: number | null;
  note: string | null;
}

interface FeedingPageClientProps {
  feedings: Feeding[];
  totalCount: number;
  totalMl: number;
  lastFeeding: Feeding | null;
  lastFeedingLabel: string | null;
}

export function FeedingPageClient({
  feedings,
  totalCount,
  totalMl,
  lastFeeding,
  lastFeedingLabel,
}: FeedingPageClientProps) {
  const [formOpen, setFormOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Baby className="h-7 w-7 text-rose-400" />
          喂奶记录
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          记录每一次喂奶，关注宝宝的饮食规律
        </p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card flex flex-col items-center px-3 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-400">
            <Baby className="h-5 w-5" />
          </div>
          <span className="mt-2 text-xl font-bold text-gray-900">
            {totalCount}
          </span>
          <span className="text-xs text-muted-foreground">今日次数</span>
        </div>

        <div className="glass-card flex flex-col items-center px-3 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-400">
            <Droplets className="h-5 w-5" />
          </div>
          <span className="mt-2 text-xl font-bold text-gray-900">
            {totalMl > 0 ? `${totalMl}` : "-"}
          </span>
          <span className="text-xs text-muted-foreground">
            {totalMl > 0 ? "总奶量 ml" : "总奶量"}
          </span>
        </div>

        <div className="glass-card flex flex-col items-center px-3 py-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-rose-50 text-rose-400">
            <Clock className="h-5 w-5" />
          </div>
          <span className="mt-2 text-sm font-bold text-gray-900 text-center leading-tight">
            {lastFeeding ? getRelativeTime(lastFeeding.time) : "-"}
          </span>
          <span className="mt-0.5 text-xs text-muted-foreground truncate max-w-full">
            {lastFeedingLabel || "上次喂奶"}
          </span>
        </div>
      </div>

      {/* Feeding list */}
      <FeedingList feedings={feedings} />

      {/* Floating add button */}
      <button
        type="button"
        onClick={() => setFormOpen(true)}
        className="fixed bottom-24 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-white shadow-lg shadow-gray-400/40 transition-transform hover:scale-105 hover:bg-black active:scale-95 md:bottom-8 md:right-8"
      >
        <Plus className="h-7 w-7" />
      </button>

      {/* Feeding form sheet */}
      <FeedingForm open={formOpen} onClose={() => setFormOpen(false)} />
    </div>
  );
}
