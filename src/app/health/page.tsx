import { Syringe, Stethoscope, Thermometer } from "lucide-react";
import {
  getVaccinations,
  getDoctorVisits,
  getTemperatures,
} from "@/actions/health";
import { vaccinationSchedule } from "@/data/vaccination-schedule";
import { HealthTabs } from "./health-tabs";

export default async function HealthPage() {
  const [vaccinations, doctorVisits, temperatures] = await Promise.all([
    getVaccinations(),
    getDoctorVisits(),
    getTemperatures(),
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Stethoscope className="h-7 w-7 text-gray-500" />
          健康档案
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          记录小葡萄的健康状况
        </p>
      </div>

      {/* Tabs */}
      <HealthTabs
        vaccinations={vaccinations}
        schedule={vaccinationSchedule}
        doctorVisits={doctorVisits}
        temperatures={temperatures}
      />
    </div>
  );
}
