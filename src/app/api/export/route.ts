import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BABY_ID } from "@/lib/constants";

export async function GET() {
  const [
    baby,
    feedings,
    sleepRecords,
    diaperRecords,
    growthRecords,
    vaccinations,
    doctorVisits,
    temperatures,
    milestones,
  ] = await Promise.all([
    prisma.baby.findUnique({ where: { id: BABY_ID } }),
    prisma.feeding.findMany({ where: { babyId: BABY_ID }, orderBy: { time: "desc" } }),
    prisma.sleepRecord.findMany({ where: { babyId: BABY_ID }, orderBy: { startTime: "desc" } }),
    prisma.diaperRecord.findMany({ where: { babyId: BABY_ID }, orderBy: { time: "desc" } }),
    prisma.growthRecord.findMany({ where: { babyId: BABY_ID }, orderBy: { date: "desc" } }),
    prisma.vaccination.findMany({ where: { babyId: BABY_ID }, orderBy: { scheduledDate: "desc" } }),
    prisma.doctorVisit.findMany({ where: { babyId: BABY_ID }, orderBy: { date: "desc" } }),
    prisma.temperature.findMany({ where: { babyId: BABY_ID }, orderBy: { time: "desc" } }),
    prisma.milestone.findMany({ where: { babyId: BABY_ID }, orderBy: { date: "desc" } }),
  ]);

  const data = {
    exportDate: new Date().toISOString(),
    baby,
    feedings,
    sleepRecords,
    diaperRecords,
    growthRecords,
    vaccinations,
    doctorVisits,
    temperatures,
    milestones,
  };

  const today = new Date().toISOString().slice(0, 10);

  return new NextResponse(JSON.stringify(data, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="grape-export-${today}.json"`,
    },
  });
}
