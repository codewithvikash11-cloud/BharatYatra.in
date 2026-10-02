import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.bharatYatraPrisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.bharatYatraPrisma = prisma;
}
