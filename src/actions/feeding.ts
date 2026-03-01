"use server";

import { getDb } from "@/db";
import { feeding } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";
import { toISOFromChinaTime, getDayStart, getDayEnd } from "@/lib/utils";

export async function addFeeding(data: {
  time: string;
  type: string;
  amount?: number;
  duration?: number;
  note?: string;
}) {
  const db = await getDb();
  await db.insert(feeding).values({
    babyId: BABY_ID,
    time: toISOFromChinaTime(data.time),
    type: data.type,
    amount: data.amount || null,
    duration: data.duration || null,
    note: data.note || null,
  });
  revalidatePath("/");
  revalidatePath("/feeding");
}

export async function deleteFeeding(id: string) {
  const db = await getDb();
  await db.delete(feeding).where(eq(feeding.id, id));
  revalidatePath("/");
  revalidatePath("/feeding");
}

export async function getFeedings(date?: Date) {
  const db = await getDb();
  const start = getDayStart(date || new Date());
  const end = getDayEnd(date || new Date());

  const rows = await db
    .select()
    .from(feeding)
    .where(
      and(
        eq(feeding.babyId, BABY_ID),
        gte(feeding.time, start.toISOString()),
        lte(feeding.time, end.toISOString())
      )
    )
    .orderBy(desc(feeding.time));

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}

export async function getRecentFeedings(limit = 10) {
  const db = await getDb();
  const rows = await db
    .select()
    .from(feeding)
    .where(eq(feeding.babyId, BABY_ID))
    .orderBy(desc(feeding.time))
    .limit(limit);

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}

export async function getFeedingStats(days = 7) {
  const db = await getDb();
  const start = getDayStart(new Date());
  const startAdjusted = new Date(start.getTime() - days * 24 * 60 * 60 * 1000);

  const rows = await db
    .select()
    .from(feeding)
    .where(
      and(
        eq(feeding.babyId, BABY_ID),
        gte(feeding.time, startAdjusted.toISOString())
      )
    )
    .orderBy(asc(feeding.time));

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}
