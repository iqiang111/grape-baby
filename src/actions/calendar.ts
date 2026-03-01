"use server";

import { getDb } from "@/db";
import { feeding, sleepRecord, diaperRecord } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { toChinaDateStr } from "@/lib/utils";
import { eq, and, gte, lte, asc } from "drizzle-orm";

export interface DaySummary {
  date: string;
  feedingCount: number;
  feedingTotalMl: number;
  sleepTotalHours: number;
  diaperCount: number;
}

export async function getMonthSummary(
  year: number,
  month: number
): Promise<Record<string, DaySummary>> {
  const db = await getDb();

  // Build query range in UTC that covers the full China-time month
  // China is UTC+8, so month start at 00:00 CST = previous day 16:00 UTC
  const start = new Date(Date.UTC(year, month - 1, 1) - 8 * 3600000);
  const end = new Date(Date.UTC(year, month, 1) - 8 * 3600000 - 1);

  const startISO = start.toISOString();
  const endISO = end.toISOString();

  const [feedings, sleeps, diapers] = await Promise.all([
    db
      .select()
      .from(feeding)
      .where(
        and(
          eq(feeding.babyId, BABY_ID),
          gte(feeding.time, startISO),
          lte(feeding.time, endISO)
        )
      )
      .orderBy(asc(feeding.time)),
    db
      .select()
      .from(sleepRecord)
      .where(
        and(
          eq(sleepRecord.babyId, BABY_ID),
          gte(sleepRecord.startTime, startISO),
          lte(sleepRecord.startTime, endISO)
        )
      )
      .orderBy(asc(sleepRecord.startTime)),
    db
      .select()
      .from(diaperRecord)
      .where(
        and(
          eq(diaperRecord.babyId, BABY_ID),
          gte(diaperRecord.time, startISO),
          lte(diaperRecord.time, endISO)
        )
      )
      .orderBy(asc(diaperRecord.time)),
  ]);

  const result: Record<string, DaySummary> = {};

  const ensureDay = (dateStr: string) => {
    if (!result[dateStr]) {
      result[dateStr] = {
        date: dateStr,
        feedingCount: 0,
        feedingTotalMl: 0,
        sleepTotalHours: 0,
        diaperCount: 0,
      };
    }
  };

  for (const f of feedings) {
    const key = toChinaDateStr(f.time);
    ensureDay(key);
    result[key].feedingCount += 1;
    result[key].feedingTotalMl += f.amount ?? 0;
  }

  for (const s of sleeps) {
    const key = toChinaDateStr(s.startTime);
    ensureDay(key);
    if (s.endTime) {
      const hours =
        (new Date(s.endTime).getTime() - new Date(s.startTime).getTime()) /
        3600000;
      result[key].sleepTotalHours += Math.round(hours * 10) / 10;
    }
  }

  for (const d of diapers) {
    const key = toChinaDateStr(d.time);
    ensureDay(key);
    result[key].diaperCount += 1;
  }

  return result;
}
