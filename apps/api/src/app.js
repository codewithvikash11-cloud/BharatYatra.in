import express from 'express';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import publicContentRouter from './routes/public-content.js';
import { createAdminRouter } from './routes/admin.js';

dotenv.config({ path: fileURLToPath(new URL('../../../.env', import.meta.url)) });

const app = express();
app.disable('x-powered-by');
app.use((_request, response, next) => {
  response.set({
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  });
  next();
});

const adminRateWindows = new Map();
const ADMIN_RATE_WINDOW_MS = 60_000;
const ADMIN_RATE_LIMIT = 120;
app.use('/api/v1/admin', (request, response, next) => {
  const now = Date.now();
  const client = request.socket.remoteAddress || 'unknown';
  let window = adminRateWindows.get(client);
  if (!window || window.resetAt <= now) {
    window = { count: 0, resetAt: now + ADMIN_RATE_WINDOW_MS };
    adminRateWindows.set(client, window);
  }
  if (adminRateWindows.size > 1024) {
    for (const [key, value] of adminRateWindows) if (value.resetAt <= now) adminRateWindows.delete(key);
  }
  response.set('RateLimit-Limit', String(ADMIN_RATE_LIMIT));
  response.set('RateLimit-Remaining', String(Math.max(0, ADMIN_RATE_LIMIT - window.count - 1)));
  response.set('RateLimit-Reset', String(Math.ceil(window.resetAt / 1000)));
  if (window.count >= ADMIN_RATE_LIMIT) {
    response.set('Retry-After', String(Math.max(1, Math.ceil((window.resetAt - now) / 1000))));
    return response.status(429).json({ error: 'Too many admin requests; try again shortly' });
  }
  window.count += 1;
  return next();
});
app.use('/api/v1/admin/media/upload', express.raw({ type: 'application/octet-stream', limit: '5mb' }));
app.use(express.json({ limit: '1mb' }));

app.get('/health', (_request, response) => response.json({ status: 'ok', service: 'bharatyatra-api' }));
app.get('/api/v1', (_request, response) => response.json({ service: 'BharatYatra API', version: 1 }));
app.get('/api/v1/health/database', async (_request, response) => {
  if (!process.env.DATABASE_URL) {
    return response.status(503).json({ status: 'error', database: 'unavailable' });
  }

  try {
    const { prisma } = await import('./db.js');
    await prisma.$queryRaw`SELECT 1`;
    return response.json({ status: 'ok', database: 'connected' });
  } catch {
    console.warn('Database connectivity check failed. Verify DATABASE_URL and DIRECT_URL configuration.');
    return response.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.use('/api/v1', publicContentRouter);
app.use('/api/v1/admin', createAdminRouter());

export default app;
