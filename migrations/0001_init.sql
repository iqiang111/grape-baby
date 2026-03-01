-- CreateTable
CREATE TABLE "Baby" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "birthDate" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "photo" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now'))
);

-- CreateTable
CREATE TABLE "Feeding" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "amount" REAL,
    "duration" INTEGER,
    "note" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "GrowthRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "weight" REAL,
    "height" REAL,
    "headCirc" REAL,
    "note" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SleepRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "quality" TEXT,
    "note" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DiaperRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "color" TEXT,
    "note" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Vaccination" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "doseNumber" INTEGER NOT NULL,
    "scheduledDate" TEXT NOT NULL,
    "actualDate" TEXT,
    "hospital" TEXT,
    "batchNumber" TEXT,
    "note" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "DoctorVisit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "doctor" TEXT,
    "reason" TEXT NOT NULL,
    "diagnosis" TEXT,
    "prescription" TEXT,
    "note" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Temperature" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "time" TEXT NOT NULL,
    "value" REAL NOT NULL,
    "method" TEXT,
    "note" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "babyId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "photo" TEXT,
    "createdAt" TEXT NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY ("babyId") REFERENCES "Baby" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Feeding_babyId_time_idx" ON "Feeding"("babyId", "time");

-- CreateIndex
CREATE INDEX "GrowthRecord_babyId_date_idx" ON "GrowthRecord"("babyId", "date");

-- CreateIndex
CREATE INDEX "SleepRecord_babyId_startTime_idx" ON "SleepRecord"("babyId", "startTime");

-- CreateIndex
CREATE INDEX "DiaperRecord_babyId_time_idx" ON "DiaperRecord"("babyId", "time");

-- CreateIndex
CREATE INDEX "Vaccination_babyId_scheduledDate_idx" ON "Vaccination"("babyId", "scheduledDate");

-- CreateIndex
CREATE INDEX "DoctorVisit_babyId_date_idx" ON "DoctorVisit"("babyId", "date");

-- CreateIndex
CREATE INDEX "Temperature_babyId_time_idx" ON "Temperature"("babyId", "time");

-- CreateIndex
CREATE INDEX "Milestone_babyId_date_idx" ON "Milestone"("babyId", "date");
