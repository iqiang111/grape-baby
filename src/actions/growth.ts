"use server";

import { prisma } from "@/lib/prisma";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function addGrowthRecord(data: {
  date: string;
  weight?: number;
  height?: number;
  headCirc?: number;
  note?: string;
}) {
  await prisma.growthRecord.create({
    data: {
      babyId: BABY_ID,
      date: new Date(data.date),
      weight: data.weight || null,
      height: data.height || null,
      headCirc: data.headCirc || null,
      note: data.note || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/growth");
}

export async function deleteGrowthRecord(id: string) {
  await prisma.growthRecord.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/growth");
}

export async function getGrowthRecords() {
  return prisma.growthRecord.findMany({
    where: { babyId: BABY_ID },
    orderBy: { date: "asc" },
  });
}

export async function getBabyInfo() {
  return prisma.baby.findUnique({
    where: { id: BABY_ID },
    select: { id: true, name: true, birthDate: true, gender: true },
  });
}
