import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function getDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  let res = url;
  if (!res.includes('connection_limit')) {
    res = res.includes('?') ? `${res}&connection_limit=1` : `${res}?connection_limit=1`;
  }
  if (!res.includes('connect_timeout')) {
    res = `${res}&connect_timeout=2&pool_timeout=2`;
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
