import Link from 'next/link';

export const metadata = {
  title: 'Curated India Itineraries | BharatYatra',
  description: 'Handcrafted day-by-day travel itineraries across India: 2 days in Jaipur, 3 days in Kerala, 4 days in Uttarakhand, and 1 week in Rajasthan.',
};

const itinerariesList = [
  {
    title: '2 Days in Jaipur',
    subtitle: 'Royal Heritage Experience',
    days: '2 Days',
    places: '6+ Places',
    category: 'Heritage',
    badgeColor: 'var(--gold-dark)',
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
    summary: 'A fast-paced weekend soaking up the grandest forts, mirrored palaces, observatories, and vibrant spice bazaars of the Pink City.',
    highlights: ['Amer Fort & Sheesh Mahal', 'Hawa Mahal & Johari Bazaar', 'City Palace', 'Jantar Mantar', 'Nahargarh sunset'],
    destSlug: 'jaipur',
  },
  {
    title: '3 Days in Kerala',
    subtitle: 'Backwaters & Coastal Palms',
    days: '3 Days',
    places: '8+ Places',
    category: 'Nature',
    badgeColor: '#16A34A',
    cover: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
    summary: 'Cruise tranquil backwaters in a traditional kettuvallam houseboat, wander spice plantations, and watch Chinese fishing nets in historic Fort Kochi.',
    highlights: ['Alleppey Houseboat Cruise', 'Fort Kochi Heritage Walk', 'Kumarakom Bird Sanctuary', 'Traditional Kathakali Dance'],
    destSlug: null,
  },
  {
    title: '4 Days in Uttarakhand',
    subtitle: 'Spiritual River & Himalayan Foothills',
    days: '4 Days',
    places: '7+ Places',
    category: 'Spiritual',
    badgeColor: 'var(--teal-primary)',
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
    summary: 'Combine yoga retreats and the evening Parmarth Niketan Ganga Aarti in Rishikesh with mountain vistas in Mussoorie or Lansdowne.',
    highlights: ['Triveni Ghat Evening Aarti', 'Beatles Ashram (Chaurasi Kutia)', 'Neer Garh Waterfall', 'White water rafting'],
    destSlug: null,
  },
  {
    title: '1 Week in Royal Rajasthan',
    subtitle: 'Forts, Palaces & Desert Twilight',
    days: '7 Days',
    places: '12+ Places',
    category: 'Culture',
    badgeColor: 'var(--terracotta)',
    cover: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
    summary: 'The classic royal expedition connecting Jaipur (the Pink City), Jodhpur (the Blue Citadel under Mehrangarh), and romantic lakeside Udaipur.',
    highlights: ['Jaipur Walled City & Amber', 'Mehrangarh Fort in Jodhpur', 'Ranakpur Jain Marble Temples', 'Lake Pichola boat cruise'],
    destSlug: 'jaipur',
  },
];

export default function ItinerariesPage() {
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

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginBottom: '3.5rem' }}>
          {itinerariesList.map((item) => (
            <article
              key={item.title}
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
                  src={item.cover}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    background: item.badgeColor,
                    color: '#FFFFFF',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.25rem 0.65rem',
                    borderRadius: '999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {item.category}
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
                  ⏱ {item.days} · {item.places}
                </span>
              </div>

              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.35rem', margin: '0 0 0.25rem 0' }}>
                  {item.title}
                </h2>
                <span style={{ fontSize: '0.88rem', color: 'var(--gold-dark)', fontWeight: 600, display: 'block', marginBottom: '0.75rem' }}>
                  {item.subtitle}
                </span>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem 0', flex: 1 }}>
                  {item.summary}
                </p>

                <div style={{ background: 'var(--cream)', borderRadius: 'var(--radius-sm)', padding: '0.85rem 1rem', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                  <strong style={{ display: 'block', fontSize: '0.78rem', color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    Route Highlights
                  </strong>
                  <ul style={{ margin: 0, paddingLeft: '1.1rem', fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.6 }}>
                    {item.highlights.map((h, i) => (
                      <li key={i}>{h}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link
                    href={item.destSlug ? `/destinations/${item.destSlug}#itinerary` : '/trip-planner'}
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
      </div>
    </main>
  );
}
