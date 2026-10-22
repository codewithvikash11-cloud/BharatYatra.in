import Link from 'next/link';
import CinematicHero from '../components/cinematic-hero.js';
import { getCollection } from '../lib/content-api.mjs';
import { getSiteAppearance, getEditorialImage, DEFAULT_APPEARANCE } from '../lib/appearance.js';
import {
  IconCompass,
  IconMapPin,
  IconCalendar,
  IconRoute,
  IconUtensils,
  IconSparkles,
  IconShield,
  IconCreditCard,
  IconPhoneCall,
  IconLandmark,
  IconSun,
  IconChecklist,
  IconCalculator,
  IconClock,
  IconBookOpen,
  IconMap,
  IconArrowRight,
  IconPassport,
} from '../components/icons.js';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'BharatYatra — Explore India, Plan Better Trips',
  description:
    'Curated, verified travel companion for destinations, itineraries, transport, stays, food, events, and authentic cultural heritage across India.',
};

const travelTools = [
  {
    Icon: IconMapPin,
    title: 'Destinations',
    sub: 'Heritage Towns & Cities',
    href: '/destinations',
    bg: '#EBF4F6',
    color: '#247A72',
  },
  {
    Icon: IconCalendar,
    title: 'Trip Planner',
    sub: 'Day-Wise Itineraries',
    href: '/trip-planner',
    bg: '#FEF6E8',
    color: '#C58B32',
  },
  {
    Icon: IconRoute,
    title: 'Routes & Transport',
    sub: 'Rail, Bus, Air & Roads',
    href: '/routes',
    bg: '#EAF3F5',
    color: '#153E3A',
  },
  {
    Icon: IconUtensils,
    title: 'Food & Stay',
    sub: 'Regional Flavors & Stays',
    href: '/destinations',
    bg: '#FDF0EC',
    color: '#B9653F',
  },
  {
    Icon: IconSparkles,
    title: 'Fairs & Festivals',
    sub: 'Living Celebrations',
    href: '/events',
    bg: '#FBEAF0',
    color: '#B33951',
  },
  {
    Icon: IconChecklist,
    title: 'Travel Checklist',
    sub: 'Monsoon & Heritage Gear',
    href: '/checklist',
    bg: '#EDF5F0',
    color: '#496B55',
  },
  {
    Icon: IconMap,
    title: 'Interactive Map',
    sub: '36 States & Union Territories',
    href: '/states',
    bg: '#EAF1F7',
    color: '#2D68C4',
  },
  {
    Icon: IconCalculator,
    title: 'Budget Planner',
    sub: 'Real Trip Cost Calculator',
    href: '/budget-calculator',
    bg: '#FFF5E6',
    color: '#D97706',
  },
];

const planTripTools = [
  {
    Icon: IconCalendar,
    title: 'Interactive Trip Planner',
    desc: 'Generate day-wise, optimized travel schedules for family, solo, or heritage circuits.',
    href: '/trip-planner',
    iconColor: '#247A72',
    iconBg: '#EBF4F6',
  },
  {
    Icon: IconRoute,
    title: 'Multimodal Route Finder',
    desc: 'Compare Indian Railways (IRCTC), state roadways buses, flights, and highway drives.',
    href: '/routes',
    iconColor: '#C58B32',
    iconBg: '#FEF6E8',
  },
  {
    Icon: IconCalculator,
    title: 'Trip Budget Calculator',
    desc: 'Calculate real-time lodging, local transport, dining, monument tickets, and contingencies.',
    href: '/budget-calculator',
    iconColor: '#10B981',
    iconBg: '#ECFDF5',
  },
  {
    Icon: IconChecklist,
    title: 'Mindful Packing Checklist',
    desc: 'Temple dress codes, monsoon essentials, mountain layering, and regional gear recommendations.',
    href: '/checklist',
    iconColor: '#059669',
    iconBg: '#ECFDF5',
  },
  {
    Icon: IconMapPin,
    title: 'Nearby Heritage & Local Sights',
    desc: 'Discover uncrowded stepwells, historic cenotaphs, and artisan workshops around you.',
    href: '/nearby',
    iconColor: '#B9653F',
    iconBg: '#FDF0EC',
  },
  {
    Icon: IconSun,
    title: 'Seasonal Weather Guide',
    desc: 'Month-by-month temperature, rainfall, and festival calendars for all 36 Indian regions.',
    href: '/weather',
    iconColor: '#D97706',
    iconBg: '#FFFBEB',
  },
];

