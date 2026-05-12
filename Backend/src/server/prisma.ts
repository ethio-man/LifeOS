import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Add it to the Backend project on Vercel (Settings → Environment Variables).",
  );
}

if (
  process.env.VERCEL &&
  connectionString.includes("db.") &&
  connectionString.includes(".supabase.co") &&
  !connectionString.includes("pooler.supabase.com")
) {
  console.warn(
    "[LifeOS] DATABASE_URL uses Supabase direct host (db.*.supabase.co). From Vercel serverless this often fails with P1001. Use the Transaction pooler URI from Supabase Dashboard → Connect → Transaction pool (port 6543, host *.pooler.supabase.com) and append ?pgbouncer=true to the URL.",
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
