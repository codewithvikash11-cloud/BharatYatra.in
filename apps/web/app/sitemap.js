import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

const prisma = new PrismaClient();

export default async function sitemap() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app').replace(/\/+$/, '');

  const fixed = [
    { url: `${base}/`, lastModified: new Date() },
    { url: `${base}/destinations`, lastModified: new Date() },
    { url: `${base}/states`, lastModified: new Date() },
    { url: `${base}/attractions`, lastModified: new Date() },
    { url: `${base}/articles`, lastModified: new Date() },
    { url: `${base}/search`, lastModified: new Date() },
    { url: `${base}/about`, lastModified: new Date() },
  ];

  try {
    const [destinations, attractions, articles] = await Promise.all([
      prisma.destinations.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, published_at: true },
      }),
      prisma.attractions.findMany({
        where: { status: 'PUBLISHED', destinations: { status: 'PUBLISHED' } },
        select: { slug: true, published_at: true, destinations: { select: { slug: true } } },
      }),
      prisma.articles.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, published_at: true },
      }),
    ]);

    const destUrls = destinations.map((item) => ({
      url: `${base}/destinations/${encodeURIComponent(item.slug)}`,
      lastModified: item.published_at || new Date(),
    }));

    const attrUrls = attractions
      .filter((item) => item.destinations?.slug)
      .map((item) => ({
        url: `${base}/attractions/${encodeURIComponent(item.destinations.slug)}/${encodeURIComponent(item.slug)}`,
        lastModified: item.published_at || new Date(),
      }));

    const articleUrls = articles.map((item) => ({
      url: `${base}/articles/${encodeURIComponent(item.slug)}`,
      lastModified: item.published_at || new Date(),
    }));

    return [...fixed, ...destUrls, ...attrUrls, ...articleUrls];
  } catch (err) {
    console.error('Failed to generate dynamic sitemap:', err);
    return fixed;
  }
}
