"use client";

import { useState, useTransition, useEffect } from "react";
import { addFeeding } from "@/actions/feeding";
import { FEEDING_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { X, Clock, FlaskConical, Wheat } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTimeWheelPicker } from "@/components/ui/datetime-wheel-picker";

const TYPE_ICONS: Record<string, typeof FlaskConical> = {
  formula: FlaskConical,
  rice_cereal: Wheat,
};

const QUICK_AMOUNTS = [30, 60, 90, 120, 150, 180];

function toLocalDatetimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

interface FeedingFormProps {
  open: boolean;
  onClose: () => void;
}

export function FeedingForm({ open, onClose }: FeedingFormProps) {
  const [isPending, startTransition] = useTransition();
  const [type, setType] = useState<string>("formula");
  const [time, setTime] = useState(() => toLocalDatetimeValue(new Date()));
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  // Reset form when opened
  useEffect(() => {
    if (open) {
      setType("formula");
      setTime(toLocalDatetimeValue(new Date()));
      setAmount("");
      setNote("");
    }
  }, [open]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!type) return;

    startTransition(async () => {
      await addFeeding({
        time,
        type,
        amount: amount ? Number(amount) : undefined,
        note: note.trim() || undefined,
      });
      onClose();
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/30"
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-x-0 bottom-0 z-[60] max-h-[90vh] overflow-y-auto rounded-t-3xl bg-white shadow-2xl pb-safe"
          >
            {/* Handle bar */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-gray-300" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-6 pb-4">
              <h2 className="text-lg font-bold text-gray-900">添加喂奶记录</h2>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 px-6 pb-8">
              {/* Time */}
              <DateTimeWheelPicker label="时间" value={time} onChange={setTime} />

              {/* Type selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  喂养方式
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {(Object.entries(FEEDING_TYPES) as [string, string][]).map(
                    ([key, label]) => {
                      const Icon = TYPE_ICONS[key] || FlaskConical;
                      const selected = type === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setType(key)}
                          className={cn(
                            "flex items-center gap-3 rounded-xl border-2 px-4 py-4 text-left text-sm font-medium transition-all active:scale-[0.97]",
                            selected
                              ? "border-gray-900 bg-gray-50 text-gray-900 shadow-sm"
                              : "border-gray-200 bg-white text-muted-foreground hover:border-gray-300"
                          )}
                        >
                          <div
                            className={cn(
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                              selected
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-400"
                            )}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          {label}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Amount with quick select */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  奶量 (ml)
                </label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {QUICK_AMOUNTS.map((ml) => (
                    <button
                      key={ml}
                      type="button"
                      onClick={() => setAmount(String(ml))}
                      className={cn(
                        "rounded-lg px-4 py-2 text-sm font-medium transition-all active:scale-[0.95]",
                        amount === String(ml)
                          ? "bg-gray-900 text-white shadow-sm"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {ml}ml
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={500}
                  step={5}
                  placeholder="自定义奶量"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-base text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                />
              </div>

              {/* Note */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
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
                disabled={!type || isPending}
                className={cn(
                  "w-full rounded-xl py-4 text-base font-semibold transition-all active:scale-[0.98]",
                  type
                    ? "bg-gray-900 text-white hover:bg-black"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
              >
                {isPending ? "保存中..." : "保存记录"}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
