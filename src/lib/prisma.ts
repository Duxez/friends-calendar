import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

type GlobalPrisma = {
  prisma?: PrismaClient;
  prismaPool?: Pool;
};

const globalForPrisma = globalThis as unknown as GlobalPrisma;

function resolveConnectionString() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error("DATABASE_URL is not set.");
  }

  if (!databaseUrl.startsWith("prisma+postgres://")) {
    return databaseUrl;
  }

  const parsedDatabaseUrl = new URL(databaseUrl);
  const encodedApiKey = parsedDatabaseUrl.searchParams.get("api_key");
  if (!encodedApiKey) {
    throw new Error("DATABASE_URL is missing api_key query parameter.");
  }

  try {
    const decodedApiKey = Buffer.from(encodedApiKey, "base64url").toString("utf8");
    const parsedApiKey = JSON.parse(decodedApiKey) as { databaseUrl?: string };
    if (parsedApiKey.databaseUrl) {
      return parsedApiKey.databaseUrl;
    }
  } catch {
    throw new Error("Unable to decode databaseUrl from Prisma Postgres api_key.");
  }

  throw new Error("DATABASE_URL does not contain a usable Postgres connection string.");
}

const pool =
  globalForPrisma.prismaPool ??
  new Pool({
    connectionString: resolveConnectionString(),
  });

const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
  globalForPrisma.prismaPool = pool;
}
