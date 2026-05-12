import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to the Backend project on Vercel (Settings → Environment Variables).",
  );
}

/** Single small pool — recommended for Vercel serverless so each instance does not exhaust DB connections. */
const pool = new Pool({
  connectionString,
  max: process.env.VERCEL ? 1 : 10,
  connectionTimeoutMillis: 15_000,
  idleTimeoutMillis: 10_000,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;
