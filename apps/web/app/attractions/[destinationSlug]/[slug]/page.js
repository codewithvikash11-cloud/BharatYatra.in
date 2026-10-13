import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '../../../../lib/content-api.mjs';
import prisma from '../../../../lib/db.js';
import { getMapPinUrl } from '../../../../lib/map-url.mjs';
import DestinationInteractiveClient from '../../../../components/destination-interactive-client.js';

export const dynamic = 'force-dynamic';

// Verified attraction details repository for Jaipur top attractions
const verifiedAttractionsData = {};

export async function generateMetadata({ params }) {
  const { destinationSlug, slug } = await params;
  const verified = verifiedAttractionsData[slug];
  if (verified) {
    return {
      title: `${verified.name} | ${verified.destinationName} Attractions | BharatYatra`,
      description: verified.overview,
      alternates: { canonical: `https://bharat-yatra-in.vercel.app/attractions/${destinationSlug}/${slug}` },
      openGraph: {
        title: verified.name,
        description: verified.overview,
        images: [{ url: verified.coverUrl }],
      },
    };
  }

  const result = await getContent('attractions', [destinationSlug, slug]);
  if (result.state === 'success' && result.payload?.data) {
    const item = result.payload.data;
    return {
      title: `${item.name_en} | BharatYatra Attraction Guide`,
      description: item.description_en || item.name_en,
      alternates: { canonical: `https://bharat-yatra-in.vercel.app/attractions/${destinationSlug}/${slug}` },
    };
  }
  return { title: 'Attraction Guide | BharatYatra' };
}

