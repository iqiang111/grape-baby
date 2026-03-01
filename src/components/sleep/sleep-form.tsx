"use client";

import { useState, useEffect, useTransition } from "react";
import { useTimer } from "@/hooks/use-timer";
import { addSleep, endSleep } from "@/actions/sleep";
import { cn } from "@/lib/utils";
import { Moon, Clock, Play, Square } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DateTimeWheelPicker } from "@/components/ui/datetime-wheel-picker";

interface SleepFormProps {
  activeSleep?: {
    id: string;
    startTime: Date;
  } | null;
}

const qualityOptions = [
  { value: "good", emoji: "😴", label: "好" },
  { value: "normal", emoji: "😐", label: "一般" },
  { value: "poor", emoji: "😫", label: "差" },
];

export function SleepForm({ activeSleep }: SleepFormProps) {
  const [mode, setMode] = useState<"timer" | "manual">("timer");
  const [quality, setQuality] = useState("good");
  const [note, setNote] = useState("");
  const [manualStart, setManualStart] = useState("");
  const [manualEnd, setManualEnd] = useState("");
  const [isPending, startTransition] = useTransition();
  const timer = useTimer();

  // Resume timer if there's an active sleep
  useEffect(() => {
    if (activeSleep && !timer.isRunning) {
      const startDate = new Date(activeSleep.startTime);
      const elapsedSecs = Math.floor(
        (Date.now() - startDate.getTime()) / 1000
      );
      timer.start();
      // We need to manually set elapsed based on the active sleep start
      // The timer hook starts from 0, so we'll display calculated time instead
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calculate display time for resumed active sleep
  const [resumedElapsed, setResumedElapsed] = useState(0);
  useEffect(() => {
    if (!activeSleep) return;
    const interval = setInterval(() => {
      const elapsed = Math.floor(
        (Date.now() - new Date(activeSleep.startTime).getTime()) / 1000
      );
      setResumedElapsed(elapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [activeSleep]);

  const isActive = timer.isRunning || !!activeSleep;
  const displaySeconds = activeSleep ? resumedElapsed : timer.elapsed;
  const displayH = Math.floor(displaySeconds / 3600);
  const displayM = Math.floor((displaySeconds % 3600) / 60);
  const displayS = displaySeconds % 60;
  const displayTime = displayH > 0
    ? `${displayH}:${String(displayM).padStart(2, "0")}:${String(displayS).padStart(2, "0")}`
    : `${String(displayM).padStart(2, "0")}:${String(displayS).padStart(2, "0")}`;

  // Progress for the circular timer (full circle = 1 hour)
  const progress = Math.min(displaySeconds / 3600, 1);
  const circumference = 2 * Math.PI * 90;
  const strokeOffset = circumference - progress * circumference;

  function handleStartSleep() {
    if (activeSleep) return;
    timer.start();
    startTransition(async () => {
      await addSleep({ startTime: new Date().toISOString() });
    });
  }

  function handleEndSleep() {
    const endTime = new Date().toISOString();
    timer.stop();
    timer.reset();
    startTransition(async () => {
      if (activeSleep) {
        await endSleep(activeSleep.id, endTime);
      }
    });
  }

  function handleManualSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!manualStart || !manualEnd) return;
    startTransition(async () => {
      await addSleep({
        startTime: new Date(manualStart).toISOString(),
        endTime: new Date(manualEnd).toISOString(),
        quality,
        note: note || undefined,
      });
      setManualStart("");
      setManualEnd("");
      setQuality("good");
      setNote("");
    });
  }

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="glass-card p-1 flex gap-1">
        <button
          type="button"
          onClick={() => setMode("timer")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all",
            mode === "timer"
              ? "bg-gray-900 text-white shadow-md"
              : "text-muted-foreground hover:text-gray-900"
          )}
        >
          <Play className="h-4 w-4" />
          计时模式
        </button>
        <button
          type="button"
          onClick={() => setMode("manual")}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium transition-all",
            mode === "manual"
              ? "bg-gray-900 text-white shadow-md"
              : "text-muted-foreground hover:text-gray-900"
          )}
        >
          <Clock className="h-4 w-4" />
          手动记录
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "timer" ? (
          <motion.div
            key="timer"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="glass-card p-6 flex flex-col items-center gap-6"
          >
            {/* Circular Timer */}
            <div className="relative flex items-center justify-center">
              <svg width="200" height="200" className="-rotate-90">
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="6"
                  className="text-gray-200"
                />
                {isActive && (
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="url(#timerGradient)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeOffset}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: strokeOffset }}
                    transition={{ duration: 0.5 }}
                  />
                )}
                <defs>
                  <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#4f46e5" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Moon className={cn("h-6 w-6 mb-2", isActive ? "text-gray-600" : "text-gray-300")} />
                <span className={cn(
                  "text-4xl font-mono font-bold tracking-wider",
                  isActive ? "text-gray-900" : "text-gray-300"
                )}>
                  {displayTime}
                </span>
                {isActive && activeSleep && (
                  <span className="text-xs text-muted-foreground mt-1">
                    开始于 {new Date(activeSleep.startTime).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Shanghai" })}
                  </span>
                )}
              </div>
            </div>

            {/* Start / Stop Buttons */}
            {!isActive ? (
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleStartSleep}
                disabled={isPending}
                className="w-full max-w-xs flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-indigo-600 py-4 text-white text-lg font-semibold shadow-lg  active:shadow-md transition-shadow disabled:opacity-50"
              >
                <Play className="h-5 w-5 fill-current" />
                开始睡眠
              </motion.button>
            ) : (
              <motion.button
                type="button"
                whileTap={{ scale: 0.95 }}
                onClick={handleEndSleep}
                disabled={isPending}
                className="w-full max-w-xs flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-gray-500 to-gray-600 py-4 text-white text-lg font-semibold shadow-lg  active:shadow-md transition-shadow disabled:opacity-50"
              >
                <Square className="h-5 w-5 fill-current" />
                结束睡眠
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.form
            key="manual"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            onSubmit={handleManualSubmit}
            className="glass-card p-6 space-y-5"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <DateTimeWheelPicker label="入睡时间" value={manualStart} onChange={setManualStart} />
              <DateTimeWheelPicker label="醒来时间" value={manualEnd} onChange={setManualEnd} />
            </div>

            {/* Quality Selector */}
            <div>
              <span className="text-sm font-medium text-gray-900 mb-2 block">睡眠质量</span>
              <div className="flex gap-3">
                {qualityOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setQuality(opt.value)}
                    className={cn(
                      "flex-1 flex flex-col items-center gap-1 rounded-xl py-3 border-2 transition-all",
                      quality === opt.value
                        ? "border-gray-400 bg-gray-50 shadow-sm"
                        : "border-transparent bg-white/60 hover:bg-gray-50/50"
                    )}
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span className="text-xs text-muted-foreground">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Note */}
            <label className="block">
              <span className="text-sm font-medium text-gray-900 mb-1.5 block">备注</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="可选备注..."
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent transition-shadow"
              />
            </label>

            <motion.button
              type="submit"
              whileTap={{ scale: 0.97 }}
              disabled={isPending || !manualStart || !manualEnd}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-gray-900 to-black py-4 text-white font-semibold shadow-lg  disabled:opacity-50 transition-shadow"
            >
              <Moon className="h-5 w-5" />
              保存记录
            </motion.button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
