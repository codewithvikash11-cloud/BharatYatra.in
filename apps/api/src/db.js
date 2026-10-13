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
  if (url.includes('connection_limit')) return url;
  return url.includes('?') ? `${url}&connection_limit=1` : `${url}?connection_limit=1`;
}

const datasourceUrl = getDatasourceUrl();

export const prisma = globalForPrisma.bharatYatraPrisma ?? new PrismaClient({
  ...(datasourceUrl ? { datasources: { db: { url: datasourceUrl } } } : {}),
  log: ['error', 'warn'],
});

globalForPrisma.bharatYatraPrisma = prisma;

