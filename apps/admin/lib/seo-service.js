import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const DATA_DIR = path.resolve(process.cwd(), 'data');
const SETTINGS_FILE = path.resolve(DATA_DIR, 'seo-settings.json');
const HEALTH_LOG_FILE = path.resolve(DATA_DIR, 'seo-health-log.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

export function getProductionSiteUrl() {
  const url = process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app';
  return url.replace(/\/+$/, '');
}

export function getGlobalSeoSettings() {
  ensureDataDir();
  const siteUrl = getProductionSiteUrl();

  const defaults = {
    websiteName: 'BharatYatra',
    productionSiteUrl: siteUrl,
    defaultSeoTitle: 'BharatYatra — India, through every journey',
    defaultSeoDescription:
      'Discover authentic destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India.',
    defaultSocialImage: `${siteUrl}/image.png`,
    googleVerificationToken:
      process.env.GOOGLE_SITE_VERIFICATION ||
      process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
      '',
    bingVerificationToken:
      process.env.BING_SITE_VERIFICATION ||
      process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ||
      '',
    indexNowKey:
      process.env.INDEXNOW_KEY || '8f9b2d4c6e1a3b5c7d9e0f2a4b6c8e1a',
    twitterHandle: '@bharatyatra',
    sitemapUrl: `${siteUrl}/sitemap.xml`,
    robotsUrl: `${siteUrl}/robots.txt`,
    llmsTxtUrl: `${siteUrl}/llms.txt`,
    rssFeedUrl: `${siteUrl}/feed.xml`,
  };

  if (!fs.existsSync(SETTINGS_FILE)) {
    return defaults;
  }

  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function saveGlobalSeoSettings(newSettings) {
  ensureDataDir();
  const current = getGlobalSeoSettings();
  const updated = {
    ...current,
    ...newSettings,
    updatedAt: new Date().toISOString(),
  };
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export function getLastIndexNowLog() {
  ensureDataDir();
  if (!fs.existsSync(HEALTH_LOG_FILE)) {
    return {
      lastSubmission: null,
      status: null,
      submittedUrlsCount: 0,
      recentSubmissions: [],
    };
  }

  try {
    return JSON.parse(fs.readFileSync(HEALTH_LOG_FILE, 'utf-8'));
  } catch {
    return {
      lastSubmission: null,
      status: null,
      submittedUrlsCount: 0,
      recentSubmissions: [],
    };
  }
}

export function logIndexNowSubmission(entry) {
  ensureDataDir();
  const current = getLastIndexNowLog();
  const updated = {
    lastSubmission: entry.timestamp || new Date().toISOString(),
    status: entry.status,
    message: entry.message,
    submittedUrlsCount: entry.count || 0,
    recentSubmissions: [entry, ...(current.recentSubmissions || [])].slice(0, 10),
  };
  fs.writeFileSync(HEALTH_LOG_FILE, JSON.stringify(updated, null, 2), 'utf-8');
  return updated;
}

export async function submitToIndexNow(urls) {
  const settings = getGlobalSeoSettings();
  const siteUrl = settings.productionSiteUrl;
  const host = new URL(siteUrl).host;
  const key = settings.indexNowKey;

  if (!key) {
    return { success: false, status: 400, message: 'IndexNow key not configured' };
  }

  const urlList = (Array.isArray(urls) ? urls : [urls])
    .filter((u) => typeof u === 'string' && u.trim().length > 0)
    .map((u) => (u.startsWith('http') ? u : `${siteUrl}${u.startsWith('/') ? '' : '/'}${u}`));

  if (urlList.length === 0) {
    return { success: false, status: 400, message: 'No valid canonical URLs provided' };
  }

  const payload = {
    host,
    key,
    keyLocation: `${siteUrl}/${key}.txt`,
    urlList,
  };

  try {
    const response = await fetch('https://api.indexnow.org/indexnow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'User-Agent': 'BharatYatra-IndexNow-Admin/1.0',
      },
      body: JSON.stringify(payload),
    });

    const isSuccess = response.status === 200 || response.status === 202;
    const entry = {
      timestamp: new Date().toISOString(),
      status: response.status,
      count: urlList.length,
      message: isSuccess
        ? `Successfully submitted ${urlList.length} URL(s) to IndexNow (HTTP ${response.status})`
        : `IndexNow responded with status ${response.status}`,
      sampleUrl: urlList[0],
    };

    logIndexNowSubmission(entry);
    return { success: isSuccess, ...entry };
  } catch (err) {
    const entry = {
      timestamp: new Date().toISOString(),
      status: 500,
      count: urlList.length,
      message: `Failed to connect to IndexNow: ${err.message}`,
    };
    logIndexNowSubmission(entry);
    return { success: false, ...entry };
  }
}

export async function auditSeoHealth() {
  const siteUrl = getProductionSiteUrl();

  const [articles, destinations, states, attractions] = await Promise.all([
    prisma.articles.findMany({
      select: {
        id: true,
        slug: true,
        title_en: true,
        excerpt_en: true,
        seo_title_en: true,
        seo_description_en: true,
        canonical_url: true,
        cover_image_url: true,
        cover_image_alt: true,
        status: true,
        updated_at: true,
        published_at: true,
      },
    }),
    prisma.destinations.findMany({
      select: {
        id: true,
        slug: true,
        name_en: true,
        summary_en: true,
        state_name: true,
        latitude: true,
        longitude: true,
        status: true,
        updated_at: true,
        published_at: true,
      },
    }),
    prisma.states.findMany({
      select: {
        id: true,
        slug: true,
        name_en: true,
        description_en: true,
        status: true,
      },
    }),
    prisma.attractions.findMany({
      select: {
        id: true,
        slug: true,
        name_en: true,
        description_en: true,
        status: true,
      },
    }),
  ]);

  const publishedArticles = articles.filter((a) => a.status === 'PUBLISHED');
  const draftArticles = articles.filter((a) => a.status !== 'PUBLISHED');
  const publishedDestinations = destinations.filter((d) => d.status === 'PUBLISHED');

  const articleAudits = publishedArticles.map((art) => {
    const issues = [];
    const title = art.seo_title_en || art.title_en || '';
    const desc = art.seo_description_en || art.excerpt_en || '';

    if (!art.seo_title_en) {
      issues.push({ type: 'warning', text: 'Using fallback title; custom SEO title recommended' });
    }
    if (title.length < 30) {
      issues.push({ type: 'warning', text: `Title is short (${title.length} chars, 40-60 recommended)` });
    } else if (title.length > 60) {
      issues.push({ type: 'warning', text: `Title may truncate (${title.length} chars, max 60 recommended)` });
    }

    if (!art.seo_description_en && !art.excerpt_en) {
      issues.push({ type: 'error', text: 'Missing meta description and excerpt' });
    } else if (desc.length < 100) {
      issues.push({ type: 'warning', text: `Description is short (${desc.length} chars, 120-160 recommended)` });
    } else if (desc.length > 165) {
      issues.push({ type: 'warning', text: `Description may truncate (${desc.length} chars, max 160 recommended)` });
    }

    if (!art.cover_image_url) {
      issues.push({ type: 'error', text: 'Missing social share image (og:image)' });
    } else if (!art.cover_image_alt) {
      issues.push({ type: 'warning', text: 'Cover image is missing alt text' });
    }

    if (art.canonical_url) {
      try {
        new URL(art.canonical_url);
      } catch {
        issues.push({ type: 'error', text: 'Invalid canonical URL override format' });
      }
    }

    const canonicalUrl = art.canonical_url || `${siteUrl}/articles/${art.slug}`;
    const score = Math.max(20, 100 - issues.length * 20);

    return {
      id: art.id,
      slug: art.slug,
      title,
      desc,
      canonicalUrl,
      score,
      issues,
      status: art.status,
      updatedAt: art.updated_at,
    };
  });

  const destinationAudits = publishedDestinations.map((dest) => {
    const issues = [];
    if (!dest.summary_en) {
      issues.push({ type: 'warning', text: 'Missing summary description' });
    }
    if (!dest.latitude || !dest.longitude) {
      issues.push({ type: 'warning', text: 'Missing coordinates for map and GeoCoordinates schema' });
    }

    const canonicalUrl = `${siteUrl}/destinations/${dest.slug}`;
    const score = Math.max(30, 100 - issues.length * 25);

    return {
      id: dest.id,
      slug: dest.slug,
      name: dest.name_en,
      stateName: dest.state_name || 'India',
      canonicalUrl,
      score,
      issues,
      status: dest.status,
    };
  });

  // Duplicate slug check across all articles
  const slugCounts = {};
  articles.forEach((a) => {
    slugCounts[a.slug] = (slugCounts[a.slug] || 0) + 1;
  });
  const duplicateSlugs = Object.keys(slugCounts).filter((s) => slugCounts[s] > 1);

  return {
    summary: {
      totalPublishedArticles: publishedArticles.length,
      totalDraftArticles: draftArticles.length,
      totalPublishedDestinations: publishedDestinations.length,
      totalStates: states.length,
      totalPublishedAttractions: attractions.filter((att) => att.status === 'PUBLISHED').length,
      duplicateSlugsCount: duplicateSlugs.length,
      duplicateSlugs,
      estimatedSitemapUrls:
        15 + 1 + states.length + publishedDestinations.length + publishedArticles.length + 5,
    },
    articleAudits,
    destinationAudits,
  };
}
