import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs";

declare global {
  var prisma: PrismaClient | undefined;
}

function getDatabaseUrl(): string {
  if (process.env.DATABASE_URL) {
    return process.env.DATABASE_URL;
  }

  // Se estiver rodando na Vercel Linux Serverless
  if (process.env.VERCEL && process.platform !== 'win32') {
    const tmpDbPath = path.join('/tmp', 'dev.db');
    const sourceDbPath = path.join(process.cwd(), 'prisma', 'dev.db');

    try {
      if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
        fs.copyFileSync(sourceDbPath, tmpDbPath);
      }
      return `file:${tmpDbPath}`;
    } catch (err) {
      console.error("Erro ao copiar SQLite para /tmp:", err);
    }
  }

  return "file:./dev.db";
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
