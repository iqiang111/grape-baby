"use server";

import { getDb } from "@/db";
import { milestone } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, and, desc } from "drizzle-orm";
import { toISOFromChinaTime } from "@/lib/utils";

export async function addMilestone(data: {
  date: string;
  title: string;
  category: string;
  description?: string;
  photo?: string;
}) {
  const db = await getDb();
  await db.insert(milestone).values({
    babyId: BABY_ID,
    date: toISOFromChinaTime(data.date),
    title: data.title,
    category: data.category,
    description: data.description || null,
    photo: data.photo || null,
  });
  revalidatePath("/");
  revalidatePath("/milestones");
}

export async function deleteMilestone(id: string) {
  const db = await getDb();
  await db.delete(milestone).where(eq(milestone.id, id));
  revalidatePath("/");
  revalidatePath("/milestones");
}

export async function getMilestones(category?: string) {
  const db = await getDb();
  const conditions = [eq(milestone.babyId, BABY_ID)];
  if (category) {
    conditions.push(eq(milestone.category, category));
  }

  const rows = await db
    .select()
    .from(milestone)
    .where(and(...conditions))
    .orderBy(desc(milestone.date));

  return rows.map((row) => ({
    ...row,
    date: new Date(row.date),
    createdAt: new Date(row.createdAt),
  }));
}
