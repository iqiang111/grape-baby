"use client";

import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Syringe, Check, Clock, Plus } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { addVaccination, updateVaccination } from "@/actions/health";
import type { VaccineScheduleItem } from "@/data/vaccination-schedule";

const BABY_BIRTHDAY = new Date("2026-01-06");

interface Vaccination {
  id: string;
  name: string;
  doseNumber: number;
  scheduledDate: Date | string;
  actualDate: Date | string | null;
  hospital: string | null;
  batchNumber: string | null;
  note: string | null;
}

interface VaccinationTimelineProps {
  vaccinations: Vaccination[];
  schedule: VaccineScheduleItem[];
}

function toLocalDateValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 10);
}

function getBabyAgeMonths(): number {
  const now = new Date();
  const months =
    (now.getFullYear() - BABY_BIRTHDAY.getFullYear()) * 12 +
    (now.getMonth() - BABY_BIRTHDAY.getMonth());
  const dayDiff = now.getDate() - BABY_BIRTHDAY.getDate();
  return dayDiff >= 0 ? months : months - 1;
}

type VaccineStatus = "completed" | "due" | "upcoming";

function getScheduledDate(item: VaccineScheduleItem): Date {
  const d = new Date(BABY_BIRTHDAY);
  d.setMonth(d.getMonth() + item.ageMonths);
  return d;
}

/* ── Completion form ── */

function CompletionForm({
  item,
  vaccination,
  onClose,
}: {
  item: VaccineScheduleItem;
  vaccination?: Vaccination;
  onClose: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [actualDate, setActualDate] = useState(toLocalDateValue(new Date()));
  const [hospital, setHospital] = useState("");
  const [batchNumber, setBatchNumber] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      if (vaccination) {
        await updateVaccination(vaccination.id, {
          actualDate,
          hospital: hospital.trim() || undefined,
          batchNumber: batchNumber.trim() || undefined,
        });
      } else {
        await addVaccination({
          name: item.name,
          doseNumber: item.dose,
          scheduledDate: getScheduledDate(item).toISOString(),
          actualDate,
          hospital: hospital.trim() || undefined,
          batchNumber: batchNumber.trim() || undefined,
        });
      }
      onClose();
    });
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200";

  return (
    <motion.form
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      onSubmit={handleSubmit}
      className="mt-3 space-y-3 overflow-hidden"
    >
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          接种日期
        </label>
        <input
          type="date"
          value={actualDate}
          onChange={(e) => setActualDate(e.target.value)}
          className={inputCls}
          required
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          接种医院
        </label>
        <input
          type="text"
          placeholder="例如：社区卫生服务中心"
          value={hospital}
          onChange={(e) => setHospital(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">
          疫苗批号
        </label>
        <input
          type="text"
          placeholder="可选"
          value={batchNumber}
          onChange={(e) => setBatchNumber(e.target.value)}
          className={inputCls}
        />
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 rounded-xl bg-gray-900 py-2.5 text-sm font-semibold text-white shadow-sm transition-all active:scale-[0.98]"
        >
          {isPending ? "保存中..." : "确认接种"}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
        >
          取消
        </button>
      </div>
    </motion.form>
  );
}

/* ── Timeline item ── */

function TimelineItem({
  item,
  status,
  vaccination,
  index,
}: {
  item: VaccineScheduleItem;
  status: VaccineStatus;
  vaccination?: Vaccination;
  index: number;
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="relative flex gap-4 pb-8 last:pb-0"
    >
      {/* Vertical line */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
            status === "completed" &&
              "border-emerald-300 bg-emerald-50 text-emerald-600",
            status === "due" &&
              "border-orange-300 bg-orange-50 text-orange-500 shadow-md shadow-orange-200/50",
            status === "upcoming" &&
              "border-gray-200 bg-gray-50 text-gray-400"
          )}
        >
          {status === "completed" && <Check className="h-4 w-4" />}
          {status === "due" && <Clock className="h-4 w-4" />}
          {status === "upcoming" && (
            <div className="h-2.5 w-2.5 rounded-full bg-gray-300" />
          )}
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-gray-200 to-transparent" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div
          className={cn(
            "glass-card p-4",
            status === "due" && "ring-2 ring-orange-200"
          )}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Syringe className="h-4 w-4 shrink-0 text-gray-400" />
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {item.name}
                </h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                第{item.dose}剂 · {item.ageLabel}
              </p>
            </div>
            <span
              className={cn(
                "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
                status === "completed" && "bg-emerald-50 text-emerald-700",
                status === "due" && "bg-orange-50 text-orange-700",
                status === "upcoming" && "bg-gray-100 text-gray-500"
              )}
            >
              {status === "completed" && "已接种"}
              {status === "due" && "待接种"}
              {status === "upcoming" && "未到期"}
            </span>
          </div>

          {/* Completed details */}
          {status === "completed" && vaccination?.actualDate && (
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span>接种日期：{formatDate(vaccination.actualDate)}</span>
              {vaccination.hospital && (
                <span>医院：{vaccination.hospital}</span>
              )}
              {vaccination.batchNumber && (
                <span>批号：{vaccination.batchNumber}</span>
              )}
            </div>
          )}

          {/* Mark as completed button */}
          {status !== "completed" && !showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-3 flex items-center gap-1.5 rounded-lg bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-100"
            >
              <Check className="h-3.5 w-3.5" />
              标记已接种
            </button>
          )}

          {/* Completion form */}
          {showForm && (
            <CompletionForm
              item={item}
              vaccination={vaccination}
              onClose={() => setShowForm(false)}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
}

/* ── Main component ── */

export function VaccinationTimeline({
  vaccinations,
  schedule,
}: VaccinationTimelineProps) {
  const ageMonths = getBabyAgeMonths();

  // Build merged list: schedule + DB records
  const items = schedule.map((item) => {
    const match = vaccinations.find(
      (v) => v.name === item.name && v.doseNumber === item.dose
    );
    let status: VaccineStatus = "upcoming";
    if (match?.actualDate) {
      status = "completed";
    } else if (item.ageMonths <= ageMonths) {
      status = "due";
    }
    return { item, status, vaccination: match };
  });

  // Sort: due first, then upcoming, then completed
  const statusOrder: Record<VaccineStatus, number> = {
    due: 0,
    upcoming: 1,
    completed: 2,
  };
  const sorted = [...items].sort((a, b) => {
    if (a.status !== b.status) return statusOrder[a.status] - statusOrder[b.status];
    return a.item.ageMonths - b.item.ageMonths;
  });

  const dueCount = sorted.filter((s) => s.status === "due").length;
  const completedCount = sorted.filter((s) => s.status === "completed").length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-card flex flex-col items-center px-3 py-3">
          <span className="text-2xl font-bold text-emerald-600">
            {completedCount}
          </span>
          <span className="text-xs text-muted-foreground">已接种</span>
        </div>
        <div className="glass-card flex flex-col items-center px-3 py-3">
          <span className="text-2xl font-bold text-orange-500">{dueCount}</span>
          <span className="text-xs text-muted-foreground">待接种</span>
        </div>
        <div className="glass-card flex flex-col items-center px-3 py-3">
          <span className="text-2xl font-bold text-gray-600">
            {schedule.length}
          </span>
          <span className="text-xs text-muted-foreground">总计</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {sorted.map(({ item, status, vaccination }, i) => (
          <TimelineItem
            key={`${item.name}-${item.dose}`}
            item={item}
            status={status}
            vaccination={vaccination}
            index={i}
          />
        ))}
      </div>
    </div>
  );
}
