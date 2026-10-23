import { NextResponse } from 'next/server';
import { getAdminSession } from '../../../../lib/admin-session.js';
import { submitToIndexNow } from '../../../../lib/seo-service.js';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const urls = body.urls || (body.url ? [body.url] : []);
    const result = await submitToIndexNow(urls);
    return NextResponse.json(result);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
