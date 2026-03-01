import { sqliteTable, text, real, integer, index } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

export const baby = sqliteTable("Baby", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name").notNull(),
  birthDate: text("birthDate").notNull(),
  gender: text("gender").notNull(),
  photo: text("photo"),
  createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
});

export const feeding = sqliteTable(
  "Feeding",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    time: text("time").notNull(),
    type: text("type").notNull(),
    amount: real("amount"),
    duration: integer("duration"),
    note: text("note"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("Feeding_babyId_time_idx").on(table.babyId, table.time)]
);

export const growthRecord = sqliteTable(
  "GrowthRecord",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    date: text("date").notNull(),
    weight: real("weight"),
    height: real("height"),
    headCirc: real("headCirc"),
    note: text("note"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("GrowthRecord_babyId_date_idx").on(table.babyId, table.date)]
);

export const sleepRecord = sqliteTable(
  "SleepRecord",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    startTime: text("startTime").notNull(),
    endTime: text("endTime"),
    quality: text("quality"),
    note: text("note"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("SleepRecord_babyId_startTime_idx").on(table.babyId, table.startTime)]
);

export const diaperRecord = sqliteTable(
  "DiaperRecord",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    time: text("time").notNull(),
    type: text("type").notNull(),
    color: text("color"),
    note: text("note"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("DiaperRecord_babyId_time_idx").on(table.babyId, table.time)]
);

export const vaccination = sqliteTable(
  "Vaccination",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    name: text("name").notNull(),
    doseNumber: integer("doseNumber").notNull(),
    scheduledDate: text("scheduledDate").notNull(),
    actualDate: text("actualDate"),
    hospital: text("hospital"),
    batchNumber: text("batchNumber"),
    note: text("note"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("Vaccination_babyId_scheduledDate_idx").on(table.babyId, table.scheduledDate)]
);

export const doctorVisit = sqliteTable(
  "DoctorVisit",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    date: text("date").notNull(),
    hospital: text("hospital").notNull(),
    doctor: text("doctor"),
    reason: text("reason").notNull(),
    diagnosis: text("diagnosis"),
    prescription: text("prescription"),
    note: text("note"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("DoctorVisit_babyId_date_idx").on(table.babyId, table.date)]
);

export const temperature = sqliteTable(
  "Temperature",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    time: text("time").notNull(),
    value: real("value").notNull(),
    method: text("method"),
    note: text("note"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("Temperature_babyId_time_idx").on(table.babyId, table.time)]
);

export const milestone = sqliteTable(
  "Milestone",
  {
    id: text("id").primaryKey().$defaultFn(() => createId()),
    babyId: text("babyId").notNull().references(() => baby.id),
    date: text("date").notNull(),
    title: text("title").notNull(),
    category: text("category").notNull(),
    description: text("description"),
    photo: text("photo"),
    createdAt: text("createdAt").notNull().default(sql`(datetime('now'))`),
  },
  (table) => [index("Milestone_babyId_date_idx").on(table.babyId, table.date)]
);
