"use server";

import { prisma } from "@/lib/prisma";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function addFeeding(data: {
  time: string;
  type: string;
  amount?: number;
  duration?: number;
  note?: string;
}) {
  await prisma.feeding.create({
    data: {
      babyId: BABY_ID,
      time: new Date(data.time),
      type: data.type,
      amount: data.amount || null,
      duration: data.duration || null,
      note: data.note || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/feeding");
}

export async function deleteFeeding(id: string) {
  await prisma.feeding.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/feeding");
}

export async function getFeedings(date?: Date) {
  const start = new Date(date || new Date());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return prisma.feeding.findMany({
    where: {
      babyId: BABY_ID,
      time: { gte: start, lte: end },
    },
    orderBy: { time: "desc" },
  });
}

export async function getRecentFeedings(limit = 10) {
  return prisma.feeding.findMany({
    where: { babyId: BABY_ID },
    orderBy: { time: "desc" },
    take: limit,
  });
}

export async function getFeedingStats(days = 7) {
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const feedings = await prisma.feeding.findMany({
    where: {
      babyId: BABY_ID,
      time: { gte: start },
    },
    orderBy: { time: "asc" },
  });

  return feedings;
}
