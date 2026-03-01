"use server";

import { getDb } from "@/db";
import { feeding } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

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
    time: new Date(data.time).toISOString(),
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
  const start = new Date(date || new Date());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

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
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const rows = await db
    .select()
    .from(feeding)
    .where(
      and(
        eq(feeding.babyId, BABY_ID),
        gte(feeding.time, start.toISOString())
      )
    )
    .orderBy(asc(feeding.time));

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}