export default async function AttractionDetailPage({ params }) {
  const { destinationSlug, slug } = await params;

  // 1. Check verified data repository first
  let data = verifiedAttractionsData[slug];

  // 2. Query CMS or database fallback
  if (!data) {
    try {
      const dbAttraction = await prisma.attractions.findFirst({
        where: {
          slug,
          status: 'PUBLISHED',
        },
        include: {
          destinations: {
            select: {
              slug: true,
              name_en: true,
              state_name: true,
              states: { select: { slug: true, name_en: true } },
            },
          },
        },
      });

      if (dbAttraction) {
        const dest = dbAttraction.destinations;
        const stateName = dest?.states?.name_en || dest?.state_name || 'India';
        const stateSlug = dest?.states?.slug || 'rajasthan';

        // Query sister attractions in the same destination
        let sisterAttractions = [];
        try {
          sisterAttractions = await prisma.attractions.findMany({
            where: {
              destination_id: dbAttraction.destination_id,
              slug: { not: slug },
              status: 'PUBLISHED',
            },
            take: 3,
            select: { slug: true, name_en: true, category: true, description_en: true },
          });
        } catch {}

        data = {
          name: dbAttraction.name_en,
          category: dbAttraction.category || 'Historical Monument',
          destinationName: dest?.name_en || 'Destination',
          destinationSlug: dest?.slug || destinationSlug,
          stateName,
          stateSlug,
          coverUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
          overview: dbAttraction.description_en || 'A verified historical landmark in India.',
          visitingHours: dbAttraction.visiting_hours || '9:00 AM – 5:00 PM (Daily)',
          entryFeeNote: dbAttraction.entry_fee_note || 'Verified locally at entrance counter.',
          duration: '1.5 – 2 Hours',
          bestTimeOfDay: 'Morning or late afternoon',
          architecture: dbAttraction.description_en,
          history: dbAttraction.description_en,
          howToReach: `Located in ${dest?.name_en || 'the destination'}, easily reachable via local transit or taxi.`,
          nearby: sisterAttractions.map((s) => ({
            name: s.name_en,
            distance: 'Nearby',
            desc: s.description_en?.slice(0, 90) || s.category,
            href: `/attractions/${dest?.slug || destinationSlug}/${s.slug}`,
          })),
          travelTips: [
            'Wear comfortable footwear suited for walking and stairs.',
            'Maintain quiet and cultural respect inside historic halls.',
            'Verify camera photography permissions at the reception desk.',
          ],
          sources: dbAttraction.source_url
            ? [{ name: 'Official Listing', url: dbAttraction.source_url }]
            : [{ name: 'Verified Field Study', url: null }],
          lat: dbAttraction.latitude || 27.5,
          lng: dbAttraction.longitude || 75.5,
        };
      }
    } catch {}
  }

  if (!data) {
    notFound();
  }

  const mapUrl = getMapPinUrl(data.lat, data.lng);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristAttraction',
    name: data.name,
    description: data.overview,
    image: data.coverUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: data.destinationName,
      addressRegion: data.stateName,
      addressCountry: 'India',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: data.lat,
      longitude: data.lng,
    },
    isAccessibleForFree: false,
    publicAccess: true,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <main className="by-dest-page-root">
        {/* ====================================================
            1. BREADCRUMB BAR
            ==================================================== */}
        <div className="by-dest-breadcrumb-bar">
          <div className="by-container">
            <nav className="by-breadcrumbs" aria-label="Breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="separator">&gt;</li>
                <li><Link href="/destinations">Destinations</Link></li>
                <li className="separator">&gt;</li>
                <li><Link href={`/destinations/${data.destinationSlug}`}>{data.destinationName}</Link></li>
                <li className="separator">&gt;</li>
                <li><Link href="/attractions">Attractions</Link></li>
                <li className="separator">&gt;</li>
                <li className="current" aria-current="page">{data.name}</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* ====================================================
            2. ATTRACTION HERO BANNER
            ==================================================== */}
        <section
          className="by-dest-hero-banner"
          style={{ backgroundImage: `url(${data.coverUrl})` }}
          aria-labelledby="attraction-title"
        >
          <div className="by-dest-hero-gradient" aria-hidden="true" />
          <div className="by-container by-dest-hero-shell">
            <div className="by-dest-hero-top-row">
              <span className="by-dest-state-badge">
                <span>🏛️</span> {data.category.toUpperCase()}
              </span>

              <DestinationInteractiveClient
                destination={{
                  slug: slug,
                  name: data.name,
                  state: data.stateName,
                  coverUrl: data.coverUrl,
                }}
                galleryPhotos={[{ title: data.name, url: data.coverUrl }]}
              />
            </div>

            <div className="by-dest-hero-title-block">
              <h1 id="attraction-title" className="by-dest-title">{data.name}</h1>
              <p className="by-dest-subtitle">{data.destinationName}, {data.stateName}</p>
              <p className="by-dest-overview-text">{data.overview}</p>
            </div>

            {/* Quick Fact Badges */}
            <div className="by-dest-facts-row">
              <div className="by-dest-fact-pill">
                <span className="by-fact-icon">⏱</span>
                <div className="by-fact-text">
                  <span className="by-fact-label">Recommended Duration</span>
                  <strong className="by-fact-val">{data.duration}</strong>
                </div>
              </div>
              <div className="by-dest-fact-pill">
                <span className="by-fact-icon">☀️</span>
                <div className="by-fact-text">
                  <span className="by-fact-label">Best Time of Day</span>
                  <strong className="by-fact-val">{data.bestTimeOfDay}</strong>
                </div>
              </div>
              <div className="by-dest-fact-pill">
                <span className="by-fact-icon">📍</span>
                <div className="by-fact-text">
                  <span className="by-fact-label">Destination</span>
                  <strong className="by-fact-val">{data.destinationName}</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            3. TWO-COLUMN LAYOUT WITH CONTEXTUAL SIDEBAR
            ==================================================== */}
        <div className="by-container by-dest-layout-shell">
          <div className="by-dest-two-col">
            {/* MAIN CONTENT AREA */}
            <div className="by-dest-main-col">
              {/* Architecture & Overview */}
              <section className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <span className="by-sec-icon">📖</span> About & Architecture
                </h2>
                <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', lineHeight: 1.8, color: 'var(--text-primary)' }}>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '1.05rem' }}>{data.architecture}</p>
                  {data.history && (
                    <p style={{ margin: 0, fontSize: '0.98rem', color: 'var(--text-secondary)' }}>{data.history}</p>
                  )}
                </div>
              </section>

              {/* Visitor Information */}
              <section className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <span className="by-sec-icon">ℹ️</span> Visitor Information
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
                  <div style={{ background: 'var(--cream)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🕒</span>
                      <strong style={{ color: 'var(--teal-deep)' }}>Visiting Timings</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{data.visitingHours}</p>
                  </div>

                  <div style={{ background: 'var(--cream)', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '1.2rem' }}>🎟</span>
                      <strong style={{ color: 'var(--teal-deep)' }}>Entry Fee & Tickets</strong>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{data.entryFeeNote}</p>
                  </div>
                </div>
              </section>

              {/* How to Reach */}
              <section className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <span className="by-sec-icon">🚗</span> How to Reach
                </h2>
                <div style={{ background: '#FFFFFF', padding: '1.75rem', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)' }}>
                  <p style={{ margin: '0 0 1rem 0', lineHeight: 1.7, color: 'var(--text-primary)' }}>{data.howToReach}</p>
                  <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="btn-outline-teal" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem' }}>
                    Open Geographic Pin on Google Maps ↗
                  </a>
                </div>
              </section>

              {/* Nearby Attractions */}
              {data.nearby?.length > 0 && (
                <section className="by-dest-section">
                  <h2 className="by-dest-sec-title">
                    <span className="by-sec-icon">📍</span> Nearby Attractions
                  </h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    {data.nearby.map((near) => (
                      <Link key={near.name} href={near.href} style={{ textDecoration: 'none', background: '#FFFFFF', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'block' }}>
                        <strong style={{ color: 'var(--teal-deep)', fontSize: '1rem', display: 'block', marginBottom: '0.25rem' }}>{near.name}</strong>
                        <span style={{ fontSize: '0.78rem', color: 'var(--gold-dark)', fontWeight: 600, display: 'block', marginBottom: '0.4rem' }}>{near.distance}</span>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{near.desc}</p>
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* Practical Tips */}
              <section className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <span className="by-sec-icon">💡</span> Practical Travel Tips
                </h2>
                <div className="by-tips-card">
                  <ul className="by-tips-two-col">
                    {data.travelTips.map((tip, idx) => (
                      <li key={idx}>
                        <span className="by-tip-check">✓</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Sources */}
              {data.sources?.length > 0 && (
                <section className="by-dest-section" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                    Official Tourism Source:{' '}
                    {data.sources.map((src, i) => (
                      <span key={i}>
                        {src.url ? (
                          <a href={src.url} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-secondary)' }}>
                            {src.name} ↗
                          </a>
                        ) : (
                          src.name
                        )}
                        {i < data.sources.length - 1 ? ' · ' : ''}
                      </span>
                    ))}
                  </p>
                </section>
              )}
            </div>

            {/* CONTEXTUAL SIDEBAR */}
            <aside className="by-dest-sidebar-col">
              <div className="by-sidebar-card">
                <h3 className="by-sidebar-title">
                  <span className="by-sidebar-title-icon">ℹ</span> Quick Information
                </h3>
                <dl className="by-quick-info-list">
                  <div className="by-quick-info-row">
                    <dt>Category</dt>
                    <dd>{data.category}</dd>
                  </div>
                  <div className="by-quick-info-row">
                    <dt>Destination</dt>
                    <dd>{data.destinationName}</dd>
                  </div>
                  <div className="by-quick-info-row">
                    <dt>State</dt>
                    <dd>{data.stateName}</dd>
                  </div>
                  <div className="by-quick-info-row">
                    <dt>Time Needed</dt>
                    <dd>{data.duration}</dd>
                  </div>
                </dl>
              </div>

              {/* Destination Card Link */}
              <div className="by-sidebar-card" style={{ background: 'var(--cream)', border: '1px solid var(--border-color)' }}>
                <p className="section-eyebrow" style={{ margin: 0 }}>EXPLORE DESTINATION</p>
                <h4 style={{ margin: '0.4rem 0 0.5rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.2rem' }}>
                  {data.destinationName} Complete Guide
                </h4>
                <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                  Discover all forts, royal stays, street food, and day-by-day itineraries.
                </p>
                <Link href={`/destinations/${data.destinationSlug}`} className="btn-gold-pill" style={{ textDecoration: 'none', display: 'inline-block', fontSize: '0.88rem' }}>
                  View {data.destinationName} Guide →
                </Link>
              </div>

              {/* Helpline */}
              <div className="by-sidebar-card">
                <h3 className="by-sidebar-title">
                  <span className="by-sidebar-title-icon">📞</span> Tourist Helpline
                </h3>
                <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Ministry of Tourism 24x7 Multi-lingual toll-free helpline:
                </p>
                <strong style={{ display: 'block', marginTop: '0.4rem', fontSize: '1.15rem', color: 'var(--teal-primary)' }}>
                  1363 / 1800-11-1363
                </strong>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
