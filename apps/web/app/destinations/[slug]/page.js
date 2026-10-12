import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent, getCollection } from '../../../lib/content-api.mjs';
import { getMapPinUrl } from '../../../lib/map-url.mjs';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getDestinationCover(slug) {
  try {
    const asset = await prisma.media_assets.findUnique({
      where: { storage_path: `content/destinations/${slug}/cover` },
    });
    if (asset?.public_url) return asset.public_url;
  } catch {}
  // Default fallback for Nawalgarh / Shekhawati
  if (slug.includes('nawalgarh')) {
    return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85';
  }
  return 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85';
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getContent('destinations', [slug]);
  if (result.state !== 'success' || !result.payload?.data) {
    return { title: 'Destination Not Found | BharatYatra' };
  }
  const item = result.payload.data;
  const stateStr = item.states?.name_en || item.state_name || 'India';
  const title = `${item.name_en}, ${stateStr} Travel Guide | BharatYatra`;
  const description = item.summary_en || item.description_en?.slice(0, 160) || `Explore ${item.name_en}, ${stateStr} on BharatYatra.`;
  const canonicalUrl = `https://bharat-yatra-in.vercel.app/destinations/${encodeURIComponent(slug)}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'website',
      siteName: 'BharatYatra',
      images: [
        {
          url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
          width: 1200,
          height: 630,
          alt: `${item.name_en} Heritage Architecture`,
        },
      ],
    },
  };
}

export default async function DestinationDetailPage({ params }) {
  const { slug } = await params;
  const result = await getContent('destinations', [slug]);

  if (result.state === 'not-found') notFound();
  if (result.state !== 'success' || !result.payload?.data) {
    // Attempt direct Prisma query as high-availability fallback
    try {
      const dbItem = await prisma.destinations.findFirst({
        where: { slug, status: 'PUBLISHED' },
        include: {
          states: true,
          districts: true,
          attractions: { where: { status: 'PUBLISHED' }, orderBy: { name_en: 'asc' } },
          articles: { where: { status: 'PUBLISHED' }, orderBy: { published_at: 'desc' } },
        },
      });
      if (!dbItem) notFound();
      return renderDestinationView(dbItem);
    } catch {
      notFound();
    }
  }

  const item = result.payload.data;
  return renderDestinationView(item);
}

async function renderDestinationView(item) {
  const coverUrl = await getDestinationCover(item.slug);
  const stateName = item.states?.name_en || item.state_name || 'Rajasthan';
  const districtName = item.districts?.name_en || item.district_name || 'Jhunjhunu';
  const mapUrl = getMapPinUrl(item.latitude, item.longitude);

  // Load related attractions and articles if not included in payload
  let attractions = item.attractions || [];
  let articles = item.articles || [];

  if (attractions.length === 0 || articles.length === 0) {
    try {
      const [dbAttractions, dbArticles] = await Promise.all([
        prisma.attractions.findMany({
          where: { destinations: { slug: item.slug }, status: 'PUBLISHED' },
          orderBy: { name_en: 'asc' },
        }),
        prisma.articles.findMany({
          where: { destinations: { slug: item.slug }, status: 'PUBLISHED' },
          orderBy: { published_at: 'desc' },
        }),
      ]);
      if (attractions.length === 0) attractions = dbAttractions;
      if (articles.length === 0) articles = dbArticles;
    } catch {}
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: item.name_en,
    description: item.summary_en || item.description_en,
    image: coverUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: item.name_en,
      addressRegion: stateName,
      addressCountry: 'IN',
    },
    ...(item.latitude && item.longitude ? {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: item.latitude,
        longitude: item.longitude,
      },
    } : {}),
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bharat-yatra-in.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: 'https://bharat-yatra-in.vercel.app/destinations' },
      { '@type': 'ListItem', position: 3, name: stateName, item: `https://bharat-yatra-in.vercel.app/states/${item.states?.slug || 'rajasthan'}` },
      { '@type': 'ListItem', position: 4, name: item.name_en, item: `https://bharat-yatra-in.vercel.app/destinations/${item.slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />

      <main className="destination-page-root">
        {/* ====================================================
            1. HERO & LOCATION CONTEXT
            ==================================================== */}
        <section
          className="hero-fullbleed destination-hero"
          style={{ backgroundImage: `url(${coverUrl})`, minHeight: '480px' }}
          aria-labelledby="destination-title"
        >
          <div className="hero-fullbleed-overlay" aria-hidden="true" />
          <div className="page-shell hero-fullbleed-content" style={{ maxWidth: '960px' }}>
            {/* Breadcrumb Navigation */}
            <nav className="breadcrumb-nav" aria-label="Breadcrumb" style={{ marginBottom: '1.25rem' }}>
              <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem' }}>
                <li><Link href="/" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Home</Link></li>
                <li>/</li>
                <li><Link href="/destinations" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>Destinations</Link></li>
                <li>/</li>
                <li><Link href={`/states/${item.states?.slug || 'rajasthan'}`} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>{stateName}</Link></li>
                <li>/</li>
                <li style={{ color: 'var(--gold-muted)', fontWeight: 600 }}>{item.name_en}</li>
              </ol>
            </nav>

            <p className="hero-eyebrow-tag" style={{ color: 'var(--gold-muted)' }}>
              HERITAGE DESTINATION · {stateName.toUpperCase()}
            </p>
            <h1 id="destination-title" className="hero-v0-title" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', marginBottom: '1rem' }}>
              {item.name_en}
            </h1>
            {item.summary_en && (
              <p className="hero-v0-desc" style={{ fontSize: '1.15rem', maxWidth: '780px', color: '#F7F3E8', lineHeight: 1.6 }}>
                {item.summary_en}
              </p>
            )}
          </div>
        </section>

        {/* ====================================================
            2. LOCATION CONTEXT STRIP
            ==================================================== */}
        <div style={{ background: 'var(--teal-deep)', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'var(--cream)' }}>
          <div className="page-shell" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', padding: '1rem 0', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', fontSize: '0.9rem' }}>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>State</span>
                <strong>{stateName}</strong>
              </div>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>District</span>
                <strong>{districtName}</strong>
              </div>
              <div>
                <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cultural Circuit</span>
                <strong style={{ color: 'var(--gold-muted)' }}>Shekhawati Fresco Corridor</strong>
              </div>
              {item.best_time_en && (
                <div>
                  <span style={{ color: 'rgba(255,255,255,0.5)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Best Time</span>
                  <strong>{item.best_time_en}</strong>
                </div>
              )}
            </div>

            {mapUrl && (
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold-pill"
                style={{ fontSize: '0.82rem', padding: '0.5rem 1.25rem' }}
              >
                View on Map ↗
              </a>
            )}
          </div>
        </div>

        {/* ====================================================
            3. MAIN CONTENT: OVERVIEW & HERITAGE
            ==================================================== */}
        <section className="page-shell" style={{ padding: '3.5rem 0' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)', gap: '3.5rem', alignItems: 'start' }}>
            <div>
              <div className="section-title-group" style={{ marginBottom: '1.5rem' }}>
                <p className="section-eyebrow">ABOUT THE TOWN</p>
                <h2 className="section-main-title">
                  The Golden City of<br />
                  <span className="serif-italic-gold">Shekhawati.</span>
                </h2>
              </div>

              {item.description_en && (
                <div className="article-body" style={{ fontSize: '1.08rem', lineHeight: 1.8, color: 'var(--text-primary)' }}>
                  <p>{item.description_en}</p>
                </div>
              )}

              {/* Cultural Highlights Box */}
              <div style={{ marginTop: '2.5rem', padding: '1.75rem', borderRadius: 'var(--radius-lg)', background: 'var(--cream)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', marginTop: 0, marginBottom: '0.75rem' }}>
                  Why Nawalgarh is Unique
                </h3>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-primary)', lineHeight: 1.7, fontSize: '0.95rem' }}>
                  <li><strong>Open-Air Art Gallery:</strong> Known for the highest concentration of preserved, ornate merchant havelis in Shekhawati.</li>
                  <li><strong>The Poddar Heritage:</strong> Meticulously curated museums displaying rare dual-culture murals depicting Krishna Leela alongside 19th-century steam trains.</li>
                  <li><strong>Living Bazaars:</strong> Ancient winding market streets filled with brass craftsmen, local sweetshops, and lacquer bangles.</li>
                </ul>
              </div>
            </div>

            {/* Sidebar Quick Info */}
            <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ background: '#FFFDF8', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem', boxShadow: 'var(--shadow-sm)' }}>
                <h3 style={{ fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal-primary)', marginTop: 0, marginBottom: '1rem' }}>
                  Travel Logistics
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.92rem' }}>
                  <div>
                    <strong style={{ color: 'var(--teal-deep)', display: 'block' }}>From Jaipur:</strong>
                    <span style={{ color: 'var(--text-muted)' }}>~140 km (3.5 hrs via NH52)</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--teal-deep)', display: 'block' }}>From Delhi:</strong>
                    <span style={{ color: 'var(--text-muted)' }}>~275 km (6 hrs via Rewari / Jhunjhunu)</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--teal-deep)', display: 'block' }}>Nearest Airport:</strong>
                    <span style={{ color: 'var(--text-muted)' }}>Jaipur International Airport (JAI)</span>
                  </div>
                  <div>
                    <strong style={{ color: 'var(--teal-deep)', display: 'block' }}>Local Transport:</strong>
                    <span style={{ color: 'var(--text-muted)' }}>Heritage walking tours, electric auto-rickshaws</span>
                  </div>
                </div>
              </div>

              {/* Exploration Links */}
              <div style={{ background: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.5rem' }}>
                <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', marginTop: 0, marginBottom: '0.75rem' }}>
                  Related Exploration
                </h4>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem' }}>
                  <li>
                    <Link href={`/states/${item.states?.slug || 'rajasthan'}`} style={{ color: 'var(--teal-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Explore all of {stateName} →
                    </Link>
                  </li>
                  <li>
                    <Link href="/destinations" style={{ color: 'var(--teal-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Browse all Destinations →
                    </Link>
                  </li>
                  <li>
                    <Link href="/articles" style={{ color: 'var(--teal-primary)', fontWeight: 600, textDecoration: 'none' }}>
                      Read Travel Journals →
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </div>
        </section>

        {/* ====================================================
            4. AVAILABLE ATTRACTIONS (REAL DATABASE RECORDS)
            ==================================================== */}
        <section className="content-section shaded" style={{ padding: '4rem 0' }}>
          <div className="page-shell">
            <div className="section-heading-row">
              <div className="section-title-group">
                <p className="section-eyebrow">MUST-VISIT SIGHTS</p>
                <h2 className="section-main-title">
                  Attractions in<br />
                  <span className="serif-italic-gold">{item.name_en}.</span>
                </h2>
              </div>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                {attractions.length} verified historic {attractions.length === 1 ? 'monument' : 'monuments'}
              </span>
            </div>

            {attractions.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.75rem', marginTop: '2rem' }}>
                {attractions.map((attraction) => (
                  <article
                    key={attraction.slug}
                    style={{
                      background: '#FFFDF8',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--border-color)',
                      padding: '1.75rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--gold-muted)', background: 'var(--teal-deep)', padding: '0.2rem 0.6rem', borderRadius: '999px' }}>
                          {attraction.category || 'Historic Monument'}
                        </span>
                      </div>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0 0 0.75rem 0' }}>
                        {attraction.name_en}
                      </h3>
                      {attraction.description_en && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1rem 0' }}>
                          {attraction.description_en}
                        </p>
                      )}
                      {attraction.visiting_hours && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.35rem 0' }}>
                          <strong>Hours:</strong> {attraction.visiting_hours}
                        </p>
                      )}
                      {attraction.entry_fee_note && (
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', margin: '0.35rem 0' }}>
                          <strong>Admission:</strong> {attraction.entry_fee_note}
                        </p>
                      )}
                    </div>

                    <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
                      <Link
                        href={`/attractions/${item.slug}/${attraction.slug}`}
                        style={{ color: 'var(--teal-primary)', fontWeight: 600, fontSize: '0.88rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                      >
                        Explore Monument Details →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="empty-editorial-card">
                <p>No individual attractions currently listed for {item.name_en}. More monuments are being documented by our editors.</p>
              </div>
            )}
          </div>
        </section>

        {/* ====================================================
            5. RELATED PUBLISHED TRAVEL ARTICLES (REAL RECORDS)
            ==================================================== */}
        <section className="content-section" style={{ padding: '4rem 0' }}>
          <div className="page-shell">
            <div className="section-heading-row">
              <div className="section-title-group">
                <p className="section-eyebrow">EDITORIAL GUIDES</p>
                <h2 className="section-main-title">
                  Travel Stories &amp; Guides for<br />
                  <span className="serif-italic-gold">{item.name_en}.</span>
                </h2>
              </div>
              <Link href="/articles" className="section-link-more">
                View all articles <span>→</span>
              </Link>
            </div>

            {articles.length > 0 ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
                {articles.map((article) => (
                  <Link
                    key={article.slug}
                    href={`/articles/${article.slug}`}
                    className="story-card-item"
                    style={{ textDecoration: 'none' }}
                  >
                    <div className="story-card-media" style={{ height: '220px' }}>
                      <img
                        src={article.cover_image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'}
                        alt={article.cover_image_alt || article.title_en}
                      />
                    </div>
                    <div className="story-card-body">
                      <p className="story-card-kicker">
                        {article.category || 'TRAVEL GUIDE'} · {article.author_name || 'EDITORIAL'}
                      </p>
                      <h3 className="story-card-title">
                        {article.title_en}
                      </h3>
                      {article.excerpt_en && (
                        <p className="story-card-excerpt">
                          {article.excerpt_en}
                        </p>
                      )}
                      <span className="story-card-link-cta">
                        Read full guide <span>→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="empty-editorial-card">
                <p>No published travel guides for {item.name_en} yet. Check back soon.</p>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
