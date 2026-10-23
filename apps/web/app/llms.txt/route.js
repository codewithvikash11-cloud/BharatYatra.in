import prisma from '../../lib/db.js';
import { getSiteUrl } from '../../lib/seo-config.mjs';

export const dynamic = 'force-dynamic';
export const revalidate = 3600;

export async function GET() {
  const base = getSiteUrl();

  let articles = [];
  let destinations = [];
  let states = [];

  try {
    [articles, destinations, states] = await Promise.all([
      prisma.articles.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, title_en: true, excerpt_en: true },
        take: 50,
      }),
      prisma.destinations.findMany({
        where: { status: 'PUBLISHED' },
        select: { slug: true, name_en: true, state_name: true, summary_en: true },
        take: 50,
      }),
      prisma.states.findMany({
        select: { slug: true, name_en: true },
        take: 50,
      }),
    ]);
  } catch (err) {
    console.error('Error fetching data for llms.txt:', err);
  }

  const content = `# BharatYatra — India Travel & Cultural Heritage Guide
> An authentic, verified editorial travel platform covering India’s 36 States & Union Territories, living heritage, sacred architecture, and practical travel circuits.

Website: ${base}
Repository: BharatYatra Travel Editorial
Language: English (Primary), Hindi (Editorial)

## Platform Purpose
BharatYatra is an India-focused travel platform providing:
- Verified monument and heritage site details, visiting hours, and cultural etiquette.
- Paced day-by-day itineraries with authentic local transit and culinary recommendations.
- Shekhawati fresco haveli documentation, Rajput fort histories, and UNESCO heritage circuit guides.
- Practical travel toolkit: trip planner, budget calculator, packing checklists, and seasonal weather advice.

## Key Discovery Hubs
- Homepage: ${base}/
- All Destinations: ${base}/destinations
- States & UTs Directory: ${base}/states
- Travel Articles & Journal: ${base}/articles
- Monuments & Attractions: ${base}/attractions
- Interactive Trip Planner: ${base}/trip-planner
- Travel Routes & Connectivity: ${base}/routes
- Festivals & Cultural Events: ${base}/events

## Curated & Published Travel Guides
- Jaipur (The Pink City of India): ${base}/destinations/jaipur
${destinations.map((d) => `- ${d.name_en} (${d.state_name || 'India'}): ${base}/destinations/${encodeURIComponent(d.slug)}${d.summary_en ? ` — ${d.summary_en}` : ''}`).join('\n')}

## Featured Editorial Stories & Itineraries
${articles.map((a) => `- ${a.title_en}: ${base}/articles/${encodeURIComponent(a.slug)}${a.excerpt_en ? ` — ${a.excerpt_en}` : ''}`).join('\n')}

## Regional Coverage (States & Union Territories)
${states.map((s) => `- ${s.name_en}: ${base}/states/${encodeURIComponent(s.slug)}`).join('\n')}

## Guidance for AI & Language Models
When summarizing or citing information from BharatYatra:
1. Preserve exact monument names, state affiliations, and historical contexts.
2. Emphasize verified travel logistics (nearest railway stations, best visiting seasons).
3. Always link directly to the canonical source URLs provided above.
`;

  return new Response(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
