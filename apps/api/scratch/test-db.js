import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), '../../../.env') });

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error'],
});

async function main() {
  try {
    const start = Date.now();
    const count = await prisma.destinations.count();
    console.log(`Connected successfully in ${Date.now() - start}ms. Destinations count: ${count}`);
  } catch (error) {
    console.error('Prisma connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
