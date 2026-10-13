import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../apps/api/src/db.js';
import { issueAdminSession, createAdminActorId, normalizeAdminEmail } from '../apps/admin/lib/admin-auth.js';

async function testPost() {
  const email = process.env.ADMIN_EMAIL || 'admin@bharatyatra.in';
  const principal = { id: createAdminActorId(email), email: normalizeAdminEmail(email), role: 'admin' };
  const adminToken = issueAdminSession(principal, process.env);

  const payload = {
    title_en: 'Test Article Title',
    slug: 'test-article-title-' + Date.now(),
    category: 'Destination Guide',
    excerpt_en: 'Test excerpt',
    body_en: 'Test body',
  };

  const res = await fetch('http://localhost:4000/api/v1/admin/articles', {
    method: 'POST',
    headers: {
      authorization: `Bearer ${adminToken}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text);
  await prisma.$disconnect();
}
testPost();
