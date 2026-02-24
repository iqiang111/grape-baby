"use server";

import { prisma } from "@/lib/prisma";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function addSleep(data: {
  startTime: string;
  endTime?: string;
  quality?: string;
  note?: string;
}) {
  await prisma.sleepRecord.create({
    data: {
      babyId: BABY_ID,
      startTime: new Date(data.startTime),
      endTime: data.endTime ? new Date(data.endTime) : null,
      quality: data.quality || null,
      note: data.note || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/sleep");
}

export async function endSleep(id: string, endTime: string) {
  await prisma.sleepRecord.update({
    where: { id },
    data: { endTime: new Date(endTime) },
  });
  revalidatePath("/");
  revalidatePath("/sleep");
}

export async function deleteSleep(id: string) {
  await prisma.sleepRecord.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/sleep");
}

export async function getSleepRecords(date?: Date) {
  const start = new Date(date || new Date());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return prisma.sleepRecord.findMany({
    where: {
      babyId: BABY_ID,
      startTime: { gte: start, lte: end },
    },
    orderBy: { startTime: "desc" },
  });
}

export async function getActiveSleep() {
  return prisma.sleepRecord.findFirst({
    where: {
      babyId: BABY_ID,
      endTime: null,
    },
    orderBy: { startTime: "desc" },
  });
}

export async function getSleepStats(days = 7) {
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return prisma.sleepRecord.findMany({
    where: {
      babyId: BABY_ID,
      startTime: { gte: start },
    },
    orderBy: { startTime: "asc" },
  });
}
