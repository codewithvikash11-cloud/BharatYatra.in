import Link from 'next/link';
import prisma from '../../lib/db.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ searchParams }) {
  const { q } = (await searchParams) || {};
  const query = typeof q === 'string' ? q.trim() : '';
  if (!query) {
    return {
      title: 'Search Destinations & Travel Guides | BharatYatra',
      description: 'Search destinations, attractions, and cultural travel guides across India.',
    };
  }
  return {
    title: `Search: "${query}" | BharatYatra`,
    description: `Discover destinations, monuments, and travel guides for "${query}" on BharatYatra.`,
    alternates: {
      canonical: `https://bharat-yatra-in.vercel.app/search?q=${encodeURIComponent(query)}`,
    },
  };
}

async function performSearch(query) {
  if (!query) {
    return { destinations: [], attractions: [], articles: [] };
  }

  const cleaned = query.trim().replace(/\s+/g, ' ');
  const tokens = cleaned.split(' ').filter(Boolean);

  if (tokens.length === 0) {
    return { destinations: [], attractions: [], articles: [] };
  }

  try {
    // Multi-token filter for destinations
    const destTokenFilter = tokens.map((token) => ({
      OR: [
        { name_en: { contains: token, mode: 'insensitive' } },
        { summary_en: { contains: token, mode: 'insensitive' } },
        { description_en: { contains: token, mode: 'insensitive' } },
        { state_name: { contains: token, mode: 'insensitive' } },
        { district_name: { contains: token, mode: 'insensitive' } },
      ],
    }));

    // Multi-token filter for attractions (matches attraction fields or destination/state)
    const attrTokenFilter = tokens.map((token) => ({
      OR: [
        { name_en: { contains: token, mode: 'insensitive' } },
        { description_en: { contains: token, mode: 'insensitive' } },
        { category: { contains: token, mode: 'insensitive' } },
        { destinations: { is: { name_en: { contains: token, mode: 'insensitive' } } } },
        { destinations: { is: { state_name: { contains: token, mode: 'insensitive' } } } },
      ],
    }));

    // Multi-token filter for articles (matches article fields or destination/state)
    const articleTokenFilter = tokens.map((token) => ({
      OR: [
        { title_en: { contains: token, mode: 'insensitive' } },
        { excerpt_en: { contains: token, mode: 'insensitive' } },
        { body_en: { contains: token, mode: 'insensitive' } },
        { category: { contains: token, mode: 'insensitive' } },
        { tags: { contains: token, mode: 'insensitive' } },
        { destinations: { is: { name_en: { contains: token, mode: 'insensitive' } } } },
        { states: { is: { name_en: { contains: token, mode: 'insensitive' } } } },
      ],
    }));

    const [destinations, attractions, articles] = await Promise.all([
      prisma.destinations.findMany({
        where: {
          status: 'PUBLISHED',
          AND: destTokenFilter,
        },
        include: { states: true, districts: true },
        take: 10,
        orderBy: [{ published_at: 'desc' }, { name_en: 'asc' }],
      }),
      prisma.attractions.findMany({
        where: {
          status: 'PUBLISHED',
          destinations: { status: 'PUBLISHED' },
          AND: attrTokenFilter,
        },
        include: { destinations: true },
        take: 12,
        orderBy: [{ published_at: 'desc' }, { name_en: 'asc' }],
      }),
      prisma.articles.findMany({
        where: {
          status: 'PUBLISHED',
          AND: articleTokenFilter,
        },
        include: { destinations: true, states: true },
        take: 12,
        orderBy: [{ published_at: 'desc' }, { title_en: 'asc' }],
      }),
    ]);

    // Prioritize exact matching destination if name matches primary query
    const sortedDestinations = [...destinations].sort((a, b) => {
      const qLower = cleaned.toLowerCase();
      const aExact = a.name_en.toLowerCase().includes(qLower) ? -1 : 1;
      const bExact = b.name_en.toLowerCase().includes(qLower) ? -1 : 1;
      return aExact - bExact;
    });

    return { destinations: sortedDestinations, attractions, articles };
  } catch (err) {
    console.error('Search query failed:', err);
    return { destinations: [], attractions: [], articles: [] };
  }
}

