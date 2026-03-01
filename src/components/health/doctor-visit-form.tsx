"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Stethoscope, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { addDoctorVisit } from "@/actions/health";
import { DateTimeWheelPicker } from "@/components/ui/datetime-wheel-picker";

function toLocalDatetimeValue(date: Date) {
  const offset = date.getTimezoneOffset();
  const local = new Date(date.getTime() - offset * 60000);
  return local.toISOString().slice(0, 16);
}

interface DoctorVisit {
  id: string;
  date: Date | string;
  hospital: string;
  doctor: string | null;
  reason: string;
  diagnosis: string | null;
  prescription: string | null;
  note: string | null;
}

interface DoctorVisitFormProps {
  visits: DoctorVisit[];
}

export function DoctorVisitForm({ visits }: DoctorVisitFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [date, setDate] = useState(() => toLocalDatetimeValue(new Date()));
  const [hospital, setHospital] = useState("");
  const [doctor, setDoctor] = useState("");
  const [reason, setReason] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [prescription, setPrescription] = useState("");
  const [note, setNote] = useState("");

  function resetForm() {
    setDate(toLocalDatetimeValue(new Date()));
    setHospital("");
    setDoctor("");
    setReason("");
    setDiagnosis("");
    setPrescription("");
    setNote("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!hospital.trim() || !reason.trim()) return;

    startTransition(async () => {
      await addDoctorVisit({
        date,
        hospital: hospital.trim(),
        doctor: doctor.trim() || undefined,
        reason: reason.trim(),
        diagnosis: diagnosis.trim() || undefined,
        prescription: prescription.trim() || undefined,
        note: note.trim() || undefined,
      });
      resetForm();
      setOpen(false);
    });
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-gray-400 focus:ring-2 focus:ring-gray-200";

  return (
    <div className="space-y-4">
      {/* Toggle button */}
      <button
        type="button"
        onClick={() => {
          if (!open) resetForm();
          setOpen(!open);
        }}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98]",
          open
            ? "bg-gray-100 text-gray-600"
            : "bg-gray-900 text-white shadow-lg shadow-lg"
        )}
      >
        {open ? (
          <>
            <X className="h-4 w-4" />
            收起
          </>
        ) : (
          <>
            <Plus className="h-4 w-4" />
            添加就诊记录
          </>
        )}
      </button>

      {/* Collapsible form */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <form
              onSubmit={handleSubmit}
              className="glass-card space-y-4 p-5"
            >
              <DateTimeWheelPicker label="就诊时间" value={date} onChange={setDate} />

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    医院 *
                  </label>
                  <input
                    type="text"
                    placeholder="医院名称"
                    value={hospital}
                    onChange={(e) => setHospital(e.target.value)}
                    className={inputCls}
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    医生
                  </label>
                  <input
                    type="text"
                    placeholder="医生姓名"
                    value={doctor}
                    onChange={(e) => setDoctor(e.target.value)}
                    className={inputCls}
                  />
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  就诊原因 *
                </label>
                <input
                  type="text"
                  placeholder="例如：发热、咳嗽、常规体检"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className={inputCls}
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  诊断结果
                </label>
                <input
                  type="text"
                  placeholder="医生诊断"
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className={inputCls}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  处方/用药
                </label>
                <textarea
                  rows={2}
                  placeholder="开具的药物及用法"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  备注
                </label>
                <textarea
                  rows={2}
                  placeholder="其他需要记录的信息"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className={cn(inputCls, "resize-none")}
                />
              </div>

              <button
                type="submit"
                disabled={!hospital.trim() || !reason.trim() || isPending}
                className={cn(
                  "w-full rounded-2xl py-3.5 text-sm font-semibold transition-all active:scale-[0.98]",
                  hospital.trim() && reason.trim()
                    ? "bg-gray-900 text-white shadow-lg shadow-lg"
                    : "bg-gray-100 text-gray-300 cursor-not-allowed"
                )}
              >
                {isPending ? "保存中..." : "保存就诊记录"}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Visit history list */}
      {visits.length > 0 && (
        <div className="space-y-3">
          {visits.map((visit) => (
            <div key={visit.id} className="glass-card p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-gray-100 to-gray-200">
                  <Stethoscope className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                      {visit.reason}
                    </h3>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(visit.date).toLocaleDateString("zh-CN", {
                        month: "short",
                        day: "numeric",
                        timeZone: "Asia/Shanghai",
                      })}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {visit.hospital}
                    {visit.doctor && ` · ${visit.doctor}`}
                  </p>
                  {visit.diagnosis && (
                    <p className="mt-1.5 text-xs text-gray-700">
                      <span className="font-medium">诊断：</span>
                      {visit.diagnosis}
                    </p>
                  )}
                  {visit.prescription && (
                    <p className="mt-1 text-xs text-gray-700">
                      <span className="font-medium">处方：</span>
                      {visit.prescription}
                    </p>
                  )}
                  {visit.note && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {visit.note}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {visits.length === 0 && (
        <div className="py-8 text-center text-sm text-muted-foreground">
          暂无就诊记录
        </div>
      )}
    </div>
  );
}
