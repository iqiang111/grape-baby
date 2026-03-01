"use server";

import { getDb } from "@/db";
import { diaperRecord } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, and, gte, lte, desc, asc } from "drizzle-orm";

export async function addDiaper(data: {
  time: string;
  type: string;
  color?: string;
  note?: string;
}) {
  const db = await getDb();
  await db.insert(diaperRecord).values({
    babyId: BABY_ID,
    time: new Date(data.time).toISOString(),
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
  const start = new Date(date || new Date());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

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
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const rows = await db
    .select()
    .from(diaperRecord)
    .where(
      and(
        eq(diaperRecord.babyId, BABY_ID),
        gte(diaperRecord.time, start.toISOString())
      )
    )
    .orderBy(asc(diaperRecord.time));

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}
