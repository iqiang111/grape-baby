"use client";

import { useState } from "react";
import { Syringe, Stethoscope, Thermometer } from "lucide-react";
import { cn } from "@/lib/utils";
import { VaccinationTimeline } from "@/components/health/vaccination-timeline";
import { DoctorVisitForm } from "@/components/health/doctor-visit-form";
import { TemperatureTracker } from "@/components/health/temperature-tracker";
import type { VaccineScheduleItem } from "@/data/vaccination-schedule";

const TABS = [
  { key: "vaccination", label: "疫苗接种", icon: Syringe },
  { key: "doctor", label: "就诊记录", icon: Stethoscope },
  { key: "temperature", label: "体温监测", icon: Thermometer },
] as const;

type TabKey = (typeof TABS)[number]["key"];

interface HealthTabsProps {
  vaccinations: {
    id: string;
    name: string;
    doseNumber: number;
    scheduledDate: Date | string;
    actualDate: Date | string | null;
    hospital: string | null;
    batchNumber: string | null;
    note: string | null;
  }[];
  schedule: VaccineScheduleItem[];
  doctorVisits: {
    id: string;
    date: Date | string;
    hospital: string;
    doctor: string | null;
    reason: string;
    diagnosis: string | null;
    prescription: string | null;
    note: string | null;
  }[];
  temperatures: {
    id: string;
    time: Date | string;
    value: number;
    method: string | null;
    note: string | null;
  }[];
}

export function HealthTabs({
  vaccinations,
  schedule,
  doctorVisits,
  temperatures,
}: HealthTabsProps) {
  const [activeTab, setActiveTab] = useState<TabKey>("vaccination");

  return (
    <div className="space-y-5">
      {/* Tab switcher */}
      <div className="flex gap-1 rounded-2xl bg-gray-100 p-1">
        {TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-all",
              activeTab === key
                ? "bg-white text-gray-700 shadow-sm"
                : "text-gray-500 hover:text-gray-600"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.slice(0, 2)}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "vaccination" && (
        <VaccinationTimeline
          vaccinations={vaccinations}
          schedule={schedule}
        />
      )}
      {activeTab === "doctor" && (
        <DoctorVisitForm visits={doctorVisits} />
      )}
      {activeTab === "temperature" && (
        <TemperatureTracker temperatures={temperatures} />
      )}
    </div>
  );
}
