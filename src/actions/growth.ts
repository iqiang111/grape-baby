"use server";

import { getDb } from "@/db";
import { growthRecord, baby } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, asc } from "drizzle-orm";
import { toISOFromChinaTime } from "@/lib/utils";

export async function addGrowthRecord(data: {
  date: string;
  weight?: number;
  height?: number;
  headCirc?: number;
  note?: string;
}) {
  const db = await getDb();
  await db.insert(growthRecord).values({
    babyId: BABY_ID,
    date: toISOFromChinaTime(data.date),
    weight: data.weight || null,
    height: data.height || null,
    headCirc: data.headCirc || null,
    note: data.note || null,
  });
  revalidatePath("/");
  revalidatePath("/growth");
}

export async function deleteGrowthRecord(id: string) {
  const db = await getDb();
  await db.delete(growthRecord).where(eq(growthRecord.id, id));
  revalidatePath("/");
  revalidatePath("/growth");
}

export async function getGrowthRecords() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(growthRecord)
    .where(eq(growthRecord.babyId, BABY_ID))
    .orderBy(asc(growthRecord.date));

  return rows.map((row) => ({
    ...row,
    date: new Date(row.date),
    createdAt: new Date(row.createdAt),
  }));
}

export async function getBabyInfo() {
  const db = await getDb();
  const rows = await db
    .select({
      id: baby.id,
      name: baby.name,
      birthDate: baby.birthDate,
      gender: baby.gender,
    })
    .from(baby)
    .where(eq(baby.id, BABY_ID))
    .limit(1);

  if (rows.length === 0) return null;
  return {
    ...rows[0],
    birthDate: new Date(rows[0].birthDate),
  };
}
