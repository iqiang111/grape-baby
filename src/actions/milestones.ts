"use server";

import { prisma } from "@/lib/prisma";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function addMilestone(data: {
  date: string;
  title: string;
  category: string;
  description?: string;
  photo?: string;
}) {
  await prisma.milestone.create({
    data: {
      babyId: BABY_ID,
      date: new Date(data.date),
      title: data.title,
      category: data.category,
      description: data.description || null,
      photo: data.photo || null,
    },
  });
  revalidatePath("/");
  revalidatePath("/milestones");
}

export async function deleteMilestone(id: string) {
  await prisma.milestone.delete({ where: { id } });
  revalidatePath("/");
  revalidatePath("/milestones");
}

export async function getMilestones(category?: string) {
  return prisma.milestone.findMany({
    where: {
      babyId: BABY_ID,
      ...(category ? { category } : {}),
    },
    orderBy: { date: "desc" },
  });
}
