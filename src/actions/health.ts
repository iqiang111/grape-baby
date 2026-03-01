"use server";

import { getDb } from "@/db";
import { vaccination, doctorVisit, temperature } from "@/db/schema";
import { BABY_ID } from "@/lib/constants";
import { revalidatePath } from "next/cache";
import { eq, and, gte, desc, asc } from "drizzle-orm";

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
  const db = await getDb();
  await db.insert(vaccination).values({
    babyId: BABY_ID,
    name: data.name,
    doseNumber: data.doseNumber,
    scheduledDate: new Date(data.scheduledDate).toISOString(),
    actualDate: data.actualDate ? new Date(data.actualDate).toISOString() : null,
    hospital: data.hospital || null,
    batchNumber: data.batchNumber || null,
    note: data.note || null,
  });
  revalidatePath("/health");
}

export async function updateVaccination(
  id: string,
  data: { actualDate?: string; hospital?: string; batchNumber?: string; note?: string }
) {
  const db = await getDb();
  const updateData: Record<string, string | null> = {};
  if (data.actualDate !== undefined) {
    updateData.actualDate = data.actualDate ? new Date(data.actualDate).toISOString() : null;
  }
  if (data.hospital !== undefined) updateData.hospital = data.hospital;
  if (data.batchNumber !== undefined) updateData.batchNumber = data.batchNumber;
  if (data.note !== undefined) updateData.note = data.note;

  if (Object.keys(updateData).length > 0) {
    await db
      .update(vaccination)
      .set(updateData)
      .where(eq(vaccination.id, id));
  }
  revalidatePath("/health");
}

export async function getVaccinations() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(vaccination)
    .where(eq(vaccination.babyId, BABY_ID))
    .orderBy(asc(vaccination.scheduledDate));

  return rows.map((row) => ({
    ...row,
    scheduledDate: new Date(row.scheduledDate),
    actualDate: row.actualDate ? new Date(row.actualDate) : null,
    createdAt: new Date(row.createdAt),
  }));
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
  const db = await getDb();
  await db.insert(doctorVisit).values({
    babyId: BABY_ID,
    date: new Date(data.date).toISOString(),
    hospital: data.hospital,
    doctor: data.doctor || null,
    reason: data.reason,
    diagnosis: data.diagnosis || null,
    prescription: data.prescription || null,
    note: data.note || null,
  });
  revalidatePath("/health");
}

export async function deleteDoctorVisit(id: string) {
  const db = await getDb();
  await db.delete(doctorVisit).where(eq(doctorVisit.id, id));
  revalidatePath("/health");
}

export async function getDoctorVisits() {
  const db = await getDb();
  const rows = await db
    .select()
    .from(doctorVisit)
    .where(eq(doctorVisit.babyId, BABY_ID))
    .orderBy(desc(doctorVisit.date));

  return rows.map((row) => ({
    ...row,
    date: new Date(row.date),
    createdAt: new Date(row.createdAt),
  }));
}

// Temperature
export async function addTemperature(data: {
  time: string;
  value: number;
  method?: string;
  note?: string;
}) {
  const db = await getDb();
  await db.insert(temperature).values({
    babyId: BABY_ID,
    time: new Date(data.time).toISOString(),
    value: data.value,
    method: data.method || null,
    note: data.note || null,
  });
  revalidatePath("/health");
}

export async function deleteTemperature(id: string) {
  const db = await getDb();
  await db.delete(temperature).where(eq(temperature.id, id));
  revalidatePath("/health");
}

export async function getTemperatures(days = 7) {
  const db = await getDb();
  const start = new Date();
  start.setDate(start.getDate() - days);
  start.setHours(0, 0, 0, 0);

  const rows = await db
    .select()
    .from(temperature)
    .where(
      and(
        eq(temperature.babyId, BABY_ID),
        gte(temperature.time, start.toISOString())
      )
    )
    .orderBy(desc(temperature.time));

  return rows.map((row) => ({
    ...row,
    time: new Date(row.time),
    createdAt: new Date(row.createdAt),
  }));
}