const essentialInfoCards = [
  {
    Icon: IconPassport,
    title: 'Visa & Entry Protocols',
    desc: 'Official e-Visa eligibility, Indian immigration rules, and entry guidelines for foreign guests.',
    href: '/travel-help#visa',
    iconColor: '#247A72',
    iconBg: '#EBF4F6',
  },
  {
    Icon: IconPhoneCall,
    title: '24/7 National Emergency & Helplines',
    desc: 'Unified Emergency (112) • Ministry of Tourism 24x7 Multi-lingual Tourist Helpline (1363).',
    href: '/travel-help#emergency',
    iconColor: '#B33951',
    iconBg: '#FBEAF0',
  },
  {
    Icon: IconLandmark,
    title: 'Official State Tourism Portals',
    desc: 'Direct, authentic links to state government tourism departments and booking facilities.',
    href: '/travel-help#tourism-portals',
    iconColor: '#2D68C4',
    iconBg: '#EAF1F7',
  },
  {
    Icon: IconCreditCard,
    title: 'Currency, UPI & Digital Payments',
    desc: 'How international cards, ATMs, forex exchange, and instant UPI QR payments work across India.',
    href: '/travel-help#currency',
    iconColor: '#D97706',
    iconBg: '#FFF5E6',
  },
  {
    Icon: IconSun,
    title: 'Monsoon & Climate Advisory',
    desc: 'Real-time seasonal weather, high-altitude acclimatization, and best months to visit.',
    href: '/weather',
    iconColor: '#C58B32',
    iconBg: '#FEF6E8',
  },
  {
    Icon: IconShield,
    title: 'Safe Travel & Cultural Etiquette',
    desc: 'Verified safety guidance, temple customs, authorized guide verification, and mindful travel tips.',
    href: '/travel-help#safety',
    iconColor: '#496B55',
    iconBg: '#EDF5F0',
  },
];

