import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../apps/api/src/db.js';

async function test() {
  try {
    const res = await prisma.articles.findMany({ take: 1 });
    console.log('Articles findMany success, count:', res.length);
    const auditRes = await prisma.admin_audit_logs.findMany({ take: 1 });
    console.log('Audit logs findMany success, count:', auditRes.length);
  } catch (err) {
    console.error('Diagnostic error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
test();
