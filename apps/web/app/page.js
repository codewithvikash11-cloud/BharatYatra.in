import Link from 'next/link';
import HeroSearchWidget from '../components/hero-search-widget.js';
import { getCollection } from '../lib/content-api.mjs';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BharatYatra — Explore India, Plan Better Trips',
  description: 'Your complete travel companion for destinations, itineraries, transport, stays, food, events and practical travel information across India.',
};

const curatedDestinations = [
  {
    slug: 'jaipur',
    name: 'Jaipur',
    state: 'Rajasthan',
    tags: 'Forts · Palaces · Culture',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'varanasi',
    name: 'Varanasi',
    state: 'Uttar Pradesh',
    tags: 'Spiritual · Ganga Aarti · Heritage',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'manali',
    name: 'Manali',
    state: 'Himachal Pradesh',
    tags: 'Mountains · Adventure · Nature',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'goa',
    name: 'Goa',
    state: 'Goa',
    tags: 'Beaches · Nightlife · Relaxation',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'udaipur',
    name: 'Udaipur',
    state: 'Rajasthan',
    tags: 'Lakes · Palaces · Romance',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=900&q=80',
  },
  {
    slug: 'rishikesh',
    name: 'Rishikesh',
    state: 'Uttarakhand',
    tags: 'Yoga · Adventure · Spirituality',
    image: 'https://images.unsplash.com/photo-1607963496350-f84f09d84c17?auto=format&fit=crop&w=900&q=80',
  },
];

const travelTools = [
  {
    icon: '📍',
    title: 'Destinations',
    sub: 'Places to visit',
    href: '/destinations',
    bg: '#EBF4F6',
    color: '#247A72',
  },
  {
    icon: '📅',
    title: 'Trip Planner',
    sub: 'Plan your journey',
    href: '/trip-planner',
    bg: '#FEF6E8',
    color: '#C58B32',
  },
  {
    icon: '🚗',
    title: 'Routes & Transport',
    sub: 'Train, bus, flight, road',
    href: '/routes',
    bg: '#EAF3F5',
    color: '#153E3A',
  },
  {
    icon: '🍽',
    title: 'Stay & Food',
    sub: 'Hotels, restaurants',
    href: '/destinations',
    bg: '#FDF0EC',
    color: '#B9653F',
  },
  {
    icon: '🎉',
    title: 'Events & Festivals',
    sub: 'Cultural experiences',
    href: '/events',
    bg: '#FBEAF0',
    color: '#B33951',
  },
  {
    icon: '🧭',
    title: 'Travel Tips',
    sub: 'Guides and safety',
    href: '/checklist',
    bg: '#EDF5F0',
    color: '#496B55',
  },
  {
    icon: '🗺',
    title: 'Interactive Map',
    sub: 'Explore India',
    href: '/states',
    bg: '#EAF1F7',
    color: '#2D68C4',
  },
  {
    icon: '💰',
    title: 'Budget Calculator',
    sub: 'Estimate trip cost',
    href: '/budget-calculator',
    bg: '#FFF5E6',
    color: '#D97706',
  },
];

const planTripTools = [
  {
    icon: '🗓',
    title: 'Trip Planner',
    desc: 'Create day-wise itinerary for your journey',
    href: '/trip-planner',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
  },
  {
    icon: '🔀',
    title: 'Route Finder',
    desc: 'Train, bus, flight and road options',
    href: '/routes',
    iconColor: '#8B5CF6',
    iconBg: '#F5F3FF',
  },
  {
    icon: '🧮',
    title: 'Budget Calculator',
    desc: 'Estimate your trip cost',
    href: '/budget-calculator',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
  },
  {
    icon: '📋',
    title: 'Travel Checklist',
    desc: "Don't forget the essentials",
    href: '/checklist',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
  },
  {
    icon: '📍',
    title: 'Nearby Places',
    desc: 'Find attractions around you',
    href: '/nearby',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
  },
  {
    icon: '🌤',
    title: 'Weather Guide',
    desc: 'Best time to visit',
    href: '/weather',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
  },
];

const regions = [
  {
    name: 'North India',
    sub: 'Himalayas, Heritage, Spirituality',
    href: '/destinations?region=north',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'South India',
    sub: 'Beaches, Temples, Culture',
    href: '/destinations?region=south',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'East India',
    sub: 'Temples, Nature, Tribal Culture',
    href: '/destinations?region=east',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'West India',
    sub: 'Rajasthan, Gujarat, Beaches',
    href: '/destinations?region=west',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'Central India',
    sub: 'Forests, Wildlife, Ancient Sites',
    href: '/destinations?region=central',
    image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=700&q=80',
  },
  {
    name: 'North East India',
    sub: 'Nature, Adventure, Unique Cultures',
    href: '/destinations?region=northeast',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=700&q=80',
  },
];

