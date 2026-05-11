-- CreateTable Activity
CREATE TABLE IF NOT EXISTS "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,
    "types" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "importance" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex Activity_date_idx
CREATE INDEX "Activity_date_idx" ON "Activity"("date");

-- CreateIndex Activity_importance_idx
CREATE INDEX "Activity_importance_idx" ON "Activity"("importance");

-- CreateTable Skill
CREATE TABLE IF NOT EXISTS "Skill" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '',
    "level" TEXT NOT NULL DEFAULT '',
    "tags" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "source" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex Skill_status_idx
CREATE INDEX "Skill_status_idx" ON "Skill"("status");

-- CreateTable Project
CREATE TABLE IF NOT EXISTS "Project" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "desc" TEXT NOT NULL DEFAULT '',
    "startDate" TEXT,
    "endDate" TEXT,
    "skills" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "url" TEXT NOT NULL DEFAULT '',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex Project_status_idx
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateTable Job
CREATE TABLE IF NOT EXISTS "Job" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "company" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "appliedDate" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT '',
    "url" TEXT NOT NULL DEFAULT '',
    "rejection" TEXT NOT NULL DEFAULT '',
    "notes" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex Job_status_idx
CREATE INDEX "Job_status_idx" ON "Job"("status");

-- CreateTable Config
CREATE TABLE IF NOT EXISTS "Config" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex Config_key_key
CREATE UNIQUE INDEX "Config_key_key" ON "Config"("key");
