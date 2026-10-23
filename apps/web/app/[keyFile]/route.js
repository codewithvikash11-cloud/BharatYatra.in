import { getIndexNowKey, getSeoConfig } from '../../lib/seo-config.mjs';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const { keyFile } = await params;
  const indexNowKey = getIndexNowKey();
  const config = getSeoConfig();

  // 1. IndexNow Key File Verification (e.g. /8f9b2d4c6e1a3b5c7d9e0f2a4b6c8e1a.txt)
  if (keyFile === `${indexNowKey}.txt`) {
    return new Response(indexNowKey, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  }

  // 2. Google Search Console HTML File Verification (e.g. /google[token].html)
  if (keyFile.startsWith('google') && keyFile.endsWith('.html')) {
    const token = keyFile.replace(/\.html$/, '');
    return new Response(`google-site-verification: ${keyFile}`, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  }

  // 3. Fallback: Not found
  return new Response('Not Found', { status: 404 });
}
