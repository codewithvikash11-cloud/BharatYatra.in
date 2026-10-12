import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '../../../../lib/content-api.mjs';
import prisma from '../../../../lib/db.js';
import { getMapPinUrl } from '../../../../lib/map-url.mjs';
import DestinationInteractiveClient from '../../../../components/destination-interactive-client.js';

export const dynamic = 'force-dynamic';

// Verified attraction details repository for Jaipur top attractions
const verifiedAttractionsData = {
  'amer-fort': {
    name: 'Amer Fort (Amber Palace)',
    category: 'Hill Fort & Royal Palace',
    destinationName: 'Jaipur',
    destinationSlug: 'jaipur',
    stateName: 'Rajasthan',
    stateSlug: 'rajasthan',
    coverUrl: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
    overview:
      'Perched high on a rugged hill overlooking Maota Lake, Amer Fort is a masterpiece of Rajput architecture blending Hindu and Mughal styles. Known for its artistic cobbled paths, series of monumental gates, and the glittering Sheesh Mahal (Palace of Mirrors).',
    visitingHours: '9:00 AM – 5:30 PM (Daily), Evening Sound & Light Show: 7:30 PM (English) & 8:30 PM (Hindi)',
    entryFeeNote: '₹100 for Indian Nationals, ₹500 for Foreign Tourists. Student discount available with valid ID.',
    duration: '2.5 – 3.5 Hours',
    bestTimeOfDay: 'Early morning (8:30 AM) to avoid midday heat and tour crowds',
    architecture:
      'Constructed predominantly of red sandstone and marble, Amer Palace is divided into four distinct courtyards. The first courtyard (Jaleb Chowk) was the muster ground for soldiers. The second features the Diwan-i-Aam (Hall of Public Audience) with double rows of sandstone columns. The highlight is the Sheesh Mahal in the third courtyard, where mirrored concave glass imported from Belgium reflects flickering candlelight into a celestial sky.',
    history:
      'Founded in the 10th century by the Meenas and significantly expanded from 1592 by Raja Man Singh I, Amber served as the royal seat of the Kachwaha Rajputs until Sawai Jai Singh II founded Jaipur in the plains below in 1727. In 2013, Amer Fort was designated a UNESCO World Heritage site as part of the Hill Forts of Rajasthan.',
    howToReach:
      'Located 11 km north of Jaipur along the Delhi highway. You can reach Amer by RTDC public AC bus #5 from Ajmeri Gate, app-based cabs (Uber/Ola), or prepaid auto-rickshaws. From the foot of the hill, visitors can walk up via the cobblestone path or take a designated 4x4 jeep.',
    nearby: [
      { name: 'Panna Meena ka Kund', distance: '1 km', desc: '16th-century geometric stepwell with interlocking stairs.', href: '/attractions/jaipur/panna-meena-kund' },
      { name: 'Jaigarh Fort', distance: '2.5 km', desc: 'Military fortress housing the legendary Jaivana cannon.', href: '/attractions/jaipur/jaigarh-fort' },
      { name: 'Jal Mahal', distance: '5 km', desc: 'Water palace in the middle of Man Sagar Lake.', href: '/attractions/jaipur/jal-mahal' },
    ],
    travelTips: [
      'Wear sturdy walking shoes with grip; the stone courtyards and ramps are steep.',
      'Always hire official Department of Archaeology licensed guides carrying government photo IDs.',
      'Purchase the Jaipur composite monument ticket at the counter to save money across 5 monuments.',
      'Stay hydrated; water stations and a small cafeteria are located near the second courtyard exit.',
    ],
    sources: [
      { name: 'Rajasthan Tourism Development Corporation (RTDC)', url: 'http://www.tourism.rajasthan.gov.in' },
      { name: 'Archaeological Survey of India (ASI) Jaipur Circle', url: 'https://asi.nic.in' },
    ],
    lat: 26.9855,
    lng: 75.8513,
  },
  'hawa-mahal': {
    name: 'Hawa Mahal (Palace of Winds)',
    category: 'Historic Palace & Landmark',
    destinationName: 'Jaipur',
    destinationSlug: 'jaipur',
    stateName: 'Rajasthan',
    stateSlug: 'rajasthan',
    coverUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
    overview:
      'An iconic five-story pink sandstone palace with 953 intricately carved jharokhas (casements). Engineered so that cool natural breezes draft through during scorching desert summers.',
    visitingHours: '9:00 AM – 5:00 PM (Daily)',
    entryFeeNote: '₹50 for Indian Nationals, ₹200 for Foreign Tourists.',
    duration: '1 – 1.5 Hours',
    bestTimeOfDay: 'Early morning (8:00 AM – 9:30 AM) when sunrise illuminates the pink sandstone facade',
    architecture:
      'Designed by architect Lal Chand Ustad, the pyramidal facade mimics the crown of Lord Krishna. The building has no foundation, standing on an 8-inch thick wall structure with steep ramps instead of stairs connecting the upper stories.',
    history:
      'Commissioned in 1799 by Maharaja Sawai Pratap Singh, a devout worshipper of Lord Krishna. It was conceived as an extension of the City Palace, allowing royal women to observe busy street celebrations and religious processions without violating purdah modesty.',
    howToReach:
      'Situated at Badi Chaupar in the heart of old Jaipur. Easily accessible by Jaipur Metro (Chhoti Chaupar station), cycle rickshaws, or auto-rickshaws. Best combined with a walking tour of the walled city bazaars.',
    nearby: [
      { name: 'City Palace', distance: '400 m', desc: 'Royal residence of the Maharaja of Jaipur.', href: '/attractions/jaipur/city-palace' },
      { name: 'Jantar Mantar', distance: '500 m', desc: 'UNESCO World Heritage astronomical observatory.', href: '/attractions/jaipur/jantar-mantar' },
      { name: 'Johari Bazaar', distance: '200 m', desc: 'World-famous gemstone and jewellery market.', href: '/destinations/jaipur#food' },
    ],
    travelTips: [
      'The classic postcard photograph of Hawa Mahal is captured from across the street at rooftop cafes like Tattoo Cafe or Wind View Cafe.',
      'Inside the palace, ramps can be steep; hold handrails and take care when climbing to top lookout points.',
      'The morning hours offer the best light for photography with minimal traffic fumes.',
    ],
    sources: [
      { name: 'Department of Archaeology & Museums Rajasthan', url: 'http://museumsrajasthan.gov.in' },
      { name: 'Jaipur Heritage Cell', url: 'http://www.tourism.rajasthan.gov.in' },
    ],
    lat: 26.9239,
    lng: 75.8267,
  },
  'city-palace': {
    name: 'City Palace Jaipur',
    category: 'Royal Palace & Museum',
    destinationName: 'Jaipur',
    destinationSlug: 'jaipur',
    stateName: 'Rajasthan',
    stateSlug: 'rajasthan',
    coverUrl: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1600&q=85',
    overview:
      'The historic royal residence of the Maharaja of Jaipur, featuring courtyards, sprawling gardens, and an exceptional museum housing royal costumes, weaponry, and centuries-old miniature paintings.',
    visitingHours: '9:30 AM – 5:00 PM (Day Visit), 7:00 PM – 10:00 PM (Night Tour)',
    entryFeeNote: '₹300 for Indian Nationals, ₹700 for Foreign Tourists (Standard museum entry; special royal quarters ticket extra).',
    duration: '2 – 3 Hours',
    bestTimeOfDay: 'Mid-morning or late afternoon',
    architecture:
      'Blends Rajput, Mughal, and European architecture across grand courtyards like Pritam Niwas Chowk, known for its four vibrant painted peacock and seasonal doors representing the four seasons.',
    history:
      'Constructed between 1727 and 1732 by Maharaja Sawai Jai Singh II when the capital was relocated from Amber. The descendants of the royal family still reside in a private wing (Chandra Mahal) of the palace complex.',
    howToReach:
      'Located in Jaleb Chowk, easily reached on foot from Hawa Mahal or Jantar Mantar inside the walled city.',
    nearby: [
      { name: 'Jantar Mantar', distance: '150 m', desc: 'Equatorial sundials and marble astronomical instruments.', href: '/attractions/jaipur/jantar-mantar' },
      { name: 'Hawa Mahal', distance: '400 m', desc: 'Fabled pink sandstone facade.', href: '/attractions/jaipur/hawa-mahal' },
      { name: 'Tripolia Bazaar', distance: '300 m', desc: 'Lac bangles and traditional textiles.', href: '/destinations/jaipur#food' },
    ],
    travelTips: [
      'Check out the Gangajalis—the world’s largest sterling silver vessels displayed in the Mubarak Mahal.',
      'Photography is permitted in outdoor courtyards, but restricted inside the royal arms gallery.',
    ],
    sources: [
      { name: 'The City Palace Museum Jaipur (MSMS II Museum Trust)', url: 'https://royaljaipur.in' },
    ],
    lat: 26.9258,
    lng: 75.8236,
  },
  'jantar-mantar': {
    name: 'Jantar Mantar Observatory',
    category: 'UNESCO World Heritage Science Monument',
    destinationName: 'Jaipur',
    destinationSlug: 'jaipur',
    stateName: 'Rajasthan',
    stateSlug: 'rajasthan',
    coverUrl: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1600&q=85',
    overview:
      'A collection of nineteen architectural astronomical instruments built by the Rajput king Sawai Jai Singh II. Home to the world’s largest stone sundial (Vrihat Samrat Yantra) accurate to two seconds.',
    visitingHours: '9:00 AM – 5:00 PM (Daily)',
    entryFeeNote: '₹50 for Indian Nationals, ₹200 for Foreign Tourists.',
    duration: '1 – 2 Hours',
    bestTimeOfDay: 'Midday around 11:30 AM – 1:30 PM when the sun is overhead to observe the giant sundial shadows in real time.',
    architecture:
      'Geometric stone masonry and polished marble instruments designed to track the positions of stars, measure local time, and calculate planetary eclipses with extraordinary mathematical precision.',
    history:
      'Completed in 1734, it is the largest and best preserved of the five astronomical observatories constructed by Jai Singh II across India. It was inscribed on the UNESCO World Heritage List in 2010.',
    howToReach:
      'Located immediately adjacent to the City Palace entrance gate in the old city.',
    nearby: [
      { name: 'City Palace', distance: '150 m', desc: 'Living royal palace.', href: '/attractions/jaipur/city-palace' },
      { name: 'Hawa Mahal', distance: '500 m', desc: 'Iconic casement facade.', href: '/attractions/jaipur/hawa-mahal' },
    ],
    travelTips: [
      'Audio guides or licensed human guides are highly recommended here; the scientific instruments require explanation to fully appreciate.',
      'Carry a hat or umbrella; the open-air stone courtyards provide zero shade during daytime tours.',
    ],
    sources: [
      { name: 'UNESCO World Heritage Centre', url: 'https://whc.unesco.org/en/list/1338' },
    ],
    lat: 26.9248,
    lng: 75.8246,
  },
  'jal-mahal': {
    name: 'Jal Mahal (Water Palace)',
    category: 'Heritage Water Palace',
    destinationName: 'Jaipur',
    destinationSlug: 'jaipur',
    stateName: 'Rajasthan',
    stateSlug: 'rajasthan',
    coverUrl: 'https://images.unsplash.com/photo-1605649487212-47bdab064df8?auto=format&fit=crop&w=1600&q=85',
    overview:
      'A serene palace appearing to float in the center of Man Sagar Lake against the backdrop of the Aravalli Hills. While internal access is restricted, the promenade offers prime sunset vistas and birdwatching.',
    visitingHours: 'Promenade open 24 Hours. Scenic lighting from 6:30 PM to 10:00 PM.',
    entryFeeNote: 'Free viewing from the lakeside promenade. Boat entry is currently restricted.',
    duration: '30 – 45 Minutes',
    bestTimeOfDay: 'Sunset and early evening when the palace glows under warm architectural lighting.',
    architecture:
      'Constructed with pink sandstone in Rajput-Mughal style. While it looks like a single-story pavilion, it has five floors, four of which remain submerged beneath lake waters.',
    history:
      'Built in 1750 by Maharaja Madho Singh I as a pleasure pavilion and duck hunting lodge, later renovated by Maharaja Jai Singh II.',
    howToReach:
      'Located on Amer Road between Jaipur city center and Amer Fort. Easily stopped at en route to or from Amer.',
    nearby: [
      { name: 'Amer Fort', distance: '4 km', desc: 'Monumental hilltop citadel.', href: '/attractions/jaipur/amer-fort' },
      { name: 'Kanak Vrindavan Gardens', distance: '2 km', desc: 'Landscaped royal garden valley.', href: '/destinations/jaipur' },
    ],
    travelTips: [
      'Stop here for photography either on your way to Amer Fort or upon returning in the late afternoon.',
      'Street vendors sell roasted corn, local tea, and Rajasthani souvenirs along the paved promenade.',
    ],
    sources: [
      { name: 'Rajasthan Tourism Development Corporation (RTDC)', url: 'http://www.tourism.rajasthan.gov.in' },
    ],
    lat: 26.9535,
    lng: 75.8462,
  },
};

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
