import Link from 'next/link';
import {
  DestinationCard,
  AttractionCard,
  ArticleCard,
  ContentSearch,
  ApiState,
} from '../components/content.js';
import { getCollection } from '../lib/content-api.mjs';
import {
  HeritageFortSymbol,
  MountainSymbol,
  TempleSymbol,
  CoastlineSymbol,
  RouteSymbol,
  MapSymbol,
} from '../components/travel-symbols.js';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getSiteMedia() {
  try {
    const assets = await prisma.media_assets.findMany({
      where: { storage_path: { startsWith: 'site/home/' } },
    });
    return assets.reduce((acc, asset) => {
      acc[asset.storage_path.replace('site/home/', '')] = asset.public_url || null;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export default async function HomePage() {
  // Fetch real published data from API & database
  const [destinationsRes, attractionsRes, articlesRes, statesRes, siteMedia] = await Promise.all([
    getCollection('destinations', { limit: 4 }),
    getCollection('attractions', { limit: 4 }),
    getCollection('articles', { limit: 3 }),
    getCollection('states', { limit: 8 }),
    getSiteMedia(),
  ]);

  const heroImage = siteMedia['hero'] || '/hero.jpg';

  const travelInterests = [
    {
      title: 'Heritage & Fortresses',
      query: 'heritage',
      desc: 'Rajasthan citadels, Mughal arches, and ancient Deccan ruins.',
      Icon: HeritageFortSymbol,
    },
    {
      title: 'Himalayas & Valleys',
      query: 'himalaya',
      desc: 'High mountain passes, apple orchards, and alpine sanctuaries.',
      Icon: MountainSymbol,
    },
    {
      title: 'Spiritual Journeys',
      query: 'spiritual',
      desc: 'Sacred river ghats, ancient temple corridors, and inner peace.',
      Icon: TempleSymbol,
    },
    {
      title: 'Wildlife & Sanctuaries',
      query: 'wildlife',
      desc: 'Tiger reserves, elephant corridors, and pristine bird sanctuaries.',
      Icon: RouteSymbol,
    },
    {
      title: 'Coasts & Backwaters',
      query: 'beach',
      desc: 'Tropical lagoons, Arabian Sea cliffs, and quiet coastal hamlets.',
      Icon: CoastlineSymbol,
    },
    {
      title: 'Living Arts & Traditions',
      query: 'culture',
      desc: 'Centuries-old artisanal clusters, tribal arts, and vibrant fairs.',
      Icon: MapSymbol,
    },
  ];

  return (
    <main>
      {/* ====================================================
          HOMEPAGE HERO SECTION
          ==================================================== */}
      <section className="hero-section page-shell" aria-labelledby="hero-heading">
        <div className="hero-grid">
          <div className="hero-copy">
            <div className="hero-eyebrow-badge">
              <span className="badge-dot" aria-hidden="true" />
              <span>BHARATYATRA DISCOVERY</span>
            </div>

            <h1 id="hero-heading" className="hero-title">
              India, through every journey.
            </h1>

            <p className="hero-description">
              Discover published destinations, sacred monuments, cultural heritage, and curated travel guides across every state of India — thoughtfully crafted for mindful explorers.
            </p>

            {/* Destination Search Box */}
            <ContentSearch pathname="/destinations" />

            {/* Curated Search Suggestions */}
            <div className="hero-suggestions">
              <span className="suggestions-label">Explore:</span>
              <Link href="/destinations?q=Rajasthan" className="suggestion-pill">Rajasthan</Link>
              <Link href="/destinations?q=Kerala" className="suggestion-pill">Kerala</Link>
              <Link href="/destinations?q=Varanasi" className="suggestion-pill">Varanasi</Link>
              <Link href="/destinations?q=Himachal" className="suggestion-pill">Himachal</Link>
              <Link href="/destinations?q=Goa" className="suggestion-pill">Goa</Link>
              <Link href="/destinations?q=Meghalaya" className="suggestion-pill">Meghalaya</Link>
            </div>

            {/* Hero Calls to Action */}
            <div className="hero-actions-row">
              <Link href="/destinations" className="button-link">
                Explore All Destinations
              </Link>
              <Link href="/states" className="button-link-secondary">
                Browse States & UTs
              </Link>
            </div>
          </div>

          {/* Hero Visual Frame */}
          <div className="hero-visual-frame">
            <img
              src={heroImage}
              alt="Scenic view of India's historic landscape and travel heritage"
              className="hero-visual-img"
            />
            <div className="hero-visual-overlay" aria-hidden="true" />
            <div className="hero-visual-caption">
              <div>
                <p className="caption-tag">NORTH TO SOUTH, EAST TO WEST</p>
                <p className="caption-title">Timeless Landscapes & Heritage</p>
              </div>
              <span className="caption-pill">28 States · 8 UTs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          VALUE PILLARS / PLATFORM PROPOSITIONS
          ==================================================== */}
      <section className="page-shell" aria-label="Platform highlights">
        <div className="pillars-banner">
          <div className="pillars-grid">
            <div className="pillar-item">
              <div className="pillar-icon-box" aria-hidden="true">
                <MapSymbol />
              </div>
              <div className="pillar-content">
                <h3>Pan-India Coverage</h3>
                <p>Curated states and territories from Kashmir to Kanyakumari.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon-box" aria-hidden="true">
                <HeritageFortSymbol />
              </div>
              <div className="pillar-content">
                <h3>Living Heritage</h3>
                <p>Centuries of sacred temples, royal forts, and UNESCO landmarks.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon-box" aria-hidden="true">
                <RouteSymbol />
              </div>
              <div className="pillar-content">
                <h3>Curated Guides</h3>
                <p>In-depth cultural stories and route perspectives from editors.</p>
              </div>
            </div>

            <div className="pillar-item">
              <div className="pillar-icon-box" aria-hidden="true">
                <TempleSymbol />
              </div>
              <div className="pillar-content">
                <h3>Mindful Travel</h3>
                <p>Respectful, authentic exploration of India’s living diversity.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION A: FEATURED DESTINATIONS
          ==================================================== */}
      <section className="content-section page-shell" aria-labelledby="featured-dest-heading">
        <div className="section-heading-row">
          <div className="section-title-group">
            <p className="section-eyebrow">FEATURED DESTINATIONS</p>
            <h2 id="featured-dest-heading" className="section-main-title">Places That Define India</h2>
            <p className="section-subtext">
              Handpicked destinations steeped in timeless architecture, natural splendour, and living cultural heritage.
            </p>
          </div>
          <Link href="/destinations" className="section-link-more">
            All Destinations <span>→</span>
          </Link>
        </div>

        {destinationsRes.state !== 'success' ? (
          <ApiState state={destinationsRes.state} label="Destinations" />
        ) : destinationsRes.data.length === 0 ? (
          <div className="empty-editorial-card">
            <p>
              New published destinations are being added by our travel editors. In the meantime, browse our comprehensive guide across India’s states.
            </p>
            <Link href="/states" className="button-link" style={{ fontSize: '0.88rem' }}>
              Browse States & UTs
            </Link>
          </div>
        ) : (
          <div className="cards-grid-4">
            {destinationsRes.data.map((item) => (
              <DestinationCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ====================================================
          SECTION B: EXPLORE INDIA BY STATE AND REGION
          ==================================================== */}
      <section className="content-section shaded" aria-labelledby="states-region-heading">
        <div className="page-shell">
          <div className="section-heading-row">
            <div className="section-title-group">
              <p className="section-eyebrow">REGIONAL DISCOVERY</p>
              <h2 id="states-region-heading" className="section-main-title">Explore by State & Region</h2>
              <p className="section-subtext">
                From the snow-crowned valleys of Himachal to the backwaters of Kerala, discover the geographic diversity of India.
              </p>
            </div>
            <Link href="/states" className="section-link-more">
              All States & UTs <span>→</span>
            </Link>
          </div>

          {statesRes.state !== 'success' ? (
            <ApiState state={statesRes.state} label="States" />
          ) : statesRes.data.length === 0 ? (
            <div className="empty-editorial-card">
              <p>State guides are currently being prepared.</p>
            </div>
          ) : (
            <div className="states-grid">
              {statesRes.data.map((st) => (
                <Link key={st.slug} href={`/states/${st.slug}`} className="state-card-link">
                  <div className="state-card-header">
                    <h3 className="state-card-title">{st.name_en}</h3>
                    <span className="state-type-badge">{st.type === 'UT' ? 'Union Territory' : 'State'}</span>
                  </div>
                  <p className="state-card-desc">
                    {st.description_en || `Discover destinations, districts, and travel stories across ${st.name_en}.`}
                  </p>
                  <div className="state-card-cta">
                    Explore {st.name_en} <span>→</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          SECTION C: EXPLORE BY TRAVEL INTEREST
          ==================================================== */}
      <section className="content-section page-shell" aria-labelledby="travel-interests-heading">
        <div className="section-heading-row">
          <div className="section-title-group">
            <p className="section-eyebrow">TRAVEL THEMES</p>
            <h2 id="travel-interests-heading" className="section-main-title">Curated Journeys by Interest</h2>
            <p className="section-subtext">
              Tailor your discovery around India’s architectural wonders, spiritual sanctuaries, or tranquil wilderness.
            </p>
          </div>
        </div>

        <div className="interest-grid">
          {travelInterests.map((interest) => {
            const Icon = interest.Icon;
            return (
              <Link
                key={interest.query}
                href={`/destinations?q=${encodeURIComponent(interest.query)}`}
                className="interest-card"
              >
                <div className="interest-icon-circle" aria-hidden="true">
                  <Icon />
                </div>
                <h3 className="interest-title">{interest.title}</h3>
                <p className="interest-desc">{interest.desc}</p>
                <div className="interest-cta">
                  Browse {interest.title} <span>→</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ====================================================
          SECTION D: POPULAR ATTRACTIONS & MONUMENTS
          ==================================================== */}
      <section className="content-section shaded" aria-labelledby="attractions-heading">
        <div className="page-shell">
          <div className="section-heading-row">
            <div className="section-title-group">
              <p className="section-eyebrow">MONUMENTS & WONDERS</p>
              <h2 id="attractions-heading" className="section-main-title">Iconic Attractions Across the Land</h2>
              <p className="section-subtext">
                Ancient stepwells, Dravidian temples, and UNESCO heritage sites that showcase centuries of architectural grandeur.
              </p>
            </div>
            <Link href="/attractions" className="section-link-more">
              All Attractions <span>→</span>
            </Link>
          </div>

          {attractionsRes.state !== 'success' ? (
            <ApiState state={attractionsRes.state} label="Attractions" />
          ) : attractionsRes.data.length === 0 ? (
            <div className="empty-editorial-card">
              <p>
                Attraction guides are currently being cataloged. Explore our published destinations to see landmark highlights.
              </p>
              <Link href="/destinations" className="button-link" style={{ fontSize: '0.88rem' }}>
                View Destinations
              </Link>
            </div>
          ) : (
            <div className="cards-grid-4">
              {attractionsRes.data.map((item) => (
                <AttractionCard key={`${item.destinations?.slug || 'guide'}-${item.slug}`} item={item} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ====================================================
          SECTION E: TRAVEL GUIDES & EDITORIAL ARTICLES
          ==================================================== */}
      <section className="content-section page-shell" aria-labelledby="editorial-heading">
        <div className="section-heading-row">
          <div className="section-title-group">
            <p className="section-eyebrow">THE TRAVEL JOURNAL</p>
            <h2 id="editorial-heading" className="section-main-title">Stories, Guides & Field Notes</h2>
            <p className="section-subtext">
              In-depth perspectives and cultural context written for thoughtful travelers discovering India.
            </p>
          </div>
          <Link href="/articles" className="section-link-more">
            All Stories & Guides <span>→</span>
          </Link>
        </div>

        {articlesRes.state !== 'success' ? (
          <ApiState state={articlesRes.state} label="Articles" />
        ) : articlesRes.data.length === 0 ? (
          <div className="empty-editorial-card">
            <p>
              Our editorial stories and field guides are currently being prepared for publication. Visit our destinations section to begin exploring.
            </p>
            <Link href="/destinations" className="button-link" style={{ fontSize: '0.88rem' }}>
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div className="editorial-grid">
            {articlesRes.data.map((item) => (
              <ArticleCard key={item.slug} item={item} />
            ))}
          </div>
        )}
      </section>

      {/* ====================================================
          SECTION F: SUGGESTED ITINERARIES (INFO/EMPTY STATE)
          ==================================================== */}
      <section className="content-section shaded" aria-labelledby="itineraries-heading">
        <div className="page-shell">
          <div className="itinerary-info-box">
            <div className="itinerary-info-icon" aria-hidden="true">
              <RouteSymbol />
            </div>
            <p className="section-eyebrow" style={{ marginBottom: '0.5rem' }}>JOURNEY BLUEPRINTS</p>
            <h2 id="itineraries-heading" className="itinerary-info-title">Suggested Travel Itineraries</h2>
            <p className="itinerary-info-desc">
              Curated multi-day route itineraries are currently being crafted by our travel editors. In the meantime, browse our destinations and states to plan your bespoke journey across India.
            </p>
            <div className="itinerary-actions">
              <Link href="/destinations" className="button-link">
                Browse Destinations
              </Link>
              <Link href="/states" className="button-link-secondary">
                Explore by State
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION G: INDIA, CULTURE, AND EXPERIENCES
          ==================================================== */}
      <section className="content-section page-shell" aria-labelledby="culture-heading">
        <div className="section-heading-row">
          <div className="section-title-group">
            <p className="section-eyebrow">LIVING CULTURE</p>
            <h2 id="culture-heading" className="section-main-title">Cultural Tapestry & Traditions</h2>
            <p className="section-subtext">
              Immerse yourself in regional craftsmanship, sacred rituals, and historic architectural marvels.
            </p>
          </div>
        </div>

        <div className="culture-grid">
          <div className="culture-card">
            <span className="culture-tag">SACRED TRADITIONS</span>
            <h3 className="culture-title">Rivers, Ghats & Sacred Waters</h3>
            <p className="culture-text">
              From the dawn arati along the Varanasi riverfront to the pristine springs of Uttarakhand, India’s sacred waters reflect millennia of living ritual and continuous community veneration.
            </p>
            <Link href="/destinations?q=Varanasi" className="culture-link">
              Discover Sacred Trails <span>→</span>
            </Link>
          </div>

          <div className="culture-card">
            <span className="culture-tag">ARTISAN CLUSTERS</span>
            <h3 className="culture-title">Living Crafts & Handlooms</h3>
            <p className="culture-text">
              Centuries-old artisan traditions endure across regions — from Pashmina wool in Kashmir and Chanderi silks in Madhya Pradesh to the intricate block prints of Rajasthan.
            </p>
            <Link href="/destinations?q=Rajasthan" className="culture-link">
              Explore Craft Centers <span>→</span>
            </Link>
          </div>

          <div className="culture-card">
            <span className="culture-tag">TIMELESS ARCHITECTURE</span>
            <h3 className="culture-title">Stepwells, Havelis & Palaces</h3>
            <p className="culture-text">
              Extraordinary subterranean stepwells in Gujarat, painted havelis of Shekhawati, and monolithic rock-cut cave temples showcase unprecedented feats of Indian design.
            </p>
            <Link href="/destinations?q=Heritage" className="culture-link">
              Explore Architectural Wonders <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          SECTION H: FINAL EXPLORATION CALL TO ACTION
          ==================================================== */}
      <section className="closing-cta-section" aria-labelledby="closing-cta-heading">
        <div className="page-shell closing-cta-content">
          <p className="closing-cta-eyebrow">YOUR JOURNEY BEGINS HERE</p>
          <h2 id="closing-cta-heading" className="closing-cta-title">
            Ready to experience the true essence of India?
          </h2>
          <p className="closing-cta-desc">
            Discover authentic destinations, read curated travel guides, and immerse yourself in the rich tapestry of Indian heritage and natural wonders.
          </p>
          <div className="closing-cta-buttons">
            <Link href="/destinations" className="btn-cta-gold">
              Explore Destinations
            </Link>
            <Link href="/states" className="btn-cta-outline-cream">
              Browse States & UTs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
