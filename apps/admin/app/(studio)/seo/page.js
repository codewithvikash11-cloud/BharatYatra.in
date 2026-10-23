import { getAdminSession } from '../../../lib/admin-session.js';
import {
  getGlobalSeoSettings,
  auditSeoHealth,
  getLastIndexNowLog,
} from '../../../lib/seo-service.js';
import SeoManagerClient from './seo-manager-client.js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: 'SEO & Indexing Management | BharatYatra Content Studio',
};

export default async function SeoManagerPage() {
  const session = await getAdminSession();
  if (!session) {
    throw new Error('Unauthorized');
  }

  const [settings, audit, log] = await Promise.all([
    getGlobalSeoSettings(),
    auditSeoHealth(),
    getLastIndexNowLog(),
  ]);

  return (
    <SeoManagerClient
      initialSettings={settings}
      initialAudit={audit}
      initialLog={log}
    />
  );
}
