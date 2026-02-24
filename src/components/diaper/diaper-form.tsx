"use client";

import { useState, useTransition, useCallback } from "react";
import { addDiaper } from "@/actions/diaper";
import { DIAPER_TYPES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Droplets, Circle, Check, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const BUTTON_CONFIG = {
  wet: {
    label: DIAPER_TYPES.wet,
    icon: Droplets,
    bg: "bg-cyan-50",
    border: "border-cyan-200",
    text: "text-cyan-700",
    activeBg: "bg-cyan-100",
    ring: "ring-cyan-400",
    iconColor: "text-cyan-500",
    successBg: "bg-cyan-500",
  },
  dirty: {
    label: DIAPER_TYPES.dirty,
    icon: Circle,
    bg: "bg-amber-50",
    border: "border-amber-200",
    text: "text-amber-700",
    activeBg: "bg-amber-100",
    ring: "ring-amber-400",
    iconColor: "text-amber-500",
    successBg: "bg-amber-500",
  },
  both: {
    label: DIAPER_TYPES.both,
    icon: Droplets,
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    text: "text-emerald-700",
    activeBg: "bg-emerald-100",
    ring: "ring-emerald-400",
    iconColor: "text-emerald-500",
    successBg: "bg-emerald-500",
  },
} as const;

const STOOL_COLORS = [
  { value: "yellow", label: "黄色", color: "bg-yellow-400" },
  { value: "green", label: "绿色", color: "bg-green-500" },
  { value: "brown", label: "棕色", color: "bg-amber-700" },
  { value: "black", label: "黑色", color: "bg-gray-800" },
];

export function DiaperForm() {
  const [isPending, startTransition] = useTransition();
  const [successType, setSuccessType] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [stoolColor, setStoolColor] = useState("");
  const [note, setNote] = useState("");

  const handleQuickRecord = useCallback(
    (type: string) => {
      if (isPending) return;

      startTransition(async () => {
        await addDiaper({
          time: new Date().toISOString(),
          type,
          color: stoolColor || undefined,
          note: note || undefined,
        });

        setSuccessType(type);
        setStoolColor("");
        setNote("");
        setExpanded(false);

        setTimeout(() => setSuccessType(null), 1500);
      });
    },
    [isPending, stoolColor, note, startTransition]
  );

  return (
    <div className="space-y-4">
      {/* Quick record buttons */}
      <div className="grid grid-cols-3 gap-3">
        {(Object.keys(BUTTON_CONFIG) as Array<keyof typeof BUTTON_CONFIG>).map(
          (type) => {
            const config = BUTTON_CONFIG[type];
            const Icon = config.icon;
            const isSuccess = successType === type;

            return (
              <motion.button
                key={type}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.02 }}
                disabled={isPending}
                onClick={() => handleQuickRecord(type)}
                className={cn(
                  "relative flex flex-col items-center justify-center gap-2",
                  "rounded-2xl border-2 p-6 transition-all",
                  "min-h-[120px] touch-manipulation select-none",
                  "focus:outline-none focus:ring-2 focus:ring-offset-2",
                  config.bg,
                  config.border,
                  config.text,
                  config.ring,
                  isPending && "opacity-60 cursor-not-allowed",
                  isSuccess && config.successBg
                )}
              >
                <AnimatePresence mode="wait">
                  {isSuccess ? (
                    <motion.div
                      key="success"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex flex-col items-center gap-1"
                    >
                      <Check className="h-8 w-8 text-white" strokeWidth={3} />
                      <span className="text-sm font-semibold text-white">
                        已记录
                      </span>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="default"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="flex flex-col items-center gap-2"
                    >
                      <Icon className={cn("h-8 w-8", config.iconColor)} />
                      <span className="text-base font-semibold">
                        {config.label}
                      </span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          }
        )}
      </div>

      {/* Expandable details */}
      <div className="glass-card overflow-hidden">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center justify-between px-4 py-3 text-sm text-muted-foreground hover:text-gray-600 transition-colors"
        >
          <span>补充详情（可选）</span>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown className="h-4 w-4" />
          </motion.div>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-4 px-4 pb-4">
                {/* Stool color picker */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    便便颜色
                  </label>
                  <div className="flex gap-3">
                    {STOOL_COLORS.map((sc) => (
                      <button
                        key={sc.value}
                        type="button"
                        onClick={() =>
                          setStoolColor(
                            stoolColor === sc.value ? "" : sc.value
                          )
                        }
                        className={cn(
                          "flex flex-col items-center gap-1.5 rounded-xl px-3 py-2 transition-all",
                          stoolColor === sc.value
                            ? "bg-gray-100 ring-2 ring-gray-400"
                            : "hover:bg-gray-50"
                        )}
                      >
                        <div
                          className={cn(
                            "h-7 w-7 rounded-full border-2 border-white shadow-sm",
                            sc.color
                          )}
                        />
                        <span className="text-xs text-muted-foreground">
                          {sc.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Note */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    备注
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="记录一些细节..."
                    rows={2}
                    className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-muted-foreground focus:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
