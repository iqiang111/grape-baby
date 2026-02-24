"use server";

import { prisma } from "@/lib/prisma";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function addDiaper(data: {
  time: string;
  type: string;
  color?: string;
  note?: string;
}) {
  await prisma.diaperRecord.create({
    data: {
      babyId: BABY_ID,
      time: new Date(data.time),
      type: data.type,
      color: data.color || null,
      note: data.note || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/diaper");
}

export async function deleteDiaper(id: string) {
  await prisma.diaperRecord.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/diaper");
}

export async function getDiapers(date?: Date) {
  const start = new Date(date || new Date());
  start.setHours(0, 0, 0, 0);
  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  return prisma.diaperRecord.findMany({
    where: {
      babyId: BABY_ID,
      time: { gte: start, lte: end },
    },
    orderBy: { time: "desc" },
  });
}

export async function getDiaperStats(days = 7) {
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return prisma.diaperRecord.findMany({
    where: {
      babyId: BABY_ID,
      time: { gte: start },
    },
    orderBy: { time: "asc" },
  });
}
