"use server";

import { getDb } from "@/db";
import { diaperRecord } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { toISOFromChinaTime, getDayStart, getDayEnd } from "@/lib/utils";

export async function addDiaper(data: {
  time: string;
  type: string;
  color?: string;
  note?: string;
}) {
  const db = await getDb();
  await db.insert(diaperRecord).values({
    babyId: BABY_ID,
    time: toISOFromChinaTime(data.time),
    type: data.type,
    color: data.color || null,
    note: data.note || null,
  });
  revalidatePath("/");
  revalidatePath("/diaper");
}

export async function deleteDiaper(id: string) {
  const db = await getDb();
  await db.delete(diaperRecord).where(eq(diaperRecord.id, id));
  revalidatePath("/");
  revalidatePath("/diaper");
}

export async function getDiapers(date?: Date) {
  const db = await getDb();
  const start = getDayStart(date || new Date());
  const end = getDayEnd(date || new Date());

  const rows = await db
    .select()
    .from(diaperRecord)
    .where(
      and(
        eq(diaperRecord.babyId, BABY_ID),
        gte(diaperRecord.time, start.toISOString()),
        lte(diaperRecord.time, end.toISOString())
      )
    )
    .orderBy(desc(diaperRecord.time));

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}

export async function getDiaperStats(days = 7) {
  const db = await getDb();
  const start = getDayStart(new Date());
  const startAdjusted = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);

  const rows = await db
    .select()
    .from(diaperRecord)
    .where(
      and(
        eq(diaperRecord.babyId, BABY_ID),
        gte(diaperRecord.time, startAdjusted.toISOString())
      )
    )
    .orderBy(asc(diaperRecord.time));

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}