const suggestedItineraries = [
  {
    title: '2 Days in Jaipur',
    subtitle: 'Royal Heritage Experience',
    duration: '2 Days',
    places: '6+ Places',
    tag: 'Heritage',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80',
    href: '/destinations/jaipur#itinerary',
  },
  {
    title: '3 Days in Kerala',
    subtitle: 'Backwaters & Beaches',
    duration: '3 Days',
    places: '8+ Places',
    tag: 'Nature',
    image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=700&q=80',
    href: '/search?q=Kerala',
  },
  {
    title: '4 Days in Uttarakhand',
    subtitle: 'Spiritual & Adventure',
    duration: '4 Days',
    places: '7+ Places',
    tag: 'Spiritual',
    image: 'https://images.unsplash.com/photo-1607963496350-f84f09d84c17?auto=format&fit=crop&w=700&q=80',
    href: '/search?q=Uttarakhand',
  },
  {
    title: '1 Week in Rajasthan',
    subtitle: 'Forts, Palaces & Culture',
    duration: '7 Days',
    places: '12+ Places',
    tag: 'Culture',
    image: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=700&q=80',
    href: '/search?q=Rajasthan',
  },
];

const blogArticles = [
  {
    title: 'Best Time to Visit Rajasthan',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80',
    href: '/articles/nawalgarh-rajasthan-travel-guide',
  },
  {
    title: 'Complete Guide to Char Dham Yatra',
    readTime: '7 min read',
    image: 'https://images.unsplash.com/photo-1607963496350-f84f09d84c17?auto=format&fit=crop&w=700&q=80',
    href: '/articles',
  },
  {
    title: 'Top 10 Hill Stations in India',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=700&q=80',
    href: '/articles',
  },
  {
    title: 'India Travel Tips for First Timers',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=700&q=80',
    href: '/checklist',
  },
  {
    title: 'Famous Food Dishes from Different States',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=700&q=80',
    href: '/articles',
  },
  {
    title: 'Hidden Gems in North East India',
    readTime: '5 min read',
    image: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=700&q=80',
    href: '/articles',
  },
];

const essentialInfoCards = [
  {
    icon: '🛂',
    title: 'Visa & Entry Rules',
    desc: 'For international travellers',
    href: '/travel-help#visa',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
  },
  {
    icon: '📞',
    title: 'Emergency Numbers',
    desc: '112 • Tourist Helpline 1363',
    href: '/travel-help#emergency',
    iconColor: '#EF4444',
    iconBg: '#FEF2F2',
  },
  {
    icon: '🏛',
    title: 'State Tourism Websites',
    desc: 'Official government links',
    href: '/travel-help#tourism-portals',
    iconColor: '#3B82F6',
    iconBg: '#EFF6FF',
  },
  {
    icon: '💵',
    title: 'Currency & Payments',
    desc: 'Rupee (INR) and travel tips',
    href: '/travel-help#currency',
    iconColor: '#F59E0B',
    iconBg: '#FFFBEB',
  },
  {
    icon: '☀️',
    title: 'Weather Information',
    desc: 'Season-wise travel guide',
    href: '/weather',
    iconColor: '#EAB308',
    iconBg: '#FEFCE8',
  },
  {
    icon: '🛡',
    title: 'Safety Tips',
    desc: 'Travel safe across India',
    href: '/travel-help#safety',
    iconColor: '#F97316',
    iconBg: '#FFF7ED',
  },
];

