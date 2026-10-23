import dotenv from 'dotenv';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

// Ensure root .env is available in all execution contexts
dotenv.config({ path: path.resolve(process.cwd(), '..', '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const globalForPrisma = globalThis;

function getDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  let res = url;
  if (!res.includes('connection_limit')) {
    res = res.includes('?') ? `${res}&connection_limit=5` : `${res}?connection_limit=5`;
  }
  if (!res.includes('pool_timeout')) {
    res = `${res}&pool_timeout=10`;
  }
  return res;
}

const datasourceUrl = getDatasourceUrl();

export const prisma =
  globalForPrisma.bharatYatraPrisma ||
  new PrismaClient({
    ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.bharatYatraPrisma = prisma;
}

export default prisma;
