import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '../../../lib/content-api.mjs';
import { MarkdownContent } from '../../../lib/markdown.js';
import prisma from '../../../lib/db.js';
import { ContentTypeBadge, ContentTypeTemplateExtras } from '../../../components/article-templates.js';

export const dynamic = 'force-dynamic';

const curatedEditorialArticles = {
  'best-time-to-visit-rajasthan': {
    slug: 'best-time-to-visit-rajasthan',
    title_en: 'Best Time to Visit Rajasthan: A Complete Seasonal Guide',
    excerpt_en: 'From cool winter mornings wandering Amer Fort to festive autumn dusks and monsoon palace reflections across Udaipur lakes.',
    category: 'Travel Tips',
    cover_image_url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Sunset over Hawa Mahal in Jaipur Rajasthan',
    author_name: 'BharatYatra Editorial',
    published_at: '2024-11-15T10:00:00.000Z',
    body_en: `## Exploring the Desert State in Every Season\n\nRajasthan's climate is characterized by significant seasonal variations. To experience royal fort ramparts, colourful street bazaars, and Thar Desert dunes in total comfort, timing your journey is paramount.\n\n### Winter (October to March) — The Golden Window\nWinter brings crisp morning chills followed by pleasant, sun-drenched afternoons hovering between 10°C and 25°C. This is the prime window for exploring monumental hillside citadels like Amer Fort, Mehrangarh, and Chittorgarh without sweltering heat.\n\nMajor cultural highlights during this window include the **Pushkar Camel Fair** in November, the **Jaipur Literature Festival** in January, and the **Desert Festival** in Jaisalmer in February.\n\n### Monsoon (July to September) — Lakes & Green Aravallis\nThe arrival of the southwest monsoon transforms southern Rajasthan into an emerald haven. The Aravalli Hills turn vibrant green, and the historic lake basins of Udaipur—Lake Pichola and Fateh Sagar—fill to capacity.\n\n### Summer (April to June) — Desert Extremes\nSummer temperatures regularly exceed 42°C across Bikaner, Jodhpur, and Jaisalmer. If traveling during these months, restrict sightseeing to early morning hours (6:00 AM – 9:30 AM).`,
  },
  'complete-guide-to-char-dham-yatra': {
    slug: 'complete-guide-to-char-dham-yatra',
    title_en: 'Complete Guide to the Sacred Char Dham Yatra in Uttarakhand',
    excerpt_en: 'Everything you need to know about preparing for the sacred Himalayan pilgrimage to Yamunotri, Gangotri, Kedarnath, and Badrinath.',
    category: 'Heritage & Culture',
    cover_image_url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Kedarnath temple nestled amidst Himalayan peaks',
    author_name: 'Pooja Bhattacharya',
    published_at: '2024-10-20T10:00:00.000Z',
    body_en: `## The Holy Himalayan Circuit of Uttarakhand\n\nThe Char Dham Yatra is one of the most revered spiritual journeys in the Hindu tradition, nestled high in the Garhwal Himalayas. The four sacred shrines open each year around Akshaya Tritiya in May and close shortly after Diwali in November.\n\n### Order of the Sacred Circuit\n1. **Yamunotri:** Dedicated to Goddess Yamuna.\n2. **Gangotri:** The seat of Goddess Ganga along the Bhagirathi River.\n3. **Kedarnath:** One of the twelve sacred Jyotirlingas, located at 3,583 meters.\n4. **Badrinath:** The abode of Lord Vishnu along the Alaknanda River.\n\n### Essential Preparation\nMandatory biometric registration is required via the Uttarakhand Tourism portal. Kedarnath involves a demanding 16–18 km trek from Gaurikund; allow acclimatization days in Rishikesh.`,
  },
  'top-10-hill-stations-in-india': {
    slug: 'top-10-hill-stations-in-india',
    title_en: 'Top 10 Hill Stations in India: Majestic Mountain Retreats',
    excerpt_en: 'From the pine-scented ridges of Himachal Pradesh to the tea-carpeted slopes of the Western Ghats.',
    category: 'Sightseeing',
    cover_image_url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Snow-capped peaks overlooking Himalayan mountain valley',
    author_name: 'Arjun Sen',
    published_at: '2024-09-12T10:00:00.000Z',
    body_en: `## Discover India's Cool Mountain Havens\n\nFrom colonial summer retreats in the north to mist-wrapped Nilgiris in the south, India's hill stations offer respite, hiking trails, and magnificent biodiversity.\n\n### 1. Manali, Himachal Pradesh\nGateway to Solang Valley, Rohtang Pass, and high-altitude trans-Himalayan desert routes.\n\n### 2. Shimla, Himachal Pradesh\nFormer summer capital known for the UNESCO toy train, Mall Road, and Christ Church.\n\n### 3. Munnar, Kerala\nEndless rolling green tea plantations and mist-covered Western Ghat peaks.\n\n### 4. Darjeeling, West Bengal\nFamed black tea gardens, Kanchenjunga sunrise vistas, and the Himalayan Railway.`,
  },
  'india-travel-tips-for-first-timers': {
    slug: 'india-travel-tips-for-first-timers',
    title_en: 'India Travel Tips for First-Timers: The Essential Primer',
    excerpt_en: 'Practical, respectful, and proven guidance to help you navigate transport, digital payments, cultural etiquette, and daily travel smoothly.',
    category: 'Travel Tips',
    cover_image_url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Courtyard of royal Indian palace with arches',
    author_name: 'BharatYatra Editorial',
    published_at: '2024-08-01T10:00:00.000Z',
    body_en: `## Welcome to Incredible India\n\nTraveling in India is an exhilarating sensory journey. A few practical guidelines ensure your travel is comfortable, respectful, and memorable.\n\n### 1. Embrace Digital Payments (UPI)\nQR codes are accepted everywhere from local tea stalls to luxury hotels. Tourists can configure UPI One World at international airport arrival terminals.\n\n### 2. Water & Dining Wisdom\nAlways drink sealed mineral water or carry a filter bottle. Choose bustling family-frequented eateries for hot, freshly prepared cuisine.\n\n### 3. Sacred Spaces Etiquette\nAlways remove footwear outside temple gates. Dress modestly with shoulders and knees covered, and carry a light cotton scarf.`,
  },
  'famous-food-dishes-from-different-states': {
    slug: 'famous-food-dishes-from-different-states',
    title_en: 'Famous Food Dishes from Different States: An Indian Culinary Tour',
    excerpt_en: 'A mouthwatering culinary expedition through the regional flavours, heritage spices, and iconic recipes of India.',
    category: 'Food & Culture',
    cover_image_url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Spread of authentic Indian regional food in brass bowls',
    author_name: 'Chef Rajesh Mehra',
    published_at: '2024-07-15T10:00:00.000Z',
    body_en: `## A Journey Across India's Regional Kitchens\n\nIndian cuisine is as diverse as its geography. Each state features distinct cooking techniques, spices, and grains.\n\n### Rajasthan: Dal Baati Churma & Laal Maas\nBaked wheat dough balls in spiced lentil curry with sweetened churma, alongside fiery mutton curry cooked with Mathania chillies.\n\n### Punjab: Makki di Roti & Sarson da Saag\nSlow-cooked winter mustard greens with rustic maize flatbread and churned white butter.\n\n### Kerala: Appam & Malabar Fish Curry\nLacy fermented rice pancakes paired with creamy coconut milk stew or kokum fish curry.\n\n### West Bengal: Shorshe Ilish & Sandesh\nHilsa fish in pungent mustard gravy followed by artisanal cottage cheese confections.`,
  },
  'hidden-gems-in-north-east-india': {
    slug: 'hidden-gems-in-north-east-india',
    title_en: 'Hidden Gems in North East India: Unspoiled Natural Wonders',
    excerpt_en: 'From the bio-engineered living root bridges of Meghalaya to the serene monasteries of Tawang and the floating islands of Loktak Lake.',
    category: 'Heritage & Culture',
    cover_image_url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1200&q=80',
    cover_image_alt: 'Crystal clear river flowing through lush hills in Northeast India',
    author_name: 'Denzil Nongrum',
    published_at: '2024-06-10T10:00:00.000Z',
    body_en: `## Untouched Frontiers of the Seven Sisters\n\nNortheast India remains one of the world's most pristine bio-diverse landscapes.\n\n### 1. Living Root Bridges of Nongriat, Meghalaya\nCenturies-old bio-engineering by Khasi tribes guiding rubber tree roots across fast-flowing mountain rivers.\n\n### 2. Loktak Lake & Keibul Lamjao, Manipur\nThe world's only floating national park, home to the endangered Sangai dancing deer.\n\n### 3. Tawang Monastery, Arunachal Pradesh\nPerched at 3,048 meters, the monumental 17th-century Himalayan Buddhist monastery.\n\n### 4. Majuli Island, Assam\nThe world's largest river island on the Brahmaputra, famed for Vaishnavite monastic culture and traditional bamboo mask artisans.`,
  },
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let item = null;
  const result = await getContent('articles', [slug]);
  if (result.state === 'success' && result.payload?.data) {
    item = result.payload.data;
  }
  if (!item && curatedEditorialArticles[slug]) {
    item = curatedEditorialArticles[slug];
  }
  if (!item) {
    try {
      item = await prisma.articles.findFirst({ where: { slug, status: 'PUBLISHED' } });
    } catch {}
  }
  if (!item) {
    return { title: 'Article Not Found | BharatYatra' };
  }
  const title = item.seo_title_en || item.title_en;
  const description = item.seo_description_en || item.excerpt_en || item.title_en;
  const canonicalUrl = item.canonical_url || `https://bharat-yatra-in.vercel.app/articles/${encodeURIComponent(slug)}`;
  const coverUrl = item.cover_image_url || '/hero.jpg';

  return {
    title: `${title} | BharatYatra Travel Journal`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: item.published_at,
      authors: [item.author_name || 'BharatYatra Editorial'],
      siteName: 'BharatYatra',
      images: [{ url: coverUrl, width: 1200, height: 630, alt: item.cover_image_alt || title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  let item = null;

  // 1. Check API first
  const result = await getContent('articles', [slug]);
  if (result.state === 'success' && result.payload?.data) {
    item = result.payload.data;
  }

  // 2. Direct database query fallback
  if (!item) {
    try {
      const dbArticle = await prisma.articles.findFirst({
        where: { slug, status: 'PUBLISHED' },
        include: {
          destinations: { select: { slug: true, name_en: true, state_name: true } },
          states: { select: { slug: true, name_en: true } },
        },
      });
      if (dbArticle) item = dbArticle;
    } catch {}
  }

  // 3. Curated editorial articles dictionary fallback
  if (!item && curatedEditorialArticles[slug]) {
    item = curatedEditorialArticles[slug];
  }

  if (!item) {
    notFound();
  }

  // Fetch 2-3 related published articles for internal crawlable links
  let relatedArticles = [];
  try {
    relatedArticles = await prisma.articles.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: slug },
      },
      take: 3,
      orderBy: { published_at: 'desc' },
      select: {
        slug: true,
        title_en: true,
        excerpt_en: true,
        category: true,
        cover_image_url: true,
        cover_image_alt: true,
      },
    });
  } catch {}

  const coverUrl = item.cover_image_url || '/hero.jpg';
  const wordCount = (item.body_en || item.excerpt_en || '').split(/\s+/).length;
  const readingTime = Math.max(3, Math.ceil(wordCount / 200));
  const publishDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recent';

  const destination = item.destinations;
  const state = item.states;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title_en,
    description: item.excerpt_en || item.seo_description_en,
    image: coverUrl,
    datePublished: item.published_at,
    author: {
      '@type': 'Person',
      name: item.author_name || 'BharatYatra Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BharatYatra',
      url: 'https://bharat-yatra-in.vercel.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bharat-yatra-in.vercel.app/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bharat-yatra-in.vercel.app/articles/${slug}`,
    },
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bharat-yatra-in.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: 'https://bharat-yatra-in.vercel.app/articles' },
      { '@type': 'ListItem', position: 3, name: item.category || 'Culture', item: `https://bharat-yatra-in.vercel.app/articles` },
      { '@type': 'ListItem', position: 4, name: item.title_en, item: `https://bharat-yatra-in.vercel.app/articles/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />

      <main className="article-page-root">
        {/* ====================================================
            1. BREADCRUMBS & ARTICLE HEADER
            ==================================================== */}
        <div className="page-shell" style={{ maxWidth: '860px', paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
          <nav className="breadcrumb-nav" aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
              <li>/</li>
              <li><Link href="/articles" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Travel Guides</Link></li>
              {item.category && (
                <>
                  <li>/</li>
                  <li><Link href={`/articles?category=${encodeURIComponent(item.category)}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{item.category}</Link></li>
                </>
              )}
              <li>/</li>
              <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>{item.title_en}</li>
            </ol>
          </nav>

          {/* Category & Location Badges */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {item.category && <ContentTypeBadge category={item.category} />}
            {destination && (
              <Link
                href={`/destinations/${destination.slug}`}
                style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal-deep)', background: 'var(--cream)', border: '1px solid var(--border-color)', padding: '0.25rem 0.75rem', borderRadius: '999px', textDecoration: 'none' }}
              >
                📍 {destination.name_en}
              </Link>
            )}
            {state && (
              <Link
                href={`/states/${state.slug}`}
                style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                {state.name_en}
              </Link>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', lineHeight: 1.25, margin: '0 0 1.25rem 0' }}>
            {item.title_en}
          </h1>

          {item.excerpt_en && (
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.75rem 0', fontStyle: 'italic' }}>
              {item.excerpt_en}
            </p>
          )}

          {/* Byline / Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0', margin: '1.5rem 0 2rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--teal-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFDF8', fontWeight: 700, fontSize: '0.95rem' }}>
                BY
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{item.author_name || 'BharatYatra Editorial'}</strong>
                <span style={{ fontSize: '0.82rem' }}>Published {publishDate}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem' }}>
              <span>⏱ {readingTime} min read</span>
              <span>📖 English Edition</span>
            </div>
          </div>
        </div>

        {/* ====================================================
            2. COVER IMAGE
            ==================================================== */}
        <div className="page-shell" style={{ maxWidth: '1040px', marginBottom: '2.5rem' }}>
          <figure style={{ margin: 0 }}>
            <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
              <img
                src={coverUrl}
                alt={item.cover_image_alt || item.title_en}
                fetchPriority="high"
                decoding="async"
                width="1200"
                height="675"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {item.cover_image_alt && (
              <figcaption style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.6rem', fontStyle: 'italic' }}>
                {item.cover_image_alt}
              </figcaption>
            )}
          </figure>
        </div>

        {/* ====================================================
            3. ARTICLE BODY (MARKDOWN PROSE)
            ==================================================== */}
        <div className="page-shell" style={{ maxWidth: '820px', paddingBottom: '3rem' }}>
          <article className="article-prose-container" style={{ fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--text-primary)' }}>
            <MarkdownContent content={item.body_en} />
          </article>

          {/* Content-Aware Specialized Template Extras */}
          <ContentTypeTemplateExtras
            category={item.category}
            destination={destination}
            state={state}
            title={item.title_en}
          />

          {/* Related Destination Banner */}
          {destination && (
            <div style={{ marginTop: '3.5rem', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--cream)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <p className="section-eyebrow" style={{ margin: 0 }}>EXPLORE THE DESTINATION</p>
                <h3 style={{ margin: '0.35rem 0 0 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.4rem' }}>
                  Planning a journey to {destination.name_en}?
                </h3>
                <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Explore the latest verified places, practical guidance, and editorial stories for {destination.name_en}.
                </p>
              </div>
              <Link href={`/destinations/${destination.slug}`} className="btn-gold-pill" style={{ textDecoration: 'none' }}>
                View {destination.name_en} Guide →
              </Link>
            </div>
          )}
        </div>

        {/* ====================================================
            4. MORE STORIES FROM BHARATYATRA (INTERNAL LINKS)
            ==================================================== */}
        {relatedArticles.length > 0 && (
          <section className="content-section shaded" style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
            <div className="page-shell" style={{ maxWidth: '1040px' }}>
              <div className="section-heading-row" style={{ marginBottom: '2rem' }}>
                <div className="section-title-group">
                  <p className="section-eyebrow">CONTINUE READING</p>
                  <h2 className="section-main-title">
                    More stories for<br />
                    <span className="serif-italic-gold">the road.</span>
                  </h2>
                </div>
                <Link href="/articles" className="section-link-more">
                  All articles <span>→</span>
                </Link>
              </div>

              <div className="article-related-grid">
                {relatedArticles.map((rel) => (
                  <Link key={rel.slug} href={`/articles/${rel.slug}`} className="story-card-item" style={{ textDecoration: 'none' }}>
                    <div className="story-card-media" style={{ height: '180px' }}>
                      <img
                        src={rel.cover_image_url || '/hero.jpg'}
                        alt={rel.cover_image_alt || rel.title_en}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="360"
                      />
                    </div>
                    <div className="story-card-body">
                      <p className="story-card-kicker">{rel.category || 'TRAVEL GUIDE'}</p>
                      <h3 className="story-card-title" style={{ fontSize: '1.15rem' }}>
                        {rel.title_en}
                      </h3>
                      {rel.excerpt_en && (
                        <p className="story-card-excerpt" style={{ fontSize: '0.88rem' }}>
                          {rel.excerpt_en}
                        </p>
                      )}
                      <span className="story-card-link-cta">
                        Read story <span>→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
