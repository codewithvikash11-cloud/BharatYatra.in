import Link from 'next/link';
import prisma from '../../lib/db.js';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Travel Itineraries | BharatYatra',
  description: 'Verified day-by-day travel itineraries and circuit routes across India.',
};

export default async function ItinerariesPage() {
  let itineraries = [];
  try {
    itineraries = await prisma.itineraries.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { created_at: 'desc' },
      include: {
        destinations: { select: { slug: true, name_en: true, state_name: true } },
      },
    });
  } catch (err) {
    console.error('Error fetching itineraries:', err);
  }

  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Suggested Itineraries</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>CURATED JOURNEYS</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            Suggested Itineraries for India
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Proven day-by-day travel routes tested by our editors. Paced comfortably to balance monument exploration, local dining, and scenic relaxation.
          </p>
        </header>

        {/* Grid or Clean Empty State */}
        {itineraries.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
            {itineraries.map((item) => (
              <article
                key={item.slug}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ height: '210px', width: '100%', position: 'relative' }}>
                  <img
                    src={item.cover_image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'}
                    alt={item.title_en}
                    loading="lazy"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '1rem',
                      left: '1rem',
                      background: 'var(--teal-primary)',
                      color: '#FFFFFF',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {item.category || 'Itinerary'}
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '1rem',
                      right: '1rem',
                      background: 'rgba(16, 47, 44, 0.85)',
                      backdropFilter: 'blur(4px)',
                      color: '#FFFFFF',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '999px',
                    }}
                  >
                    ⏱ {item.duration_days ? `${item.duration_days} Days` : 'Multi-day'}
                  </span>
                </div>

                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.35rem', margin: '0 0 0.25rem 0' }}>
                    {item.title_en}
                  </h2>
                  {item.destinations?.name_en && (
                    <span style={{ fontSize: '0.88rem', color: 'var(--gold-dark)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                      {item.destinations.name_en}, {item.destinations.state_name || 'India'}
                    </span>
                  )}

                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem 0', flex: 1 }}>
                    {item.summary_en}
                  </p>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <Link
                      href={`/itineraries/${item.slug}`}
                      className="btn-gold-pill"
                      style={{ textDecoration: 'none', fontSize: '0.85rem' }}
                    >
                      View Day-by-Day Plan →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '3.5rem 2rem',
              textAlign: 'center',
              background: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              border: '1px dashed var(--border-color)',
              marginBottom: '3.5rem',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🗺</div>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>
              Curated Itineraries in Preparation
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '540px', margin: '0 auto 1.5rem auto', lineHeight: 1.6 }}>
              Our editorial team is crafting verified, day-by-day travel itineraries with timing, transport, and local stops.
              In the meantime, build your personalized itinerary using our Trip Planner.
            </p>
            <Link
              href="/trip-planner"
              className="btn-gold-pill"
              style={{ display: 'inline-block', textDecoration: 'none', fontSize: '0.95rem', padding: '0.65rem 1.4rem' }}
            >
              Open Trip Planner →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