export default async function HomePage() {
  // Fetch real articles, destinations, itineraries, and live appearance settings
  const [destRes, articleRes, itinRes, appearance] = await Promise.all([
    getCollection('destinations', { limit: 6 }),
    getCollection('articles', { limit: 6 }),
    getCollection('itineraries', { limit: 4 }),
    getSiteAppearance(),
  ]);

  const dbDestinations = destRes.state === 'success' && destRes.data?.length ? destRes.data : [];
  const dbArticles = articleRes.state === 'success' && articleRes.data?.length ? articleRes.data : [];
  const dbItineraries = itinRes.state === 'success' && itinRes.data?.length ? itinRes.data : [];

  const heroImage = appearance['site/home/hero'] || DEFAULT_APPEARANCE['site/home/hero'];
  const ctaBgImage = appearance['site/home/cta-bg'] || DEFAULT_APPEARANCE['site/home/cta-bg'];

  const regions = [
    {
      name: 'North India',
      sub: 'Himalayas, Heritage & Sacred Valleys',
      href: '/destinations?region=north',
      image: appearance['site/regions/north'] || DEFAULT_APPEARANCE['site/regions/north'],
    },
    {
      name: 'South India',
      sub: 'Backwaters, Chola Temples & Coasts',
      href: '/destinations?region=south',
      image: appearance['site/regions/south'] || DEFAULT_APPEARANCE['site/regions/south'],
    },
    {
      name: 'East India',
      sub: 'Sacred Architecture, Art & Tea Hills',
      href: '/destinations?region=east',
      image: appearance['site/regions/east'] || DEFAULT_APPEARANCE['site/regions/east'],
    },
    {
      name: 'West India',
      sub: 'Desert Enclaves, Merchant Havelis & Forts',
      href: '/destinations?region=west',
      image: appearance['site/regions/west'] || DEFAULT_APPEARANCE['site/regions/west'],
    },
    {
      name: 'Central India',
      sub: 'Tiger Reserves, Ancient Caves & Temples',
      href: '/destinations?region=central',
      image: appearance['site/regions/central'] || DEFAULT_APPEARANCE['site/regions/central'],
    },
    {
      name: 'North East India',
      sub: 'Living Root Bridges, Cloud Forests & Tribes',
      href: '/destinations?region=northeast',
      image: appearance['site/regions/northeast'] || DEFAULT_APPEARANCE['site/regions/northeast'],
    },
  ];

  return (
    <main className="by-home-root">
      {/* ========================================================
          1. CINEMATIC VIDEO HERO SECTION
          ======================================================== */}
      <CinematicHero poster={heroImage} />

      {/* ========================================================
          2. EIGHT TRAVEL-TOOL PILLS WITH PROFESSIONAL SVG ICONS
          ======================================================== */}
      <section className="by-tools-strip-section">
        <div className="by-container">
          <div className="by-tools-grid">
            {travelTools.map((tool) => {
              const { Icon } = tool;
              return (
                <Link key={tool.title} href={tool.href} className="by-tool-pill-item">
                  <div className="by-tool-icon-circle" style={{ backgroundColor: tool.bg, color: tool.color }}>
                    <Icon size={24} color={tool.color} />
                  </div>
                  <strong className="by-tool-pill-title">{tool.title}</strong>
                  <span className="by-tool-pill-sub">{tool.sub}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURED EDITORIAL STORIES & RECENT JOURNAL POSTS
          ======================================================== */}
      <section className="by-section">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <p className="section-eyebrow">EDITORIAL TRAVEL JOURNAL</p>
              <h2 className="by-section-title">Stories for the Road</h2>
              <p className="by-section-desc">In-depth guides, living traditions, and cultural journeys written by BharatYatra editors.</p>
            </div>
            <Link href="/articles" className="by-section-more-link">
              <span>All Articles</span>
              <IconArrowRight size={16} />
            </Link>
          </div>

          <div className="by-articles-grid">
            {dbArticles.length > 0 ? (
              dbArticles.slice(0, 6).map((art, idx) => {
                const articleImage = getEditorialImage(art, idx % 2 === 0 ? 'haveli' : 'food');
                return (
                  <Link key={art.slug} href={`/articles/${art.slug}`} className="by-article-card">
                    <div className="by-article-img-wrap">
                      <img
                        src={articleImage}
                        alt={art.title_en}
                        width="600"
                        height="360"
                        loading="lazy"
                        decoding="async"
                      />
                      <span className="article-category-badge">{art.category || 'Travel Guide'}</span>
                    </div>
                    <div className="by-article-body">
                      <h3 className="by-article-title">{art.title_en}</h3>
                      {art.excerpt_en && <p className="by-article-snippet">{art.excerpt_en}</p>}
                      <div className="by-article-footer">
                        <span className="by-article-read-time">
                          <IconBookOpen size={14} color="#87938F" style={{ marginRight: '5px' }} />
                          Verified Story
                        </span>
                        <span className="by-article-arrow">
                          <IconArrowRight size={16} color="#247A72" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="by-empty-state-box">
                <IconBookOpen size={36} color="#247A72" />
                <p className="empty-title">Curated Stories in Preparation</p>
                <p className="empty-desc">Our editors are documenting verified destinations across India.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          4. POPULAR DESTINATIONS
          ======================================================== */}
      <section className="by-section by-section-cream">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <p className="section-eyebrow">CURATED DISCOVERY</p>
              <h2 className="by-section-title">Living Heritage &amp; Destinations</h2>
              <p className="by-section-desc">Sacred monuments, living heritage enclaves, and timeless landscapes across India.</p>
            </div>
            <Link href="/destinations" className="by-section-more-link">
              <span>View All Destinations</span>
              <IconArrowRight size={16} />
            </Link>
          </div>

          <div className="by-destinations-grid">
            {dbDestinations.length > 0 ? (
              dbDestinations.map((dest, idx) => {
                const destImage = getEditorialImage(dest, idx === 0 ? 'haveli' : 'heritage');
                return (
                  <Link key={dest.slug} href={`/destinations/${dest.slug}`} className="by-dest-card">
                    <div className="by-dest-img-wrap">
                      <img
                        src={destImage}
                        alt={dest.name_en}
                        width="600"
                        height="400"
                        loading="lazy"
                        decoding="async"
                      />
                      <div className="by-dest-gradient" />
                    </div>
                    <div className="by-dest-overlay-info">
                      <h3 className="by-dest-name">{dest.name_en}</h3>
                      <p className="by-dest-state">{dest.states?.name_en || dest.state_name || 'Rajasthan, India'}</p>
                      <span className="by-dest-tags">{dest.summary_en || 'Merchant Havelis · Fresco Murals · Living Heritage'}</span>
                    </div>
                    <div className="by-dest-circle-arrow" aria-hidden="true">
                      <IconArrowRight size={16} color="#153E3A" />
                    </div>
                  </Link>
                );
              })
            ) : (
              <div className="by-empty-state-box">
                <IconMapPin size={36} color="#247A72" />
                <p className="empty-title">Published Destinations</p>
                <p className="empty-desc">Verified destinations published through the BharatYatra Studio will appear here.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ========================================================
          5. PLAN YOUR TRIP SUITE (6 CARDS WITH PROFESSIONAL SVGS)
          ======================================================== */}
      <section className="by-section">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <p className="section-eyebrow">TRAVEL TOOLKIT</p>
              <h2 className="by-section-title">Plan Your India Journey</h2>
              <p className="by-section-desc">Practical, vetted tools designed to make Indian travel seamless and predictable.</p>
            </div>
            <Link href="/trip-planner" className="by-section-more-link">
              <span>Open Trip Planner</span>
              <IconArrowRight size={16} />
            </Link>
          </div>

          <div className="by-plan-tools-grid">
            {planTripTools.map((tool) => {
              const { Icon } = tool;
              return (
                <Link key={tool.title} href={tool.href} className="by-plan-tool-card">
                  <div className="by-plan-tool-icon" style={{ backgroundColor: tool.iconBg, color: tool.iconColor }}>
                    <Icon size={22} color={tool.iconColor} />
                  </div>
                  <div className="by-plan-tool-content">
                    <h3 className="by-plan-tool-title">{tool.title}</h3>
                    <p className="by-plan-tool-desc">{tool.desc}</p>
                  </div>
                  <div className="by-plan-tool-arrow" aria-hidden="true">
                    <IconArrowRight size={18} color={tool.iconColor} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          6. EXPLORE INDIA BY REGION (6 REGIONS)
          ======================================================== */}
      <section className="by-section by-section-cream">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <p className="section-eyebrow">GEOGRAPHIC CIRCUITS</p>
              <h2 className="by-section-title">Explore India by Region</h2>
              <p className="by-section-desc">Discover heritage, landscapes, and distinct cultural identities across every corner of India.</p>
            </div>
            <Link href="/states" className="by-section-more-link">
              <span>All 36 States &amp; UTs</span>
              <IconArrowRight size={16} />
            </Link>
          </div>

          <div className="by-regions-grid">
            {regions.map((region) => (
              <Link key={region.name} href={region.href} className="by-region-card">
                <div className="by-region-img-wrap">
                  <img src={region.image} alt={region.name} width="600" height="320" loading="lazy" decoding="async" />
                  <div className="by-region-gradient" />
                </div>
                <div className="by-region-content">
                  <h3 className="by-region-name">{region.name}</h3>
                  <p className="by-region-sub">
                    <span>{region.sub}</span>
                    <IconArrowRight size={14} style={{ display: 'inline', marginLeft: '6px' }} />
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================
          7. SUGGESTED ITINERARIES
          ======================================================== */}
      {dbItineraries.length > 0 && (
        <section className="by-section">
          <div className="by-container">
            <div className="by-section-header">
              <div>
                <p className="section-eyebrow">READY-MADE JOURNEYS</p>
                <h2 className="by-section-title">Curated Itineraries</h2>
                <p className="by-section-desc">Tested day-by-day itineraries with transport notes and verified timing.</p>
              </div>
              <Link href="/itineraries" className="by-section-more-link">
                <span>View All Itineraries</span>
                <IconArrowRight size={16} />
              </Link>
            </div>

            <div className="by-itineraries-grid">
              {dbItineraries.map((itin, idx) => {
                const itinImage = getEditorialImage(itin, idx % 2 === 0 ? 'routes' : 'heritage');
                return (
                  <Link key={itin.title_en || itin.slug} href={`/itineraries/${itin.slug}`} className="by-itin-card">
                    <div className="by-itin-img-wrap">
                      <img src={itinImage} alt={itin.title_en} width="600" height="360" loading="lazy" decoding="async" />
                    </div>
                    <div className="by-itin-body">
                      <h3 className="by-itin-title">{itin.title_en}</h3>
                      <p className="by-itin-sub">{itin.summary_en}</p>
                      <div className="by-itin-meta">
                        <span className="by-itin-meta-item">
                          <IconClock size={13} style={{ marginRight: '4px' }} />
                          {itin.duration_days ? `${itin.duration_days} Days` : 'Multi-day'}
                        </span>
                        <span className="by-itin-meta-item">
                          <IconRoute size={13} style={{ marginRight: '4px' }} />
                          Verified
                        </span>
                      </div>
                      <div className="by-itin-footer">
                        <span className="by-itin-badge">{itin.category || 'Route'}</span>
                        <span className="by-itin-arrow">
                          <IconArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ========================================================
          8. ESSENTIAL TRAVEL ADVISORY (6 PILLS WITH PROFESSIONAL SVGS)
          ======================================================== */}
      <section className="by-section by-section-cream">
        <div className="by-container">
          <div className="by-section-header">
            <div>
              <p className="section-eyebrow">TRAVEL SAFETY &amp; READINESS</p>
              <h2 className="by-section-title">Essential Travel Information</h2>
              <p className="by-section-desc">Quick, verified access to official emergency numbers, government links, and payment protocols.</p>
            </div>
            <Link href="/travel-help" className="by-section-more-link">
              <span>All Advisories</span>
              <IconArrowRight size={16} />
            </Link>
          </div>

          <div className="by-essential-info-grid">
            {essentialInfoCards.map((info) => {
              const { Icon } = info;
              return (
                <Link key={info.title} href={info.href} className="by-essential-card">
                  <div className="by-essential-icon" style={{ backgroundColor: info.iconBg, color: info.iconColor }}>
                    <Icon size={22} color={info.iconColor} />
                  </div>
                  <div className="by-essential-content">
                    <h3 className="by-essential-title">{info.title}</h3>
                    <p className="by-essential-desc">{info.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          9. EDITORIAL BOTTOM TRIP-PLANNING CTA
          ======================================================== */}
      <section
        className="by-bottom-cta-section"
        style={{
          backgroundImage: `linear-gradient(180deg, rgba(16, 47, 44, 0.88) 0%, rgba(16, 47, 44, 0.94) 100%), url(${ctaBgImage})`,
          backgroundPosition: 'center 40%',
          backgroundSize: 'cover',
        }}
      >
        <div className="by-container">
          <div className="by-cta-content">
            <span className="by-cta-eyebrow">YOUR JOURNEY AWAITS</span>
            <h2 className="by-cta-title">Start Planning Your India Journey Today</h2>
            <p className="by-cta-desc">
              Discover authentic heritage monuments, craft optimized day-by-day itineraries, check verified train &amp; bus routes, and travel with mindful local knowledge.
            </p>
            <div className="by-cta-actions">
              <Link href="/trip-planner" className="by-cta-btn primary">
                <span>Plan Your Trip Now</span>
                <IconArrowRight size={16} />
              </Link>
              <Link href="/articles" className="by-cta-btn secondary">
                <span>Read Travel Guides</span>
                <IconBookOpen size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
