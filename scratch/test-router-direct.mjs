import dotenv from 'dotenv';
dotenv.config();
import { prisma } from '../apps/api/src/db.js';
import { createAdminRouter } from '../apps/api/src/routes/admin.js';
import { issueAdminSession, createAdminActorId, normalizeAdminEmail } from '../apps/admin/lib/admin-auth.js';
import express from 'express';

async function testExpress() {
  const app = express();
  app.use(express.json());
  const router = createAdminRouter({
    prisma,
  });
  app.use('/admin', router);

  const email = process.env.ADMIN_EMAIL || 'admin@bharatyatra.in';
  const principal = { id: createAdminActorId(email), email: normalizeAdminEmail(email), role: 'admin' };
  const adminToken = issueAdminSession(principal, process.env);

  const server = app.listen(4099, async () => {
    try {
      const payload = {
        title_en: 'Test Direct Router Article',
        slug: 'test-direct-router-' + Date.now(),
        category: 'Destination Guide',
        excerpt_en: 'Excerpt',
        body_en: 'Body',
      };
      const res = await fetch('http://localhost:4099/admin/articles', {
        method: 'POST',
        headers: {
          authorization: `Bearer ${adminToken}`,
          'content-type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('Status on 4099:', res.status);
      const data = await res.json();
      console.log('Data on 4099:', data);
    } catch (err) {
      console.error('Error on 4099:', err);
    } finally {
      server.close();
      await prisma.$disconnect();
    }
  });
}
testExpress();
