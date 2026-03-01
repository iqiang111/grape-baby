"use server";

import { getDb } from "@/db";
import { sleepRecord } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, and, gte, lte, desc, asc, isNull } from "drizzle-orm";
import { toISOFromChinaTime, getDayStart, getDayEnd } from "@/lib/utils";

export async function addSleep(data: {
  startTime: string;
  endTime?: string;
  quality?: string;
  note?: string;
}) {
  const db = await getDb();
  await db.insert(sleepRecord).values({
    babyId: BABY_ID,
    startTime: toISOFromChinaTime(data.startTime),
    endTime: data.endTime ? toISOFromChinaTime(data.endTime) : null,
    quality: data.quality || null,
    note: data.note || null,
  });
  revalidatePath("/");
  revalidatePath("/sleep");
}

export async function endSleep(id: string, endTime: string) {
  const db = await getDb();
  await db
    .update(sleepRecord)
    .set({ endTime: toISOFromChinaTime(endTime) })
    .where(eq(sleepRecord.id, id));
  revalidatePath("/");
  revalidatePath("/sleep");
}

export async function deleteSleep(id: string) {
  const db = await getDb();
  await db.delete(sleepRecord).where(eq(sleepRecord.id, id));
  revalidatePath("/");
  revalidatePath("/sleep");
}

export async function getSleepRecords(date?: Date) {
  const db = await getDb();
  const start = getDayStart(date || new Date());
  const end = getDayEnd(date || new Date());

  const rows = await db
    .select()
    .from(sleepRecord)
    .where(
      and(
        eq(sleepRecord.babyId, BABY_ID),
        gte(sleepRecord.startTime, start.toISOString()),
        lte(sleepRecord.startTime, end.toISOString())
      )
    )
    .orderBy(desc(sleepRecord.startTime));

  return rows.map((row) => ({
    ...row,
    startTime: new Date(row.startTime),
    endTime: row.endTime ? new Date(row.endTime) : null,
    createdAt: new Date(row.createdAt),
  }));
}

export async function getActiveSleep() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(sleepRecord)
    .where(
      and(
        eq(sleepRecord.babyId, BABY_ID),
        isNull(sleepRecord.endTime)
      )
    )
    .orderBy(desc(sleepRecord.startTime))
    .limit(1);

  if (rows.length === 0) return null;
  const row = rows[0];
  return {
    ...row,
    startTime: new Date(row.startTime),
    endTime: row.endTime ? new Date(row.endTime) : null,
    createdAt: new Date(row.createdAt),
  };
}

export async function getSleepStats(days = 7) {
  const db = await getDb();
  const start = getDayStart(new Date());
  const startAdjusted = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);

  const rows = await db
    .select()
    .from(sleepRecord)
    .where(
      and(
        eq(sleepRecord.babyId, BABY_ID),
        gte(sleepRecord.startTime, startAdjusted.toISOString())
      )
    )
    .orderBy(asc(sleepRecord.startTime));

  return rows.map((row) => ({
    ...row,
    startTime: new Date(row.startTime),
    endTime: row.endTime ? new Date(row.endTime) : null,
    createdAt: new Date(row.createdAt),
  }));
}