export default async function SearchPage({ searchParams }) {
  const { q } = (await searchParams) || {};
  const query = typeof q === 'string' ? q.trim() : '';
  const { destinations, attractions, articles } = await performSearch(query);

  const totalResults = destinations.length + attractions.length + articles.length;

  return (
    <main className="search-page-root" style={{ minHeight: '80vh', padding: '3rem 0 5rem 0' }}>
      <div className="page-shell">
        {/* Search Header & Form */}
        <div style={{ maxWidth: '780px', margin: '0 auto 3rem auto', textAlign: 'center' }}>
          <p className="section-eyebrow">EXPLORE INDIA</p>
          <h1 className="section-main-title" style={{ marginBottom: '1.5rem' }}>
            Search BharatYatra
          </h1>

          <form action="/search" method="get" role="search" className="hero-search-box" style={{ maxWidth: '640px', margin: '0 auto' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#87938F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              id="search-main-input"
              className="search-input-field"
              type="search"
              name="q"
              defaultValue={query}
              maxLength={100}
              placeholder="Search Nawalgarh Rajasthan, Jaipur, Havelis..."
              aria-label="Search destinations, attractions, and articles"
              autoFocus={!query}
            />
            <button className="search-submit-btn" type="submit">
              Search
            </button>
          </form>

          {/* Quick Filter Suggestions */}
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Popular:</span>
            {['Nawalgarh Rajasthan', 'Jaipur Rajasthan', 'Shekhawati', 'Havelis', 'Kerala'].map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="suggestion-pill"
                style={{ fontSize: '0.78rem' }}
              >
                {term}
              </Link>
            ))}
          </div>
        </div>

        {/* Results Info */}
        {query && (
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: 0 }}>
              {totalResults > 0 ? (
                <>
                  Showing {totalResults} {totalResults === 1 ? 'result' : 'results'} for &ldquo;<span style={{ color: 'var(--gold-muted)' }}>{query}</span>&rdquo;
                </>
              ) : (
                <>
                  No results found for &ldquo;<span style={{ color: 'var(--gold-muted)' }}>{query}</span>&rdquo;
                </>
              )}
            </h2>
            <Link href="/destinations" style={{ fontSize: '0.88rem', color: 'var(--teal-primary)', textDecoration: 'none', fontWeight: 600 }}>
              Browse all destinations →
            </Link>
          </div>
        )}

        {/* ====================================================
            NO RESULTS STATE
            ==================================================== */}
        {query && totalResults === 0 && (
          <div className="empty-editorial-card" style={{ maxWidth: '680px', margin: '2rem auto', textAlign: 'center', padding: '3.5rem 2rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.25rem auto', fontSize: '1.75rem' }}>
              🔍
            </div>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0 0 0.5rem 0' }}>
              No exact matches found for &ldquo;{query}&rdquo;
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
              We could not find any destinations, monuments, or published articles matching your search query. Try checking spelling or using a broader term.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link href="/search?q=Nawalgarh+Rajasthan" className="btn-gold-pill" style={{ fontSize: '0.85rem' }}>
                Search &ldquo;Nawalgarh Rajasthan&rdquo;
              </Link>
              <Link href="/destinations" className="button-link-secondary" style={{ fontSize: '0.85rem' }}>
                All Destinations
              </Link>
              <Link href="/articles" className="button-link-secondary" style={{ fontSize: '0.85rem' }}>
                All Travel Guides
              </Link>
            </div>
          </div>
        )}

        {/* ====================================================
            1. MATCHING DESTINATIONS
            ==================================================== */}
        {destinations.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFDF8', background: 'var(--teal-deep)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                DESTINATIONS ({destinations.length})
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.75rem' }}>
              {destinations.map((dest) => {
                const location = [dest.districts?.name_en || dest.district_name, dest.states?.name_en || dest.state_name].filter(Boolean).join(' · ');
                return (
                  <article key={dest.slug} className="destination-card-item">
                    <div className="destination-card-media" style={{ height: '220px' }}>
                      <img
                        src="https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80"
                        alt={dest.name_en}
                        className="destination-card-img"
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="400"
                      />
                      <span className="destination-card-badge">Destination</span>
                    </div>
                    <div className="destination-card-body">
                      <p className="destination-location-kicker">📍 {location || 'India'}</p>
                      <h3 className="destination-card-title">
                        <Link href={`/destinations/${dest.slug}`}>{dest.name_en}</Link>
                      </h3>
                      {dest.summary_en && (
                        <p className="destination-card-summary">{dest.summary_en}</p>
                      )}
                      <div className="destination-card-footer">
                        <Link href={`/destinations/${dest.slug}`}>
                          Explore Destination Guide <span className="arrow">→</span>
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        {/* ====================================================
            2. MATCHING ARTICLES
            ==================================================== */}
        {articles.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFDF8', background: 'var(--teal-primary)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                TRAVEL ARTICLES &amp; GUIDES ({articles.length})
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.75rem' }}>
              {articles.map((art) => (
                <Link key={art.slug} href={`/articles/${art.slug}`} className="story-card-item" style={{ textDecoration: 'none' }}>
                  <div className="story-card-media" style={{ height: '200px' }}>
                    <img
                      src={art.cover_image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'}
                      alt={art.cover_image_alt || art.title_en}
                      loading="lazy"
                      decoding="async"
                      width="600"
                      height="400"
                    />
                  </div>
                  <div className="story-card-body">
                    <p className="story-card-kicker">
                      {art.category || 'TRAVEL GUIDE'} {art.destinations ? `· ${art.destinations.name_en}` : ''}
                    </p>
                    <h3 className="story-card-title">{art.title_en}</h3>
                    {art.excerpt_en && <p className="story-card-excerpt">{art.excerpt_en}</p>}
                    <span className="story-card-link-cta">
                      Read full story <span>→</span>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ====================================================
            3. MATCHING ATTRACTIONS & MONUMENTS
            ==================================================== */}
        {attractions.length > 0 && (
          <section style={{ marginBottom: '3.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#FFFDF8', background: 'var(--gold-muted)', padding: '0.25rem 0.65rem', borderRadius: '4px' }}>
                ATTRACTIONS &amp; MONUMENTS ({attractions.length})
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: '1.25rem' }}>
              {attractions.map((attr) => (
                <article
                  key={attr.slug}
                  style={{
                    background: '#FFFDF8',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-lg)',
                    padding: '1.5rem',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--gold-muted)', textTransform: 'uppercase' }}>
                      {attr.category || 'Monuments'} {attr.destinations ? `· ${attr.destinations.name_en}` : ''}
                    </span>
                    <h3 style={{ fontSize: '1.18rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.4rem 0 0.5rem 0' }}>
                      {attr.name_en}
                    </h3>
                    {attr.description_en && (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>
                        {attr.description_en.slice(0, 140)}...
                      </p>
                    )}
                  </div>
                  <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
                    <Link
                      href={`/attractions/${attr.destinations?.slug || 'nawalgarh-rajasthan'}/${attr.slug}`}
                      style={{ color: 'var(--teal-primary)', fontWeight: 600, fontSize: '0.85rem', textDecoration: 'none' }}
                    >
                      View Attraction Details →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
