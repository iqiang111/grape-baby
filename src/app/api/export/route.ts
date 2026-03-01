import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { baby, feeding, sleepRecord, diaperRecord, growthRecord, vaccination, doctorVisit, temperature, milestone } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { eq, desc, asc } from "drizzle-orm";

export async function GET() {
  const db = await getDb();

  const [
    babyRows,
    feedings,
    sleepRecords,
    diaperRecords,
    growthRecords,
    vaccinations,
    doctorVisits,
    temperatures,
    milestones,
  ] = await Promise.all([
    db.select().from(baby).where(eq(baby.id, BABY_ID)).limit(1),
    db.select().from(feeding).where(eq(feeding.babyId, BABY_ID)).orderBy(desc(feeding.time)),
    db.select().from(sleepRecord).where(eq(sleepRecord.babyId, BABY_ID)).orderBy(desc(sleepRecord.startTime)),
    db.select().from(diaperRecord).where(eq(diaperRecord.babyId, BABY_ID)).orderBy(desc(diaperRecord.time)),
    db.select().from(growthRecord).where(eq(growthRecord.babyId, BABY_ID)).orderBy(desc(growthRecord.date)),
    db.select().from(vaccination).where(eq(vaccination.babyId, BABY_ID)).orderBy(desc(vaccination.scheduledDate)),
    db.select().from(doctorVisit).where(eq(doctorVisit.babyId, BABY_ID)).orderBy(desc(doctorVisit.date)),
    db.select().from(temperature).where(eq(temperature.babyId, BABY_ID)).orderBy(desc(temperature.time)),
    db.select().from(milestone).where(eq(milestone.babyId, BABY_ID)).orderBy(desc(milestone.date)),
  ]);

  const data = {
    exportDate: new Date().toISOString(),
    baby: babyRows[0] || null,
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
