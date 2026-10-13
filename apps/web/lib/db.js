import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

function getDatasourceUrl() {
  const url = process.env.DATABASE_URL;
  if (!url) return undefined;
  if (url.includes('connection_limit')) return url;
  return url.includes('?') ? `${url}&connection_limit=1` : `${url}?connection_limit=1`;
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