export default async function HomePage() {
  // Fetch real articles and destinations from DB/API
  const [destRes, articleRes] = await Promise.all([
    getCollection('destinations', { limit: 6 }),
    getCollection('articles', { limit: 6 }),
  ]);

  const dbDestinations = destRes.state === 'success' && destRes.data?.length ? destRes.data : [];
  const dbArticles = articleRes.state === 'success' && articleRes.data?.length ? articleRes.data : [];

  return (
    <main className="by-home-root">
      {/* ========================================================
          1. HERO SECTION: "India, through every journey"
          ======================================================== */}
      <section className="by-hero-section">
        {/* Full-bleed scenic Kashmir Dal Lake image overlay */}
        <div className="by-hero-overlay" aria-hidden="true" />

        <div className="by-container by-hero-content">
          <p className="by-hero-eyebrow">DISCOVER INCREDIBLE INDIA</p>
          <h1 className="by-hero-title">
            Explore India, Plan<br />Better Trips
          </h1>
          <p className="by-hero-subtitle">
            Your complete travel companion for destinations, itineraries, transport, stays, food, events and practical travel information.
          </p>

          {/* Interactive Search Card Widget with Tabs */}
          <HeroSearchWidget />

          {/* Floating Photo Caption Badge */}
          <div className="by-hero-photo-badge">
            <button type="button" className="by-badge-arrow" aria-label="Previous photo">‹</button>
            <div className="by-badge-info">
              <strong>Dal Lake</strong>
              <span>Srinagar, Jammu &amp; Kashmir</span>
            </div>
            <button type="button" className="by-badge-arrow" aria-label="Next photo">›</button>
            <div className="by-badge-dots" aria-hidden="true">
              <span className="dot active" />
              <span className="dot" />
              <span className="dot" />
              <span className="dot" />
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. EIGHT CIRCULAR TRAVEL-TOOL CATEGORIES
          ======================================================== */}
      <section className="by-tools-strip-section">
        <div className="by-container">
          <div className="by-tools-grid">
            {travelTools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="by-tool-pill-item">
                <div
                  className="by-tool-icon-circle"
                  style={{ backgroundColor: tool.bg, color: tool.color }}
                >
                  <span>{tool.icon}</span>
                </div>
                <strong className="by-tool-pill-title">{tool.title}</strong>
                <span className="by-tool-pill-sub">{tool.sub}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. POPULAR DESTINATIONS
          ======================================================== */}
      <section className="by-section">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <h2 className="by-section-title">Popular Destinations</h2>
              <p className="by-section-desc">Explore India&apos;s most loved destinations</p>
            </div>
            <Link href="/destinations" className="by-section-more-link">
              View All Destinations →
            </Link>
          </div>

          <div className="by-destinations-grid">
            {/* Render curated list with active link to Jaipur detail page */}
            {curatedDestinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="by-dest-card"
              >
                <div className="by-dest-img-wrap">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    width="600"
                    height="400"
                    loading="lazy"
                  />
                  <div className="by-dest-gradient" />
                </div>
                <div className="by-dest-overlay-info">
                  <h3 className="by-dest-name">{dest.name}</h3>
                  <p className="by-dest-state">{dest.state}</p>
                  <span className="by-dest-tags">{dest.tags}</span>
                </div>
                <div className="by-dest-circle-arrow" aria-hidden="true">
                  →
                </div>
              </Link>
            ))}

            {/* Seamlessly include published database destinations if any additional exist */}
            {dbDestinations
              .filter((d) => !curatedDestinations.some((c) => c.slug === d.slug))
              .map((dest) => (
                <Link
                  key={dest.slug}
                  href={`/destinations/${dest.slug}`}
                  className="by-dest-card"
                >
                  <div className="by-dest-img-wrap">
                    <img
                      src={dest.cover_image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80'}
                      alt={dest.name_en}
                      width="600"
                      height="400"
                      loading="lazy"
                    />
                    <div className="by-dest-gradient" />
                  </div>
                  <div className="by-dest-overlay-info">
                    <h3 className="by-dest-name">{dest.name_en}</h3>
                    <p className="by-dest-state">{dest.states?.name_en || dest.state_name || 'India'}</p>
                    <span className="by-dest-tags">{dest.summary_en || 'Heritage · Culture · Monuments'}</span>
                  </div>
                  <div className="by-dest-circle-arrow" aria-hidden="true">
                    →
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. PLAN YOUR TRIP (6 TOOLS)
          ======================================================== */}
      <section className="by-section by-section-cream">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <h2 className="by-section-title">Plan Your Trip</h2>
              <p className="by-section-desc">Useful tools to make your India journey easier</p>
            </div>
            <Link href="/trip-planner" className="by-section-more-link">
              View All Tools →
            </Link>
          </div>

          <div className="by-plan-tools-grid">
            {planTripTools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="by-plan-tool-card">
                <div className="by-plan-tool-icon" style={{ backgroundColor: tool.iconBg, color: tool.iconColor }}>
                  <span>{tool.icon}</span>
                </div>
                <div className="by-plan-tool-content">
                  <h3 className="by-plan-tool-title">{tool.title}</h3>
                  <p className="by-plan-tool-desc">{tool.desc}</p>
                </div>
                <div className="by-plan-tool-arrow" aria-hidden="true">
                  →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. EXPLORE INDIA BY REGION (6 REGIONS)
          ======================================================== */}
      <section className="by-section">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <h2 className="by-section-title">Explore India by Region</h2>
              <p className="by-section-desc">Discover destinations across different regions</p>
            </div>
            <Link href="/states" className="by-section-more-link">
              All 36 States &amp; UTs →
            </Link>
          </div>

          <div className="by-regions-grid">
            {regions.map((region) => (
              <Link key={region.name} href={region.href} className="by-region-card">
                <div className="by-region-img-wrap">
                  <img
                    src={region.image}
                    alt={region.name}
                    width="600"
                    height="320"
                    loading="lazy"
                  />
                  <div className="by-region-gradient" />
                </div>
                <div className="by-region-content">
                  <h3 className="by-region-name">{region.name}</h3>
                  <p className="by-region-sub">{region.sub} →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. SUGGESTED ITINERARIES (4 READY-MADE ITINERARIES)
          ======================================================== */}
      <section className="by-section by-section-cream">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <h2 className="by-section-title">Suggested Itineraries</h2>
              <p className="by-section-desc">Ready-made itineraries for your perfect trip</p>
            </div>
            <Link href="/itineraries" className="by-section-more-link">
              View All Itineraries →
            </Link>
          </div>

          <div className="by-itineraries-grid">
            {suggestedItineraries.map((itin) => (
              <Link key={itin.title} href={itin.href} className="by-itin-card">
                <div className="by-itin-img-wrap">
                  <img
                    src={itin.image}
                    alt={itin.title}
                    width="600"
                    height="360"
                    loading="lazy"
                  />
                </div>
                <div className="by-itin-body">
                  <h3 className="by-itin-title">{itin.title}</h3>
                  <p className="by-itin-sub">{itin.subtitle}</p>
                  <div className="by-itin-meta">
                    <span className="by-itin-meta-item">⏱ {itin.duration}</span>
                    <span className="by-itin-meta-item">📍 {itin.places}</span>
                  </div>
                  <div className="by-itin-footer">
                    <span className="by-itin-badge">{itin.tag}</span>
                    <span className="by-itin-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. LATEST FROM OUR BLOG (6 ARTICLES)
          ======================================================== */}
      <section className="by-section">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <h2 className="by-section-title">Latest from Our Blog</h2>
              <p className="by-section-desc">Travel tips, guides and stories from across India</p>
            </div>
            <Link href="/articles" className="by-section-more-link">
              View All Articles →
            </Link>
          </div>

          <div className="by-articles-grid">
            {/* If DB articles exist, merge them at the start */}
            {dbArticles.slice(0, 3).map((art) => (
              <Link key={art.slug} href={`/articles/${art.slug}`} className="by-article-card">
                <div className="by-article-img-wrap">
                  <img
                    src={art.cover_image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=700&q=80'}
                    alt={art.title_en}
                    width="600"
                    height="360"
                    loading="lazy"
                  />
                </div>
                <div className="by-article-body">
                  <h3 className="by-article-title">{art.title_en}</h3>
                  <div className="by-article-footer">
                    <span className="by-article-read-time">📖 5 min read</span>
                    <span className="by-article-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}

            {/* Curated reference articles */}
            {blogArticles.slice(0, 6 - Math.min(dbArticles.length, 3)).map((art) => (
              <Link key={art.title} href={art.href} className="by-article-card">
                <div className="by-article-img-wrap">
                  <img
                    src={art.image}
                    alt={art.title}
                    width="600"
                    height="360"
                    loading="lazy"
                  />
                </div>
                <div className="by-article-body">
                  <h3 className="by-article-title">{art.title}</h3>
                  <div className="by-article-footer">
                    <span className="by-article-read-time">📖 {art.readTime}</span>
                    <span className="by-article-arrow">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          8. ESSENTIAL TRAVEL INFORMATION (6 PILLS)
          ======================================================== */}
      <section className="by-section by-section-cream">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <h2 className="by-section-title">Essential Travel Information</h2>
              <p className="by-section-desc">Quick access to important information for travellers</p>
            </div>
            <Link href="/travel-help" className="by-section-more-link">
              View All →
            </Link>
          </div>

          <div className="by-essential-info-grid">
            {essentialInfoCards.map((info) => (
              <Link key={info.title} href={info.href} className="by-essential-card">
                <div className="by-essential-icon" style={{ backgroundColor: info.iconBg, color: info.iconColor }}>
                  <span>{info.icon}</span>
                </div>
                <div className="by-essential-content">
                  <h3 className="by-essential-title">{info.title}</h3>
                  <p className="by-essential-desc">{info.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. BOTTOM TRIP-PLANNING CTA
          ======================================================== */}
      <section className="by-bottom-cta-section">
        <div className="by-container">
          <div className="by-cta-content">
            <h2 className="by-cta-title">Start Planning Your India Journey Today</h2>
            <p className="by-cta-desc">
              Discover destinations, build your itinerary and get practical travel information — all in one place.
            </p>
          </div>
          <Link href="/trip-planner" className="by-cta-btn">
            Plan Your Trip Now →
          </Link>
        </div>
      </section>
    </main>
  );
}
