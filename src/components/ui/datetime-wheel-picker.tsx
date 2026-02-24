"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface DateTimeWheelPickerProps {
  value: string; // "YYYY-MM-DDTHH:mm" format
  onChange: (value: string) => void;
  label?: string;
  className?: string;
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function toLocalDatetimeValue(date: Date) {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function parseValue(val: string) {
  const d = new Date(val);
  if (isNaN(d.getTime())) {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth(), day: now.getDate(), hour: now.getHours(), minute: now.getMinutes() };
  }
  return { year: d.getFullYear(), month: d.getMonth(), day: d.getDate(), hour: d.getHours(), minute: d.getMinutes() };
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 5;
const WHEEL_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;

function WheelColumn({ items, selected, onSelect, width }: {
  items: string[];
  selected: number;
  onSelect: (index: number) => void;
  width: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);

  const scrollToIndex = useCallback((index: number, smooth = false) => {
    const el = containerRef.current;
    if (!el) return;
    const top = index * ITEM_HEIGHT;
    el.scrollTo({ top, behavior: smooth ? "smooth" : "auto" });
  }, []);

  useEffect(() => {
    scrollToIndex(selected, false);
  }, [selected, scrollToIndex]);

  function handleScroll() {
    if (timerRef.current) clearTimeout(timerRef.current);
    isScrollingRef.current = true;
    timerRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      const el = containerRef.current;
      if (!el) return;
      const index = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(items.length - 1, index));
      scrollToIndex(clamped, true);
      if (clamped !== selected) onSelect(clamped);
    }, 80);
  }

  const paddingItems = Math.floor(VISIBLE_COUNT / 2);

  return (
    <div className="relative" style={{ width, height: WHEEL_HEIGHT }}>
      {/* Selection highlight */}
      <div
        className="pointer-events-none absolute inset-x-0 z-10 rounded-lg bg-gray-100 border-y border-gray-300"
        style={{ top: paddingItems * ITEM_HEIGHT, height: ITEM_HEIGHT }}
      />
      {/* Scroll container with CSS mask for fade effect */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="relative z-20 h-full overflow-y-auto scrollbar-none snap-y snap-mandatory"
        style={{
          scrollSnapType: "y mandatory",
          maskImage: `linear-gradient(to bottom, transparent 0%, black ${paddingItems * ITEM_HEIGHT}px, black ${(paddingItems + 1) * ITEM_HEIGHT}px, transparent 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0%, black ${paddingItems * ITEM_HEIGHT}px, black ${(paddingItems + 1) * ITEM_HEIGHT}px, transparent 100%)`,
        }}
      >
        {/* Top padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <div key={`top-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
        {items.map((item, i) => (
          <div
            key={i}
            className={cn(
              "flex items-center justify-center transition-colors snap-center",
              i === selected ? "text-gray-900 text-base font-bold" : "text-gray-300 text-sm font-medium"
            )}
            style={{ height: ITEM_HEIGHT }}
            onClick={() => { onSelect(i); scrollToIndex(i, true); }}
          >
            {item}
          </div>
        ))}
        {/* Bottom padding */}
        {Array.from({ length: paddingItems }).map((_, i) => (
          <div key={`bot-${i}`} style={{ height: ITEM_HEIGHT }} />
        ))}
      </div>
    </div>
  );
}

export function DateTimeWheelPicker({ value, onChange, label, className }: DateTimeWheelPickerProps) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);
  const [year, setYear] = useState(parsed.year);
  const [month, setMonth] = useState(parsed.month);
  const [day, setDay] = useState(parsed.day);
  const [hour, setHour] = useState(parsed.hour);
  const [minute, setMinute] = useState(parsed.minute);

  useEffect(() => {
    const p = parseValue(value);
    setYear(p.year); setMonth(p.month); setDay(p.day); setHour(p.hour); setMinute(p.minute);
  }, [value]);

  const maxDay = getDaysInMonth(year, month);
  const safeDay = Math.min(day, maxDay);

  function handleConfirm() {
    const result = `${year}-${pad(month + 1)}-${pad(safeDay)}T${pad(hour)}:${pad(minute)}`;
    onChange(result);
    setOpen(false);
  }

  const displayText = value
    ? `${year}年${month + 1}月${safeDay}日 ${pad(hour)}:${pad(minute)}`
    : "选择时间";

  const now = new Date();
  const years = Array.from({ length: 3 }, (_, i) => now.getFullYear() - 1 + i);
  const months = Array.from({ length: 12 }, (_, i) => i);
  const days = Array.from({ length: maxDay }, (_, i) => i + 1);
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className={className}>
      {label && (
        <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
          <Clock className="h-4 w-4" />
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-base text-foreground outline-none transition-colors hover:border-gray-300 focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
      >
        {displayText}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="fixed inset-x-0 bottom-0 z-[60] rounded-t-3xl bg-white shadow-2xl pb-safe">
            <div className="flex justify-center pt-3 pb-1">
              <div className="h-1.5 w-12 rounded-full bg-gray-200" />
            </div>
            <div className="flex items-center justify-between px-6 pb-3">
              <button type="button" onClick={() => setOpen(false)} className="text-sm text-muted-foreground">取消</button>
              <span className="text-base font-semibold text-gray-900">
                {month + 1}月{safeDay}日 {pad(hour)}:{pad(minute)}
              </span>
              <button type="button" onClick={handleConfirm} className="text-sm font-semibold text-gray-600">确定</button>
            </div>

            <div className="flex items-center justify-center gap-0 px-4 pb-6" style={{ height: 220 }}>
              <WheelColumn items={months.map(m => `${m + 1}月`)} selected={month} onSelect={setMonth} width={60} />
              <WheelColumn items={days.map(d => `${d}日`)} selected={safeDay - 1} onSelect={(i) => setDay(i + 1)} width={55} />
              <div className="w-3" />
              <WheelColumn items={hours.map(h => pad(h))} selected={hour} onSelect={setHour} width={45} />
              <span className="text-lg font-bold text-gray-400 mx-0.5">:</span>
              <WheelColumn items={minutes.map(m => pad(m))} selected={minute} onSelect={setMinute} width={45} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
