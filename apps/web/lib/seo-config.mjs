import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '..', '..', '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export function getSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app';
  return url.replace(/\/+$/, '');
}

export function getIndexNowKey() {
  return process.env.INDEXNOW_KEY || '8f9b2d4c6e1a3b5c7d9e0f2a4b6c8e1a';
}

export function getSeoConfig() {
  const siteUrl = getSiteUrl();
  return {
    siteName: 'BharatYatra',
    siteUrl,
    defaultTitle: 'BharatYatra — India, through every journey',
    defaultDescription:
      'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
    defaultImage: `${siteUrl}/image.png`,
    twitterHandle: '@bharatyatra',
    googleVerification:
      process.env.GOOGLE_SITE_VERIFICATION ||
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      '',
    bingVerification:
      process.env.BING_SITE_VERIFICATION ||
      process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
      '',
    indexNowKey: getIndexNowKey(),
  };
}

export async function submitToIndexNow(urls, { key, siteUrl } = {}) {
  const resolvedSiteUrl = siteUrl || getSiteUrl();
  const host = new URL(resolvedSiteUrl).host;
  const apiKey = key || getIndexNowKey();

  if (!apiKey) {
    return { success: false, status: 400, message: 'IndexNow key not configured' };
  }

  // Sanitize and validate URLs
  const urlList = (Array.isArray(urls) ? urls : [urls])
    .filter((u) => typeof u === 'string' && u.trim().length > 0)
    .map((u) => (u.startsWith('http') ? u : `${resolvedSiteUrl}${u.startsWith('/') ? '' : '/'}${u}`));

  if (urlList.length === 0) {
    return { success: false, status: 400, message: 'No valid URLs provided' };
  }

  const payload = {
    host,
    key: apiKey,
    keyLocation: `${resolvedSiteUrl}/${apiKey}.txt`,
    urlList,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'BharatYatra-IndexNow-Agent/1.0',
      },
      body: JSON.stringify(payload),
    });

    const isSuccess = response.status === 200 || response.status === 202;
    console.log(`[IndexNow] Submitted ${urlList.length} URL(s) for host ${host}. HTTP status: ${response.status}`);

    return {
      success: isSuccess,
      status: response.status,
      count: urlList.length,
      timestamp: new Date().toISOString(),
    };
  } catch (err) {
    console.error(`[IndexNow] Error dispatching submission:`, err.message);
    return {
      success: false,
      status: 500,
      error: err.message,
      timestamp: new Date().toISOString(),
    };
  }
}
