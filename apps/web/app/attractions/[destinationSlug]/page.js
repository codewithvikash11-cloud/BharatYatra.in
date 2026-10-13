import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import prisma from '../../../lib/db.js';

export const dynamic = 'force-dynamic';

const curatedDestinationAttractions = {};

export async function generateMetadata({ params }) {
  const { destinationSlug } = await params;
  if (curatedDestinationAttractions[destinationSlug]) {
    const curated = curatedDestinationAttractions[destinationSlug];
    return {
      title: `Tourist Attractions & Monuments in ${curated.name_en} | BharatYatra`,
      description: `Explore verified monuments, historical palaces, hill forts, and cultural sights in ${curated.name_en}, ${curated.state_name}.`,
    };
  }

  try {
    const dest = await prisma.destinations.findFirst({
      where: { slug: destinationSlug, status: 'PUBLISHED' },
      select: { name_en: true, state_name: true },
    });
    if (dest) {
      return {
        title: `Tourist Attractions & Monuments in ${dest.name_en} | BharatYatra`,
        description: `Explore verified monuments, historical palaces, hill forts, and cultural sights in ${dest.name_en}, ${dest.state_name || 'India'}.`,
      };
    }

    const attr = await prisma.attractions.findFirst({
      where: { slug: destinationSlug, status: 'PUBLISHED' },
      include: { destinations: true },
    });
    if (attr) {
      return {
        title: `${attr.name_en} | BharatYatra`,
        description: attr.description_en?.slice(0, 160) || 'Verified tourist attraction in India.',
      };
    }
  } catch {}

  return {
    title: 'Attractions in India | BharatYatra',
    description: 'Explore verified attractions and monuments across India.',
  };
}

