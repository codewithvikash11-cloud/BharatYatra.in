import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const globalForPrisma = globalThis;

function getDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  let res = url;
  if (!res.includes('connection_limit')) {
    res = res.includes('?') ? `${res}&connection_limit=5` : `${res}?connection_limit=5`;
  }
  if (!res.includes('pool_timeout')) {
    res = `${res}&pool_timeout=15`;
  }
  return res;
}

const datasourceUrl = getDatasourceUrl();

export const prisma = globalForPrisma.bharatYatraPrisma ?? new PrismaClient({
  ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
  log: ['error', 'warn'],
});

globalForPrisma.bharatYatraPrisma = prisma;

