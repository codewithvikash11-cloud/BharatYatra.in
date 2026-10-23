import prisma from '../../lib/db.js';
import { getSiteUrl } from '../../lib/seo-config.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

function escapeXml(unsafe) {
  return String(unsafe || '')
    .replace(/[<>&'"]/g, (c) => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case '\'': return '&apos;';
        case '"': return '&quot;';
      }
    });
}

export async function GET() {
  const base = getSiteUrl();

  let articles = [];
  try {
    articles = await prisma.articles.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { published_at: 'desc' },
      take: 30,
      select: {
        slug: true,
        title_en: true,
        excerpt_en: true,
        author_name: true,
        category: true,
        published_at: true,
        cover_image_url: true,
      },
    });
  } catch (err) {
    console.error('Error fetching articles for RSS feed:', err);
  }

  const itemsXml = articles
    .map((item) => {
      const url = `${base}/articles/${encodeURIComponent(item.slug)}`;
      const pubDate = (item.published_at ? new Date(item.published_at) : new Date()).toUTCString();
      return `    <item>
      <title>${escapeXml(item.title_en)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(item.excerpt_en || item.title_en)}</description>
      <author>${escapeXml(item.author_name || 'BharatYatra Editorial')}</author>
      <category>${escapeXml(item.category || 'Travel')}</category>
      <pubDate>${pubDate}</pubDate>
      ${item.cover_image_url ? `<enclosure url="${escapeXml(item.cover_image_url)}" type="image/jpeg" length="0" />` : ''}
    </item>`;
    })
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BharatYatra — Travel Journal &amp; Heritage Guides</title>
    <link>${base}</link>
    <description>Authentic destinations, sacred monuments, cultural heritage, and curated travel guides across India.</description>
    <language>en-in</language>
    <atom:link href="${base}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
${itemsXml}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