export default async function DestinationAttractionsPage({ params, searchParams }) {
  const { destinationSlug } = await params;
  const sParams = await searchParams;
  const categoryFilter = typeof sParams?.category === 'string' ? sParams.category.trim() : '';

  // 1. Check if destinationSlug is actually an attraction slug directly
  try {
    const directAttr = await prisma.attractions.findFirst({
      where: { slug: destinationSlug, status: 'PUBLISHED' },
      include: { destinations: true },
    });

    if (directAttr && directAttr.destinations?.slug) {
      redirect(`/attractions/${directAttr.destinations.slug}/${directAttr.slug}`);
    }
  } catch {}

  // 2. Query destination from database or curated repository
  let destination = null;
  let attractions = [];
  let allCategories = [];

  const curated = curatedDestinationAttractions[destinationSlug];
  if (curated) {
    destination = {
      name_en: curated.name_en,
      slug: curated.slug,
      district_name: curated.district_name,
      state_name: curated.state_name,
    };
    const rawList = curated.attractions;
    attractions = categoryFilter
      ? rawList.filter((a) => a.category.toLowerCase().includes(categoryFilter.toLowerCase()))
      : rawList;
    allCategories = Array.from(new Set(rawList.map((a) => a.category)));
  } else {
    try {
      destination = await prisma.destinations.findFirst({
        where: { slug: destinationSlug, status: 'PUBLISHED' },
        include: { states: true, districts: true },
      });

      if (destination) {
        attractions = await prisma.attractions.findMany({
          where: {
            destination_id: destination.id,
            status: 'PUBLISHED',
            ...(categoryFilter ? { category: { equals: categoryFilter, mode: 'insensitive' } } : {}),
          },
          orderBy: { name_en: 'asc' },
        });

        const catRows = await prisma.attractions.findMany({
          where: { destination_id: destination.id, status: 'PUBLISHED' },
          select: { category: true },
        });
        allCategories = Array.from(new Set(catRows.map((a) => a.category).filter(Boolean)));
      }
    } catch (err) {
      console.error('Failed to query destination attractions:', err);
    }
  }

  if (!destination) {
    notFound();
  }

  const locationLabel = [
    destination.districts?.name_en || destination.district_name,
    destination.states?.name_en || destination.state_name,
  ].filter(Boolean).join(' · ');

  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li><Link href="/destinations" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Destinations</Link></li>
            <li>/</li>
            <li><Link href={`/destinations/${destination.slug}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{destination.name_en}</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Attractions</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>📍 {locationLabel || 'INDIA'}</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            Tourist Attractions &amp; Monuments in {destination.name_en}
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
            Verified sightseeing list with visiting hours, official entry fees, and historical architecture notes in {destination.name_en}.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link href={`/destinations/${destination.slug}`} className="btn-outline-teal" style={{ fontSize: '0.85rem' }}>
              ← Return to {destination.name_en} Guide
            </Link>
            <Link href={`/trip-planner?destination=${encodeURIComponent(destination.slug)}`} className="btn-gold-pill" style={{ fontSize: '0.85rem' }}>
              Plan Trip to {destination.name_en} →
            </Link>
          </div>
        </header>

        {/* Category Pills */}
        {allCategories.length > 0 && (
          <nav aria-label="Category filter" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link
                href={`/attractions/${destination.slug}`}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: '999px',
                  border: !categoryFilter ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
                  background: !categoryFilter ? 'var(--teal-deep)' : '#FFFFFF',
                  color: !categoryFilter ? '#FFFDF8' : 'var(--text-primary)',
                  fontWeight: !categoryFilter ? 700 : 500,
                  fontSize: '0.82rem',
                  textDecoration: 'none',
                }}
              >
                All Categories ({curated ? curated.attractions.length : attractions.length})
              </Link>
              {allCategories.map((cat) => {
                const isActive = categoryFilter.toLowerCase() === cat.toLowerCase();
                return (
                  <Link
                    key={cat}
                    href={`/attractions/${destination.slug}?category=${encodeURIComponent(cat)}`}
                    style={{
                      padding: '0.45rem 1rem',
                      borderRadius: '999px',
                      border: isActive ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
                      background: isActive ? 'var(--teal-deep)' : '#FFFFFF',
                      color: isActive ? '#FFFDF8' : 'var(--text-primary)',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: '0.82rem',
                      textDecoration: 'none',
                    }}
                  >
                    {cat}
                  </Link>
                );
              })}
            </div>
          </nav>
        )}

        {/* Attractions Grid */}
        {attractions.length === 0 ? (
          <div className="empty-editorial-card" style={{ maxWidth: '640px', margin: '2rem auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏛️</div>
            <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
              No attractions found in this category
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              Try selecting &ldquo;All Categories&rdquo; or explore other destination guides.
            </p>
            <Link href={`/attractions/${destination.slug}`} className="btn-gold-pill" style={{ fontSize: '0.85rem' }}>
              View All {destination.name_en} Attractions
            </Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem' }}>
            {attractions.map((attr) => (
              <article
                key={attr.slug}
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
                <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      {attr.category || 'Historic Monument'}
                    </span>
                    {attr.verified_at && (
                      <span style={{ fontSize: '0.72rem', color: '#16A34A', fontWeight: 600 }}>
                        ✓ ASI / Dept. Verified
                      </span>
                    )}
                  </div>

                  <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.35rem', margin: '0 0 0.65rem 0' }}>
                    <Link href={`/attractions/${destination.slug}/${attr.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {attr.name_en}
                    </Link>
                  </h2>

                  {attr.description_en && (
                    <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem 0', flex: 1 }}>
                      {attr.description_en.slice(0, 180)}...
                    </p>
                  )}

                  {/* Monument Facts Box */}
                  <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', marginBottom: '1.25rem', fontSize: '0.82rem', lineHeight: 1.6 }}>
                    {attr.visiting_hours && (
                      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.25rem' }}>
                        <span>⏱</span>
                        <span><strong>Hours:</strong> {attr.visiting_hours}</span>
                      </div>
                    )}
                    {attr.entry_fee_note && (
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <span>🎟</span>
                        <span><strong>Entry Fee:</strong> {attr.entry_fee_note}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <Link
                      href={`/attractions/${destination.slug}/${attr.slug}`}
                      className="btn-gold-pill"
                      style={{ fontSize: '0.85rem', display: 'inline-block', textDecoration: 'none' }}
                    >
                      View Attraction Details →
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
