import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../apps/api/src/db.js';

async function testDirect() {
  const principal = { id: '00000000-0000-0000-0000-000000000001', email: 'admin@bharatyatra.in', role: 'admin' };
  const data = {
    title_en: 'Test Direct Article',
    slug: 'test-direct-article-' + Date.now(),
    category: 'Destination Guide',
    excerpt_en: 'Test excerpt',
    body_en: 'Test body',
    status: 'DRAFT',
  };

  try {
    const created = await prisma.$transaction(async (tx) => {
      const row = await tx.articles.create({ data: { ...data, published_at: null } });
      await tx.admin_audit_logs.create({
        data: {
          actor_user_id: principal.id,
          action: 'content_created',
          entity_type: 'articles',
          entity_id: row.id,
          next_status: row.status,
          changed_fields: Object.keys(data),
        },
      });
      return row;
    });
    console.log('Direct create success! ID:', created.id);
  } catch (err) {
    console.error('Direct create threw error:', err);
  } finally {
    await prisma.$disconnect();
  }
}
testDirect();
