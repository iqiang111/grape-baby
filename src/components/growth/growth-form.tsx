"use client";

import { useState, useTransition } from "react";
import { addGrowthRecord } from "@/actions/growth";
import { cn } from "@/lib/utils";
import { Plus, Calendar, Scale, Ruler, Circle, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTimeWheelPicker } from "@/components/ui/datetime-wheel-picker";

function toLocalDatetimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

export function GrowthForm() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(() => toLocalDatetimeValue(new Date()));
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [headCirc, setHeadCirc] = useState("");
  const [note, setNote] = useState("");

  function resetForm() {
    setDate(toLocalDatetimeValue(new Date()));
    setWeight("");
    setHeight("");
    setHeadCirc("");
    setNote("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!weight && !height && !headCirc) return;

    startTransition(async () => {
      await addGrowthRecord({
        date,
        weight: weight ? Number(weight) : undefined,
        height: height ? Number(height) : undefined,
        headCirc: headCirc ? Number(headCirc) : undefined,
        note: note.trim() || undefined,
      });
      resetForm();
      setOpen(false);
    });
  }

  return (
    <div className="glass-card overflow-hidden">
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => {
          if (!open) resetForm();
          setOpen(!open);
        }}
        className="flex w-full items-center justify-between p-4"
      >
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-700">
          <Plus className={cn("h-4 w-4 transition-transform", open && "rotate-45")} />
          添加记录
        </span>
        <motion.div
          animate={{ rotate: open ? 180 : 0 }}
          className="h-5 w-5 text-gray-400"
        >
          <svg viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </motion.div>
      </button>

      {/* Collapsible Form */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <form onSubmit={handleSubmit} className="space-y-4 px-4 pb-5 pt-1">
              {/* Date */}
              <DateTimeWheelPicker label="日期时间" value={date} onChange={setDate} />

              {/* Measurements Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Scale className="h-4 w-4" />
                    体重 (kg)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={30}
                    step={0.01}
                    placeholder="例如 5.20"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Ruler className="h-4 w-4" />
                    身长 (cm)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={120}
                    step={0.1}
                    placeholder="例如 62.5"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Circle className="h-4 w-4" />
                    头围 (cm)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    min={0}
                    max={60}
                    step={0.1}
                    placeholder="例如 40.2"
                    value={headCirc}
                    onChange={(e) => setHeadCirc(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                  />
                </div>
              </div>

              {/* Note */}
              <div>
                <label className="mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <FileText className="h-4 w-4" />
                  备注 (可选)
                </label>
                <textarea
                  rows={2}
                  placeholder="添加备注..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={(!weight && !height && !headCirc) || isPending}
                className={cn(
                  "w-full rounded-2xl py-3.5 text-base font-semibold transition-all active:scale-[0.98]",
                  weight || height || headCirc
                    ? "bg-gray-900 text-white shadow-lg shadow-lg hover:shadow-xl"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
              >
                {isPending ? "保存中..." : "保存记录"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
