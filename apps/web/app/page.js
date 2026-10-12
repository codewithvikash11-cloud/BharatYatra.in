import Link from 'next/link';
import { getCollection } from '../lib/content-api.mjs';
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

async function getDestinationsData() {
  const apiRes = await getCollection('destinations', { limit: 4 });
  if (apiRes.state === 'success' && apiRes.data?.length > 0) return apiRes.data;
  try {
    const data = await prisma.destinations.findMany({
      where: { status: 'PUBLISHED' },
      take: 4,
      orderBy: { created_at: 'desc' },
      include: { states: true, districts: true },
    });
    return data;
  } catch {
    return [];
  }
}

async function getStatesData() {
  const apiRes = await getCollection('states', { limit: 8 });
  if (apiRes.state === 'success' && apiRes.data?.length > 0) return apiRes.data;
  try {
    const data = await prisma.states.findMany({
      take: 8,
      orderBy: { name_en: 'asc' },
      select: {
        id: true,
        slug: true,
        name_en: true,
        type: true,
        description_en: true,
      },
    });
    return data;
  } catch {
    return [];
  }
}

async function getArticlesData() {
  const apiRes = await getCollection('articles', { limit: 3 });
  if (apiRes.state === 'success' && apiRes.data?.length > 0) return apiRes.data;
  try {
    const data = await prisma.articles.findMany({
      where: { status: 'PUBLISHED' },
      take: 3,
      orderBy: { published_at: 'desc' },
    });
    return data;
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const [destinations, states, articles, siteMedia] = await Promise.all([
    getDestinationsData(),
    getStatesData(),
    getArticlesData(),
    getSiteMedia(),
  ]);

  const heroBg =
    siteMedia['hero'] ||
    'https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1800&auto=format&fit=crop';

  return (
    <main>
      {/* ====================================================
          1. HERO SECTION (FULLBLEED HAWA MAHAL BACKGROUND)
          ==================================================== */}
      <section
        className="hero-fullbleed"
        style={{ backgroundImage: `url(${heroBg})` }}
        aria-labelledby="hero-title"
      >
        <div className="hero-fullbleed-overlay" aria-hidden="true" />
        <div className="page-shell hero-fullbleed-content">
          <p className="hero-eyebrow-tag">DISCOVER UNSEEN INDIA</p>
          <h1 id="hero-title" className="hero-v0-title">
            Find your way<br />
            <span className="serif-italic-gold">to wonder.</span>
          </h1>
          <p className="hero-v0-desc">
            Curated journeys, forgotten temples, and timeless landscapes across the subcontinent — thoughtfully crafted for mindful explorers.
          </p>
          <div className="hero-v0-actions">
            <Link href="/destinations" className="btn-gold-pill">
              Start exploring
            </Link>
            <Link href="/states" className="hero-link-ghost">
              Browse regions <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          2. OUR PHILOSOPHY (EDITORIAL SPLIT INTRO)
          ==================================================== */}
      <section className="intro-philosophy-section" aria-labelledby="philosophy-title">
        <div className="page-shell">
          <div className="intro-philosophy-grid">
            <div>
              <p className="section-eyebrow">OUR PHILOSOPHY</p>
              <h2 id="philosophy-title" className="philosophy-heading">
                There&apos;s more to India<br />
                <span className="serif-italic-gold">than a bucket list.</span>
              </h2>
            </div>
            <div>
              <p className="philosophy-text">
                From high Himalayan passes to sacred temple ghats, we believe in travel that lingers, respects living culture, and reveals hidden facets of this vast nation. Not hurried sightseeing, but deep cultural connection.
              </p>
              <Link href="/about" className="section-link-more">
                Read our story <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          3. FEATURED DESTINATIONS (ASYMMETRIC EDITORIAL GRID)
          ==================================================== */}
      <section className="content-section page-shell" aria-labelledby="destinations-title">
        <div className="section-heading-row">
          <div className="section-title-group">
            <p className="section-eyebrow">FEATURED DESTINATIONS</p>
            <h2 id="destinations-title" className="section-main-title">
              Places worth<br />
              <span className="serif-italic-gold">getting lost in.</span>
            </h2>
          </div>
          <Link href="/destinations" className="section-link-more">
            All destinations <span>→</span>
          </Link>
        </div>

        <div className="destinations-asymmetric-grid">
          {/* Left Tall Card - Jaipur & Amber */}
          <Link href="/destinations" className="dest-tall-card">
            <img
              src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop"
              alt="Hawa Mahal in Jaipur Rajasthan"
            />
            <div className="dest-card-gradient-overlay" aria-hidden="true" />
            <div className="dest-tall-card-content">
              <p className="dest-kicker">RAJASTHAN</p>
              <h3 className="dest-tall-card-title">Jaipur & Amber</h3>
              <p className="dest-tall-card-summary">
                Pink sandstone palaces, royal observatories, and centuries of artisan craft.
              </p>
              <div className="dest-card-cta-row">
                <span>Explore Destination</span>
                <span>→</span>
              </div>
            </div>
          </Link>

          {/* Right 2x2 Grid */}
          <div className="dest-2x2-grid">
            {/* Card 1: Kerala */}
            <Link href="/destinations?q=Kerala" className="dest-thumb-card">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop"
                alt="Kerala backwaters and houseboats"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="dest-thumb-card-content">
                <p className="dest-kicker">KERALA</p>
                <h3 className="dest-thumb-card-title">Alleppey Backwaters</h3>
              </div>
            </Link>

            {/* Card 2: Agra / Ladakh */}
            <Link href="/destinations?q=Agra" className="dest-thumb-card">
              <img
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=800&auto=format&fit=crop"
                alt="Taj Mahal framed through archway"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="dest-thumb-card-content">
                <p className="dest-kicker">UTTAR PRADESH</p>
                <h3 className="dest-thumb-card-title">The Taj & Agra Fort</h3>
              </div>
            </Link>

            {/* Card 3: Goa */}
            <Link href="/destinations?q=Goa" className="dest-thumb-card">
              <img
                src="https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800&auto=format&fit=crop"
                alt="Goa coastline and Arabian sea"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="dest-thumb-card-content">
                <p className="dest-kicker">GOA</p>
                <h3 className="dest-thumb-card-title">South Goa Coast</h3>
              </div>
            </Link>

            {/* Card 4: Varanasi */}
            <Link href="/destinations?q=Varanasi" className="dest-thumb-card">
              <img
                src="https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=800&auto=format&fit=crop"
                alt="Varanasi river ghats on Ganges"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="dest-thumb-card-content">
                <p className="dest-kicker">VARANASI</p>
                <h3 className="dest-thumb-card-title">Ghats of Kashi</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          4. EXPLORE BY REGION (4 PHOTO CARDS)
          ==================================================== */}
      <section className="content-section shaded" aria-labelledby="regions-title">
        <div className="page-shell">
          <div className="section-heading-row">
            <div className="section-title-group">
              <p className="section-eyebrow">REGIONAL DISCOVERY</p>
              <h2 id="regions-title" className="section-main-title">
                Explore by<br />
                <span className="serif-italic-gold">region.</span>
              </h2>
            </div>
            <Link href="/states" className="section-link-more">
              All 28 States & 8 UTs <span>→</span>
            </Link>
          </div>

          <div className="regions-row-grid">
            {/* North India */}
            <Link href="/states" className="region-photo-card">
              <img
                src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=800&auto=format&fit=crop"
                alt="North India Taj Mahal"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="region-photo-card-content">
                <p className="dest-kicker">9 STATES & UTS</p>
                <h3 className="region-photo-card-title">North India</h3>
                <p className="region-photo-card-sub">Delhi, Rajasthan, UP & Punjab</p>
              </div>
            </Link>

            {/* South India */}
            <Link href="/states" className="region-photo-card">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=800&auto=format&fit=crop"
                alt="South India Backwaters"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="region-photo-card-content">
                <p className="dest-kicker">5 STATES & UTS</p>
                <h3 className="region-photo-card-title">South India</h3>
                <p className="region-photo-card-sub">Kerala, Tamil Nadu & Karnataka</p>
              </div>
            </Link>

            {/* The Himalayas */}
            <Link href="/states" className="region-photo-card">
              <img
                src="https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=800&auto=format&fit=crop"
                alt="Himalayan alpine mountains"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="region-photo-card-content">
                <p className="dest-kicker">HIGH ALTITUDE</p>
                <h3 className="region-photo-card-title">The Himalayas</h3>
                <p className="region-photo-card-sub">Himachal, Ladakh & Kashmir</p>
              </div>
            </Link>

            {/* West India */}
            <Link href="/states" className="region-photo-card">
              <img
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=800&auto=format&fit=crop"
                alt="West India Desert Citadels"
              />
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="region-photo-card-content">
                <p className="dest-kicker">CITADELS & DESERT</p>
                <h3 className="region-photo-card-title">West India</h3>
                <p className="region-photo-card-sub">Rajasthan, Gujarat & Maharashtra</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          5. DEEP TEAL: NOT JUST PLACES. POSSIBILITIES.
          ==================================================== */}
      <section className="dark-possibilities-section" aria-labelledby="possibilities-title">
        <div className="page-shell">
          <div className="possibilities-grid">
            {/* Left */}
            <div>
              <p className="section-eyebrow" style={{ color: 'var(--gold-muted)' }}>
                WHAT WE CURATE
              </p>
              <h2 id="possibilities-title" className="section-main-title" style={{ color: '#FFFDF8' }}>
                Not just places.<br />
                <span className="serif-italic-gold">Possibilities.</span>
              </h2>
              <p className="possibilities-desc">
                Whether you seek architectural grandeur, remote high-altitude trails, or immersion into living cultural traditions, every journey is crafted with depth and context.
              </p>
              <Link href="/destinations" className="btn-gold-pill">
                Find your journey →
              </Link>
            </div>

            {/* Right Curated List */}
            <div>
              <Link href="/destinations?q=heritage" className="possibility-list-item">
                <div className="possibility-left-group">
                  <span className="possibility-num">01</span>
                  <div>
                    <h3 className="possibility-title">Heritage & Architecture</h3>
                    <p className="possibility-subtext">Forts, palaces, stepwells, and UNESCO monuments.</p>
                  </div>
                </div>
                <span className="possibility-arrow">→</span>
              </Link>

              <Link href="/destinations?q=wildlife" className="possibility-list-item">
                <div className="possibility-left-group">
                  <span className="possibility-num">02</span>
                  <div>
                    <h3 className="possibility-title">Wilderness & Wildlife</h3>
                    <p className="possibility-subtext">Tiger corridors of Central India and bird sanctuaries.</p>
                  </div>
                </div>
                <span className="possibility-arrow">→</span>
              </Link>

              <Link href="/destinations?q=spiritual" className="possibility-list-item">
                <div className="possibility-left-group">
                  <span className="possibility-num">03</span>
                  <div>
                    <h3 className="possibility-title">Sacred & Spiritual</h3>
                    <p className="possibility-subtext">Millennia-old river ghats and monastic retreats.</p>
                  </div>
                </div>
                <span className="possibility-arrow">→</span>
              </Link>

              <Link href="/destinations?q=beach" className="possibility-list-item">
                <div className="possibility-left-group">
                  <span className="possibility-num">04</span>
                  <div>
                    <h3 className="possibility-title">Coastal & Slow Travel</h3>
                    <p className="possibility-subtext">Tropical lagoons, spice plantations, and secluded cliffs.</p>
                  </div>
                </div>
                <span className="possibility-arrow">→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          6. INDIA, IN YOUR ELEMENT (4 MINIMALIST CARDS)
          ==================================================== */}
      <section className="content-section page-shell" aria-labelledby="elements-title">
        <div className="section-heading-row">
          <div className="section-title-group">
            <p className="section-eyebrow">FIND YOUR STYLE</p>
            <h2 id="elements-title" className="section-main-title">
              India, in<br />
              <span className="serif-italic-gold">your element.</span>
            </h2>
          </div>
          <Link href="/destinations" className="section-link-more">
            View all categories <span>→</span>
          </Link>
        </div>

        <div className="elements-row-grid">
          {/* Card 01 */}
          <Link href="/destinations?q=heritage" className="element-style-card">
            <span className="element-numeral">01</span>
            <h3 className="element-card-title">Cultural Heritage</h3>
            <p className="element-card-desc">
              Centuries of dynasties, living crafts, royal forts, and sacred architectural monuments.
            </p>
            <span className="element-card-cta">
              Explore Heritage <span>→</span>
            </span>
          </Link>

          {/* Card 02 */}
          <Link href="/destinations?q=spiritual" className="element-style-card">
            <span className="element-numeral">02</span>
            <h3 className="element-card-title">Spiritual Retreats</h3>
            <p className="element-card-desc">
              River ghat rituals, meditative ashrams, and sacred routes of inner contemplation.
            </p>
            <span className="element-card-cta">
              Explore Spiritual <span>→</span>
            </span>
          </Link>

          {/* Card 03 */}
          <Link href="/destinations?q=wildlife" className="element-style-card">
            <span className="element-numeral">03</span>
            <h3 className="element-card-title">Wild & Scenic</h3>
            <p className="element-card-desc">
              High mountain passes, dense tiger reserves, and tranquil backwaters untouched by crowd.
            </p>
            <span className="element-card-cta">
              Explore Wild <span>→</span>
            </span>
          </Link>

          {/* Card 04 */}
          <Link href="/destinations?q=culture" className="element-style-card">
            <span className="element-numeral">04</span>
            <h3 className="element-card-title">Slow & Mindful</h3>
            <p className="element-card-desc">
              Artisanal weaving villages, heritage homestays, and restorative coastal stays.
            </p>
            <span className="element-card-cta">
              Explore Slow Travel <span>→</span>
            </span>
          </Link>
        </div>
      </section>

      {/* ====================================================
          7. DEEP TEAL: JOURNEYS MADE FOR WANDERING (3 ITINERARIES)
          ==================================================== */}
      <section className="dark-itineraries-section" aria-labelledby="itineraries-v0-title">
        <div className="page-shell">
          <div className="section-heading-row">
            <div className="section-title-group">
              <p className="section-eyebrow" style={{ color: 'var(--gold-muted)' }}>
                CURATED ITINERARIES
              </p>
              <h2 id="itineraries-v0-title" className="section-main-title" style={{ color: '#FFFDF8' }}>
                Journeys made<br />
                <span className="serif-italic-gold">for wandering.</span>
              </h2>
            </div>
            <Link href="/destinations" className="section-link-more" style={{ color: '#FFFDF8' }}>
              Browse all itineraries <span>→</span>
            </Link>
          </div>

          <div className="itineraries-row-grid">
            {/* Itinerary 1 */}
            <Link href="/destinations" className="itinerary-photo-card">
              <img
                src="https://images.unsplash.com/photo-1599661046289-e31897846e41?q=80&w=1200&auto=format&fit=crop"
                alt="The Golden Triangle tour"
              />
              <span className="itinerary-badge-pill">7 DAYS</span>
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="itinerary-card-content">
                <h3 className="itinerary-card-title">The Golden Triangle</h3>
                <p className="itinerary-card-route">Delhi · Agra · Jaipur</p>
              </div>
            </Link>

            {/* Itinerary 2 */}
            <Link href="/destinations" className="itinerary-photo-card">
              <img
                src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1200&auto=format&fit=crop"
                alt="Southern Serenity Kerala tour"
              />
              <span className="itinerary-badge-pill">10 DAYS</span>
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="itinerary-card-content">
                <h3 className="itinerary-card-title">Southern Serenity</h3>
                <p className="itinerary-card-route">Kochi · Munnar · Alleppey</p>
              </div>
            </Link>

            {/* Itinerary 3 */}
            <Link href="/destinations" className="itinerary-photo-card">
              <img
                src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop"
                alt="Heritage of the Heart North India"
              />
              <span className="itinerary-badge-pill">8 DAYS</span>
              <div className="dest-card-gradient-overlay" aria-hidden="true" />
              <div className="itinerary-card-content">
                <h3 className="itinerary-card-title">Heritage of the Heart</h3>
                <p className="itinerary-card-route">Delhi · Varanasi · Khajuraho</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ====================================================
          8. STORIES FOR THE ROAD (THE TRAVEL JOURNAL)
          ==================================================== */}
      <section className="content-section page-shell" aria-labelledby="stories-title">
        <div className="section-heading-row">
          <div className="section-title-group">
            <p className="section-eyebrow">THE TRAVEL JOURNAL</p>
            <h2 id="stories-title" className="section-main-title">
              Stories for<br />
              <span className="serif-italic-gold">the road.</span>
            </h2>
          </div>
          <Link href="/articles" className="section-link-more">
            Read all stories <span>→</span>
          </Link>
        </div>

        <div className="stories-row-grid">
          {/* Article 1 */}
          <Link href="/articles" className="story-card-item">
            <div className="story-card-media">
              <img
                src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800&auto=format&fit=crop"
                alt="Traditional Rajasthani folk craft"
              />
            </div>
            <div className="story-card-body">
              <p className="story-card-kicker">CRAFTS & CULTURE · 6 MIN</p>
              <h3 className="story-card-title">
                The living craft traditions of Rajasthan&apos;s desert towns
              </h3>
              <p className="story-card-excerpt">
                Meeting the multi-generational block-printers, weavers, and blue pottery masters keeping ancient heritage alive.
              </p>
              <span className="story-card-link-cta">
                Read story <span>→</span>
              </span>
            </div>
          </Link>

          {/* Article 2 */}
          <Link href="/articles" className="story-card-item">
            <div className="story-card-media">
              <img
                src="https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=800&auto=format&fit=crop"
                alt="Culinary flavors of India"
              />
            </div>
            <div className="story-card-body">
              <p className="story-card-kicker">CULINARY TRAILS · 8 MIN</p>
              <h3 className="story-card-title">
                A culinary map of Old Delhi, Awadh & Lucknow
              </h3>
              <p className="story-card-excerpt">
                Centuries of royal kitchens, secret spice blends, and the historic street-corner delicacies of the walled city.
              </p>
              <span className="story-card-link-cta">
                Read story <span>→</span>
              </span>
            </div>
          </Link>

          {/* Article 3 */}
          <Link href="/articles" className="story-card-item">
            <div className="story-card-media">
              <img
                src="https://images.unsplash.com/photo-1595815771614-ade9d652a65d?q=80&w=800&auto=format&fit=crop"
                alt="Kashmir valley sheep and shepherds"
              />
            </div>
            <div className="story-card-body">
              <p className="story-card-kicker">SLOW TRAVEL · 11 MIN</p>
              <h3 className="story-card-title">
                Walking with the shepherds in Kashmir&apos;s high valleys
              </h3>
              <p className="story-card-excerpt">
                Following nomadic Bakarwal trails through untouched alpine meadows above the mountain treeline.
              </p>
              <span className="story-card-link-cta">
                Read story <span>→</span>
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ====================================================
          9. CLOSING BANNER (THERE'S A WHOLE COUNTRY WAITING)
          ==================================================== */}
      <section className="page-shell" aria-labelledby="closing-banner-title">
        <div className="split-closing-banner">
          <div className="split-closing-copy">
            <p className="section-eyebrow">START YOUR EXPEDITION</p>
            <h2 id="closing-banner-title" className="split-closing-title">
              There&apos;s a whole<br />
              <span className="serif-italic-gold">country</span><br />
              waiting.
            </h2>
            <p className="split-closing-desc">
              From planning your first route to uncovering hidden valleys, let BharatYatra guide every step of your journey.
            </p>
            <div>
              <Link href="/destinations" className="btn-gold-pill">
                Plan your trip
              </Link>
            </div>
          </div>
          <div className="split-closing-photo">
            <img
              src="https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1200&auto=format&fit=crop"
              alt="Taj Mahal reflecting pool in morning sunlight"
            />
          </div>
        </div>
      </section>
    </main>
  );
}
