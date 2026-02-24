"use server";

import { prisma } from "@/lib/prisma";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";

// Vaccination
export async function addVaccination(data: {
  name: string;
  doseNumber: number;
  scheduledDate: string;
  actualDate?: string;
  hospital?: string;
  batchNumber?: string;
  note?: string;
}) {
  await prisma.vaccination.create({
    data: {
      babyId: BABY_ID,
      name: data.name,
      doseNumber: data.doseNumber,
      scheduledDate: new Date(data.scheduledDate),
      actualDate: data.actualDate ? new Date(data.actualDate) : null,
      hospital: data.hospital || null,
      batchNumber: data.batchNumber || null,
      note: data.note || null,
    },
  });
  revalidatePath("/health");
}

export async function updateVaccination(
  id: string,
  data: { actualDate?: string; hospital?: string; batchNumber?: string; note?: string }
) {
  await prisma.vaccination.update({
    where: { id },
    data: {
      actualDate: data.actualDate ? new Date(data.actualDate) : undefined,
      hospital: data.hospital ?? undefined,
      batchNumber: data.batchNumber ?? undefined,
      note: data.note ?? undefined,
    },
  });
  revalidatePath("/health");
}

export async function getVaccinations() {
  return prisma.vaccination.findMany({
    where: { babyId: BABY_ID },
    orderBy: { scheduledDate: "asc" },
  });
}

// Doctor Visits
export async function addDoctorVisit(data: {
  date: string;
  hospital: string;
  doctor?: string;
  reason: string;
  diagnosis?: string;
  prescription?: string;
  note?: string;
}) {
  await prisma.doctorVisit.create({
    data: {
      babyId: BABY_ID,
      date: new Date(data.date),
      hospital: data.hospital,
      doctor: data.doctor || null,
      reason: data.reason,
      diagnosis: data.diagnosis || null,
      prescription: data.prescription || null,
      note: data.note || null,
    },
  });
  revalidatePath("/health");
}

export async function deleteDoctorVisit(id: string) {
  await prisma.doctorVisit.delete({ where: { id } });
  revalidatePath("/health");
}

export async function getDoctorVisits() {
  return prisma.doctorVisit.findMany({
    where: { babyId: BABY_ID },
    orderBy: { date: "desc" },
  });
}

// Temperature
export async function addTemperature(data: {
  time: string;
  value: number;
  method?: string;
  note?: string;
}) {
  await prisma.temperature.create({
    data: {
      babyId: BABY_ID,
      time: new Date(data.time),
      value: data.value,
      method: data.method || null,
      note: data.note || null,
    },
  });
  revalidatePath("/health");
}

export async function deleteTemperature(id: string) {
  await prisma.temperature.delete({ where: { id } });
  revalidatePath("/health");
}

export async function getTemperatures(days = 7) {
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  return prisma.temperature.findMany({
    where: {
      babyId: BABY_ID,
      time: { gte: start },
    },
    orderBy: { time: "desc" },
  });
}
