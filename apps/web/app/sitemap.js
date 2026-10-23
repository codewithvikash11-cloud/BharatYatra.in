import prisma from '../lib/db.js';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export default async function sitemap() {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app').replace(/\/+$/, '');

  const staticPages = [
    { url: `${base}/`, changeFrequency: 'daily', priority: 1.0, lastModified: new Date() },
    { url: `${base}/destinations`, changeFrequency: 'daily', priority: 0.9, lastModified: new Date() },
    { url: `${base}/states`, changeFrequency: 'weekly', priority: 0.9, lastModified: new Date() },
    { url: `${base}/articles`, changeFrequency: 'daily', priority: 0.9, lastModified: new Date() },
    { url: `${base}/attractions`, changeFrequency: 'weekly', priority: 0.8, lastModified: new Date() },
    { url: `${base}/trip-planner`, changeFrequency: 'monthly', priority: 0.8, lastModified: new Date() },
    { url: `${base}/routes`, changeFrequency: 'monthly', priority: 0.7, lastModified: new Date() },
    { url: `${base}/events`, changeFrequency: 'weekly', priority: 0.7, lastModified: new Date() },
    { url: `${base}/budget-calculator`, changeFrequency: 'monthly', priority: 0.6, lastModified: new Date() },
    { url: `${base}/checklist`, changeFrequency: 'monthly', priority: 0.6, lastModified: new Date() },
    { url: `${base}/weather`, changeFrequency: 'daily', priority: 0.6, lastModified: new Date() },
    { url: `${base}/about`, changeFrequency: 'monthly', priority: 0.5, lastModified: new Date() },
    { url: `${base}/contact`, changeFrequency: 'monthly', priority: 0.5, lastModified: new Date() },
    { url: `${base}/privacy`, changeFrequency: 'yearly', priority: 0.3, lastModified: new Date() },
    { url: `${base}/terms`, changeFrequency: 'yearly', priority: 0.3, lastModified: new Date() },
  ];

  try {
    const [destinations, attractions, articles, statesList] = await Promise.all([
      prisma.destinations.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, published_at: true, updated_at: true },
      }),
      prisma.attractions.findMany({
        where: { status: 'PUBLISHED', destinations: { status: 'PUBLISHED' } },
        select: { slug: true, published_at: true, updated_at: true, destinations: { select: { slug: true } } },
      }),
      prisma.articles.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, published_at: true, updated_at: true, cover_image_url: true },
      }),
      prisma.states.findMany({
        select: { slug: true, updated_at: true },
      }),
    ]);

    const stateUrls = statesList.map((st) => ({
      url: `${base}/states/${encodeURIComponent(st.slug)}`,
      lastModified: st.updated_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

    // Curated Jaipur destination guide
    const curatedJaipur = {
      url: `${base}/destinations/jaipur`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    };

    const destUrls = destinations
      .filter((item) => item.slug !== 'jaipur')
      .map((item) => ({
        url: `${base}/destinations/${encodeURIComponent(item.slug)}`,
        lastModified: item.updated_at || item.published_at || new Date(),
        changeFrequency: 'weekly',
        priority: 0.85,
      }));

    const attrUrls = attractions
      .filter((item) => item.destinations?.slug)
      .map((item) => ({
        url: `${base}/attractions/${encodeURIComponent(item.destinations.slug)}/${encodeURIComponent(item.slug)}`,
        lastModified: item.updated_at || item.published_at || new Date(),
        changeFrequency: 'weekly',
        priority: 0.75,
      }));

    const articleUrls = articles.map((item) => ({
      url: `${base}/articles/${encodeURIComponent(item.slug)}`,
      lastModified: item.updated_at || item.published_at || new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
      ...(item.cover_image_url ? { images: [item.cover_image_url] } : {}),
    }));

    return [...staticPages, curatedJaipur, ...stateUrls, ...destUrls, ...attrUrls, ...articleUrls];
  } catch (err) {
    console.error('Failed to generate dynamic sitemap:', err);
    return staticPages;
  }
}
