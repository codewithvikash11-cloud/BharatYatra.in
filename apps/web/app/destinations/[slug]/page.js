import Link from 'next/link';
import { notFound } from 'next/navigation';
import prisma from '../../../lib/db.js';
import { getContent } from '../../../lib/content-api.mjs';
import { getMapPinUrl } from '../../../lib/map-url.mjs';
import DestinationInteractiveClient, {
  DestinationItineraryTabs,
  DestinationHistoryToggle,
  SidebarPlanForm,
} from '../../../components/destination-interactive-client.js';
import {
  IconBuildingMonument,
  IconBuildingCastle,
  IconBuildingArch,
  IconSun,
  IconCloudSun,
  IconCloudRain,
  IconSnowflake,
  IconClock,
  IconPlane,
  IconTrain,
  IconBus,
  IconCar,
  IconMotorbike,
  IconSparkles,
  IconSoup,
  IconUsers,
  IconBed,
  IconBookOpen,
  IconBulb,
  IconMapPin,
  IconMap,
  IconCalendarEvent,
  IconInfoCircle,
  IconPhoneCall,
  IconCheck,
  IconArrowRight,
  IconExternalLink,
  IconRoute,
} from '../../../components/icons.js';

export const dynamic = 'force-dynamic';

// Curated verified data for Jaipur (matching reference screenshot 2)
const jaipurData = {
  slug: 'jaipur',
  name: 'Jaipur',
  subtitle: 'The Pink City of India',
  state: 'Rajasthan',
  stateSlug: 'rajasthan',
  overview:
    "A royal blend of history, culture, architecture and vibrant markets, Jaipur is the capital of Rajasthan and one of India's most popular travel destinations.",
  coverUrl: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85',
  keyFacts: [
    { label: 'Forts & Palaces', value: '20+', icon: IconBuildingCastle },
    { label: 'Best Time', value: 'Oct – Mar', icon: IconSun },
    { label: 'Ideal Trip Duration', value: '2 – 4 Days', icon: IconClock },
    { label: 'Nearest Airport', value: 'Jaipur (JAI)', icon: IconPlane },
  ],
  gallery: [
    { title: 'Hawa Mahal at Sunset', url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Amer Fort Ramparts & Maota Lake', url: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Jal Mahal in Man Sagar Lake', url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80' },
    { title: 'City Palace Courtyard & Peacock Gate', url: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Jantar Mantar Astronomical Observatory', url: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80' },
    { title: 'Bapu Bazaar & Johari Bazaar Markets', url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80' },
  ],
  about: {
    text:
      'Jaipur, the capital of Rajasthan, is known as the Pink City for its stunning pink-coloured buildings, royal palaces and rich cultural heritage. Founded in 1727 by Maharaja Sawai Jai Singh II, Jaipur beautifully blends history, architecture, tradition and modern city life. From majestic forts like Amer Fort to vibrant markets and delicious Rajasthani cuisine, Jaipur offers a complete travel experience for history lovers, photographers and culture enthusiasts.',
    thumb: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=600&q=80',
    thumbCaption: 'Jal Mahal, Jaipur',
  },
  highlights: [
    { icon: IconBuildingCastle, text: 'Majestic forts and palaces' },
    { icon: IconBuildingMonument, text: 'Vibrant local markets' },
    { icon: IconBuildingArch, text: 'UNESCO World Heritage sites nearby' },
    { icon: IconSparkles, text: 'Rich Rajput history and culture' },
    { icon: IconSoup, text: 'Delicious Rajasthani cuisine' },
    { icon: IconUsers, text: 'Great for family, solo and group travel' },
  ],
  history: {
    summary:
      'Jaipur was founded in 1727 by Maharaja Sawai Jai Singh II, the ruler of Amber, as a planned city based on Vastu Shastra and modern urban design principles of that time. The city played a major role in trade, astronomy and art. Many of its forts, palaces and observatories still showcase the scientific and architectural vision of Maharaja Jai Singh II.',
    extended:
      'The city was laid out in nine grid-like rectangular blocks according to Indian Shilpa Shastra under the guidance of chief architect Vidyadhar Bhattacharya. In 1876, during the reign of Sawai Ram Singh II, the entire city was painted terracotta pink to welcome the Prince of Wales, giving rise to its legendary epithet "The Pink City". In July 2019, the historic walled city of Jaipur was officially designated a UNESCO World Heritage site.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
  },
  seasons: [
    {
      season: 'Winter',
      period: 'Oct – Mar',
      desc: 'Best time for sightseeing. Pleasant weather.',
      temp: '10°C – 25°C',
      badge: 'Recommended',
      badgeClass: 'rec',
      icon: IconSnowflake,
    },
    {
      season: 'Summer',
      period: 'Apr – Jun',
      desc: 'Hot weather. Not ideal for daytime travel.',
      temp: '28°C – 45°C',
      badge: 'Not Recommended',
      badgeClass: 'not-rec',
      icon: IconSun,
    },
    {
      season: 'Monsoon',
      period: 'Jul – Sep',
      desc: 'Moderate rainfall, green surroundings.',
      temp: '23°C – 35°C',
      badge: 'Moderate',
      badgeClass: 'mod',
      icon: IconCloudRain,
    },
    {
      season: 'Festivals',
      period: 'Oct – Mar',
      desc: 'Experience local culture during Diwali, Teej and Jaipur Literature Festival.',
      temp: 'Oct – Mar',
      badge: 'Great for Culture',
      badgeClass: 'cult',
      icon: IconSparkles,
    },
  ],
  howToReach: [
    {
      mode: 'By Air',
      icon: IconPlane,
      desc: 'Jaipur International Airport (JAI) is well connected to major Indian cities and some international destinations.',
      action: 'View Flight Options →',
      href: '/routes?to=Jaipur&mode=air',
    },
    {
      mode: 'By Train',
      icon: IconTrain,
      desc: 'Jaipur Junction is a major railway station with regular trains from Delhi, Mumbai, Kolkata, Chennai and more.',
      action: 'View Train Options →',
      href: '/routes?to=Jaipur&mode=train',
    },
    {
      mode: 'By Bus',
      icon: IconBus,
      desc: 'Well connected by state and private buses from nearby cities like Delhi, Agra, Udaipur and Ajmer.',
      action: 'View Bus Options →',
      href: '/routes?to=Jaipur&mode=bus',
    },
    {
      mode: 'By Road',
      icon: IconCar,
      desc: 'Good road connectivity via NH48, NH52 and expressways. Popular for road trips from Delhi and Agra (Golden Triangle).',
      action: 'View Road Trip →',
      href: '/routes?to=Jaipur&mode=road',
    },
  ],
  gettingAround: [
    { mode: 'Auto Rickshaw', icon: IconCar, desc: 'Widely available. Negotiate fare or use apps like Uber/Ola Auto.' },
    { mode: 'Taxi / Cab', icon: IconCar, desc: 'Ola, Uber and local rental taxis available with AC comfort.' },
    { mode: 'City Bus', icon: IconBus, desc: 'Affordable option for local travel and connecting monument stops.' },
    { mode: 'Rental Bike / Car', icon: IconMotorbike, desc: 'Good for nearby attractions, Nahargarh Fort, and day trips.' },
  ],
  places: [
    {
      name: 'Amer Fort',
      category: 'Fort',
      time: '2-3 hrs',
      rating: '4.6 (12K)',
      image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=500&q=80',
      slug: 'amer-fort',
    },
    {
      name: 'Hawa Mahal',
      category: 'Palace',
      time: '1-2 hrs',
      rating: '4.5 (18K)',
      image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=500&q=80',
      slug: 'hawa-mahal',
    },
    {
      name: 'City Palace',
      category: 'Palace',
      time: '2-3 hrs',
      rating: '4.4 (10K)',
      image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=500&q=80',
      slug: 'city-palace',
    },
    {
      name: 'Jantar Mantar',
      category: 'Heritage',
      time: '1-2 hrs',
      rating: '4.4 (8K)',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=500&q=80',
      slug: 'jantar-mantar',
    },
    {
      name: 'Jal Mahal',
      category: 'Lake',
      time: '1-2 hrs',
      rating: '4.3 (6K)',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=500&q=80',
      slug: 'jal-mahal',
    },
  ],
  itineraries: {
    '2days': {
      tabLabel: '2 Days',
      days: [
        {
          title: 'Day 1 — Royal Heritage',
          stops: [
            { name: 'Amer Fort', time: '2-3 hrs' },
            { name: 'Jal Mahal', time: 'Photo stop' },
            { name: 'Hawa Mahal', time: '1-2 hrs' },
            { name: 'City Palace', time: '2-3 hrs' },
            { name: 'Local Markets', time: 'Evening' },
          ],
        },
        {
          title: 'Day 2 — Culture & Local Experience',
          stops: [
            { name: 'Jantar Mantar', time: '1-2 hrs' },
            { name: 'Albert Hall Museum', time: '1-2 hrs' },
            { name: 'Birla Mandir', time: '1 hr' },
            { name: 'Local Food Experience', time: '' },
            { name: 'Shopping at Johari & Bapu Bazaar', time: '' },
          ],
        },
      ],
    },
    '3days': {
      tabLabel: '3 Days',
      days: [
        {
          title: 'Day 1 — Royal Heritage',
          stops: [
            { name: 'Amer Fort', time: '2-3 hrs' },
            { name: 'Jaigarh Fort & Jaivana Cannon', time: '1-2 hrs' },
            { name: 'Jal Mahal', time: 'Photo stop' },
            { name: 'Hawa Mahal', time: '1-2 hrs' },
          ],
        },
        {
          title: 'Day 2 — City Heart & Palaces',
          stops: [
            { name: 'City Palace Complex', time: '2-3 hrs' },
            { name: 'Jantar Mantar', time: '1-2 hrs' },
            { name: 'Albert Hall Museum', time: '1-2 hrs' },
            { name: 'Bapu Bazaar Textiles', time: 'Evening' },
          ],
        },
        {
          title: 'Day 3 — Fort Views & Culture',
          stops: [
            { name: 'Nahargarh Fort & Sunset Point', time: '2 hrs' },
            { name: 'Galtaji Monkey Temple', time: '1.5 hrs' },
            { name: 'Chokhi Dhani Cultural Village', time: 'Evening' },
          ],
        },
      ],
    },
    '4days': {
      tabLabel: '4 Days',
      days: [
        {
          title: 'Day 1 — Forts of Amber',
          stops: [
            { name: 'Amer Fort & Elephant Village', time: '3 hrs' },
            { name: 'Panna Meena ka Kund Stepwell', time: '45 mins' },
            { name: 'Jaigarh Fort', time: '1.5 hrs' },
          ],
        },
        {
          title: 'Day 2 — The Pink City Center',
          stops: [
            { name: 'Hawa Mahal', time: '1 hr' },
            { name: 'City Palace Museum', time: '2.5 hrs' },
            { name: 'Jantar Mantar', time: '1.5 hrs' },
            { name: 'Johari Bazaar Jewellery', time: 'Evening' },
          ],
        },
        {
          title: 'Day 3 — Art & Panoramic Forts',
          stops: [
            { name: 'Albert Hall Museum', time: '2 hrs' },
            { name: 'Nahargarh Fort Wax Museum', time: '2 hrs' },
            { name: 'Padao Restaurant Sunset', time: 'Evening' },
          ],
        },
        {
          title: 'Day 4 — Craft & Heritage Excursion',
          stops: [
            { name: 'Bagru / Sanganer Block Print Workshops', time: 'Half day' },
            { name: 'Galtaji Sun Temple', time: '2 hrs' },
            { name: 'Traditional Rajasthani Thali Dinner', time: 'Evening' },
          ],
        },
      ],
    },
  },
  famousFood: [
    { name: 'Dal Baati Churma', image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?auto=format&fit=crop&w=400&q=80' },
    { name: 'Laal Maas', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&w=400&q=80' },
    { name: 'Pyaz Kachori', image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
    { name: 'Mirchi Bada', image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=400&q=80' },
    { name: 'Ghevar', image: 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=400&q=80' },
    { name: 'Mawa Kachori', image: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=400&q=80' },
  ],
  whereToStay: [
    { title: 'Luxury Hotels', price: '₹6,000+ per night', desc: 'Rambagh Palace, Jai Mahal, Oberoi Rajvilas', icon: IconBed },
    { title: 'Mid-range Hotels', price: '₹3,000 – ₹6,000 per night', desc: 'Boutique havelis and central city hotels', icon: IconBed },
    { title: 'Budget Hotels', price: '₹1,000 – ₹3,000 per night', desc: 'Clean guest houses and boutique hostels', icon: IconBed },
    { title: 'Heritage Stays', price: 'Experience royal hospitality', desc: 'Converted aristocratic residences and thikanas', icon: IconBuildingCastle },
  ],
  travelTips: [
    'Wear comfortable clothing and walking shoes.',
    'Respect local culture and traditions.',
    'Carry water, sunscreen and a hat (especially in summer).',
    'Visit popular places early to avoid crowds.',
    'Try local cuisine but choose clean and reputed places.',
    'Check monument timings and entry fees in advance.',
    'Keep some cash for local markets.',
    'Be cautious of touts and always use authorised guides.',
  ],
  quickInfo: [
    { label: 'State', value: 'Rajasthan' },
    { label: 'Nickname', value: 'The Pink City' },
    { label: 'Founded', value: '1727' },
    { label: 'Founder', value: 'Maharaja Sawai Jai Singh II' },
    { label: 'Language', value: 'Hindi, Rajasthani' },
    { label: 'Time Zone', value: 'IST (UTC +5:30)' },
    { label: 'Currency', value: 'Indian Rupee (₹)' },
    { label: 'Ideal Duration', value: '2 – 4 Days' },
  ],
  weather: {
    temp: '24°C',
    condition: 'Clear Sky',
    minMax: 'Min 14°C | Max 28°C',
    icon: IconSun,
  },
  officialInfo: [
    { name: 'Rajasthan Tourism', url: 'https://tourism.rajasthan.gov.in', label: 'Official website' },
    { name: 'Jaipur District Administration', url: 'https://jaipur.rajasthan.gov.in', label: 'Official website' },
    { name: 'Incredible India', url: 'https://incredibleindia.org', label: 'Official website' },
    { name: 'Tourist Helpline', phone: '1363 (24x7)', label: '1363 (24x7)' },
    { name: 'Emergency Number', phone: '112', label: '112' },
  ],
  nearbyDestinations: [
    { name: 'Amer', distance: '11 km from Jaipur', href: '/destinations/amer' },
    { name: 'Ajmer', distance: '135 km', href: '/search?q=Ajmer' },
    { name: 'Pushkar', distance: '145 km', href: '/search?q=Pushkar' },
    { name: 'Ranthambore National Park', distance: '160 km', href: '/search?q=Ranthambore' },
  ],
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const isJaipur = slug === 'jaipur' || slug === 'jaipur-rajasthan';

  if (isJaipur) {
    return {
      title: 'Jaipur — The Pink City of India Travel Guide | BharatYatra',
      description:
        "Complete Jaipur travel guide: Amer Fort, Hawa Mahal, City Palace, best time to visit, itineraries, Rajasthani food, stays, and practical advice.",
      alternates: { canonical: `https://bharat-yatra-in.vercel.app/destinations/${slug}` },
      openGraph: {
        title: 'Jaipur Travel Guide — The Pink City | BharatYatra',
        description:
          "Discover Jaipur's majestic forts, royal palaces, vibrant bazaars, itineraries, and authentic food.",
        images: [{ url: jaipurData.coverUrl, width: 1200, height: 630, alt: 'Jaipur Hawa Mahal' }],
      },
    };
  }

  // Database destination
  try {
    const dest = await prisma.destinations.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: { states: true },
    });
    if (!dest) return { title: 'Destination Not Found | BharatYatra' };
    const stateStr = dest.states?.name_en || dest.state_name || 'India';
    return {
      title: `${dest.name_en}, ${stateStr} Travel Guide | BharatYatra`,
      description: dest.summary_en || `Explore ${dest.name_en}, ${stateStr} on BharatYatra.`,
      alternates: { canonical: `https://bharat-yatra-in.vercel.app/destinations/${encodeURIComponent(slug)}` },
    };
  } catch {
    return { title: 'Destination Guide | BharatYatra' };
  }
}

export default async function DestinationDetailPage({ params }) {
  const { slug } = await params;
  const isJaipur = slug === 'jaipur' || slug === 'jaipur-rajasthan';

  // 1. If Jaipur is requested, render the exact reference specification
  if (isJaipur) {
    return renderJaipurReferenceView();
  }

  // 2. Otherwise load from database
  try {
    const dbItem = await prisma.destinations.findFirst({
      where: { slug, status: 'PUBLISHED' },
      include: {
        states: true,
        districts: true,
        tehsils: true,
        attractions: { where: { status: 'PUBLISHED' }, orderBy: { name_en: 'asc' } },
        articles: { where: { status: 'PUBLISHED' }, orderBy: { published_at: 'desc' } },
      },
    });

    if (!dbItem) notFound();
    return renderDatabaseDestinationView(dbItem);
  } catch (err) {
    console.error('Error fetching destination:', err);
    notFound();
  }
}

// -------------------------------------------------------------
// RENDER JAIPUR EXACT REFERENCE VIEW (MATCHING SCREENSHOT 2)
// -------------------------------------------------------------
function renderJaipurReferenceView() {
  const data = jaipurData;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: 'Jaipur',
    description: data.overview,
    image: data.coverUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Jaipur',
      addressRegion: 'Rajasthan',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 26.9124,
      longitude: 75.7873,
    },
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bharat-yatra-in.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'India', item: 'https://bharat-yatra-in.vercel.app/destinations' },
      { '@type': 'ListItem', position: 3, name: 'Rajasthan', item: 'https://bharat-yatra-in.vercel.app/states/rajasthan' },
      { '@type': 'ListItem', position: 4, name: 'Jaipur', item: 'https://bharat-yatra-in.vercel.app/destinations/jaipur' },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />

      <main className="by-dest-page-root">
        {/* ========================================================
            1. BREADCRUMBS
            ======================================================== */}
        <div className="by-dest-breadcrumb-bar">
          <div className="by-container">
            <nav className="by-breadcrumbs" aria-label="Breadcrumb">
              <ol>
                <li><Link href="/">Home</Link></li>
                <li className="separator">&gt;</li>
                <li><Link href="/destinations">India</Link></li>
                <li className="separator">&gt;</li>
                <li><Link href="/destinations?region=west">Rajasthan</Link></li>
                <li className="separator">&gt;</li>
                <li className="current" aria-current="page">Jaipur</li>
              </ol>
            </nav>
          </div>
        </div>

        {/* ========================================================
            2. WIDE HERO BANNER
            ======================================================== */}
        <section
          className="by-dest-hero-banner"
          style={{ backgroundImage: `url(${data.coverUrl})` }}
          aria-labelledby="dest-hero-title"
        >
          <div className="by-dest-hero-gradient" aria-hidden="true" />

          <div className="by-container by-dest-hero-shell">
            {/* Top row: State badge + Save/Share actions */}
            <div className="by-dest-hero-top-row">
              <span className="by-dest-state-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <IconMapPin size={14} />
                <span>Rajasthan</span>
              </span>

              <DestinationInteractiveClient
                destination={{
                  slug: 'jaipur',
                  name: 'Jaipur',
                  state: 'Rajasthan',
                  coverUrl: data.coverUrl,
                }}
                galleryPhotos={data.gallery}
              />
            </div>

            {/* Middle: Title, Subtitle, Overview */}
            <div className="by-dest-hero-title-block">
              <h1 id="dest-hero-title" className="by-dest-title">Jaipur</h1>
              <p className="by-dest-subtitle">{data.subtitle}</p>
              <p className="by-dest-overview-text">{data.overview}</p>
            </div>

            {/* Bottom: 4 Key Fact Badges */}
            <div className="by-dest-facts-row">
              {data.keyFacts.map((fact) => {
                const FactIcon = fact.icon;
                return (
                  <div key={fact.label} className="by-dest-fact-pill">
                    <span className="by-fact-icon">
                      <FactIcon size={18} />
                    </span>
                    <div className="by-fact-text">
                      <span className="by-fact-label">{fact.label}</span>
                      <strong className="by-fact-val">{fact.value}</strong>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================
            3. STICKY SUB-NAVIGATION BAR
            ======================================================== */}
        <nav className="by-dest-subnav" aria-label="Section navigation">
          <div className="by-container">
            <div className="by-subnav-scroll">
              <a href="#overview" className="by-subnav-link active">Overview</a>
              <a href="#places" className="by-subnav-link">Places to Visit</a>
              <a href="#itinerary" className="by-subnav-link">Itinerary</a>
              <a href="#how-to-reach" className="by-subnav-link">How to Reach</a>
              <a href="#stay" className="by-subnav-link">Stay</a>
              <a href="#food" className="by-subnav-link">Food</a>
              <a href="#travel-guide" className="by-subnav-link">Travel Guide</a>
              <a href="#map" className="by-subnav-link">Map</a>
            </div>
          </div>
        </nav>

        {/* ========================================================
            4. TWO-COLUMN LAYOUT: MAIN CONTENT + CONTEXTUAL SIDEBAR
            ======================================================== */}
        <div className="by-dest-body-layout">
          <div className="by-container by-dest-grid">
            {/* ==================== LEFT MAIN AREA ==================== */}
            <div className="by-dest-main-col">
              {/* Section 1: About Jaipur */}
              <section id="overview" className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconBookOpen size={22} className="by-sec-icon" />
                  <span>About Jaipur</span>
                </h2>
                <div className="by-about-row">
                  <p className="by-about-p">{data.about.text}</p>
                  <div className="by-about-thumb-wrap">
                    <img src={data.about.thumb} alt={data.about.thumbCaption} loading="lazy" />
                    <span className="by-about-thumb-caption">{data.about.thumbCaption}</span>
                  </div>
                </div>

                {/* Top Highlights Grid (6 items) */}
                <div className="by-highlights-card">
                  <h3 className="by-highlights-title">
                    <IconSparkles size={20} className="by-high-icon" />
                    <span>Top Highlights</span>
                  </h3>
                  <div className="by-highlights-grid">
                    {data.highlights.map((h, i) => {
                      const HIcon = h.icon;
                      return (
                        <div key={i} className="by-highlight-item">
                          <span className="by-h-icon">
                            <HIcon size={18} />
                          </span>
                          <span>{h.text}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>

              {/* Section 2: History of Jaipur */}
              <section className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconBuildingCastle size={22} className="by-sec-icon" />
                  <span>History of Jaipur</span>
                </h2>
                <DestinationHistoryToggle
                  text={data.history.summary}
                  extendedText={data.history.extended}
                  image={data.history.image}
                  imageAlt="Historic Jaipur fortification"
                />
              </section>

              {/* Section 3: Best Time to Visit */}
              <section className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconSun size={22} className="by-sec-icon" />
                  <span>Best Time to Visit Jaipur</span>
                </h2>
                <div className="by-seasons-grid">
                  {data.seasons.map((s) => {
                    const SeasonIcon = s.icon;
                    return (
                      <div key={s.season} className="by-season-card">
                        <div className="by-season-top">
                          <span className="by-season-icon">
                            <SeasonIcon size={20} />
                          </span>
                          <h3 className="by-season-name">{s.season} <small>({s.period})</small></h3>
                        </div>
                        <p className="by-season-desc">{s.desc}</p>
                        <div className="by-season-badges">
                          <span className="by-temp-badge">{s.temp}</span>
                          <span className={`by-rec-badge ${s.badgeClass}`}>{s.badge}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 4: How to Reach Jaipur */}
              <section id="how-to-reach" className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconCar size={22} className="by-sec-icon" />
                  <span>How to Reach Jaipur</span>
                </h2>
                <div className="by-transport-grid">
                  {data.howToReach.map((t) => {
                    const TIcon = t.icon;
                    return (
                      <div key={t.mode} className="by-transport-card">
                        <div className="by-transport-icon-box">
                          <TIcon size={22} />
                        </div>
                        <h3 className="by-transport-mode">{t.mode}</h3>
                        <p className="by-transport-desc">{t.desc}</p>
                        <Link href={t.href} className="by-transport-action">
                          {t.action}
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 5: Getting Around in Jaipur */}
              <section className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconRoute size={22} className="by-sec-icon" />
                  <span>Getting Around in Jaipur</span>
                </h2>
                <div className="by-getting-around-grid">
                  {data.gettingAround.map((g) => {
                    const GIcon = g.icon;
                    return (
                      <div key={g.mode} className="by-around-card">
                        <div className="by-around-header">
                          <span className="by-around-icon">
                            <GIcon size={18} />
                          </span>
                          <strong>{g.mode}</strong>
                        </div>
                        <p>{g.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 6: Top Places to Visit */}
              <section id="places" className="by-dest-section">
                <div className="by-dest-sec-header-row">
                  <h2 className="by-dest-sec-title">
                    <IconMapPin size={22} className="by-sec-icon" />
                    <span>Top Places to Visit in Jaipur</span>
                  </h2>
                  <Link href="/attractions" className="by-sec-viewall">
                    View All (20+) →
                  </Link>
                </div>

                <div className="by-places-slider-grid">
                  {data.places.map((place) => (
                    <Link
                      key={place.slug}
                      href={`/attractions/jaipur/${place.slug}`}
                      className="by-place-card"
                    >
                      <div className="by-place-img-wrap">
                        <img src={place.image} alt={place.name} loading="lazy" />
                      </div>
                      <div className="by-place-info">
                        <h3 className="by-place-name">{place.name}</h3>
                        <div className="by-place-meta">
                          <span className="by-place-tag">{place.category}</span>
                          <span className="by-place-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <IconClock size={13} />
                            <span>{place.time}</span>
                          </span>
                        </div>
                        <div className="by-place-rating" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <IconSparkles size={12} color="#D97706" />
                          <span>{place.rating}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>

              {/* Section 7: Suggested Itinerary */}
              <section id="itinerary" className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconCalendarEvent size={22} className="by-sec-icon" />
                  <span>Suggested Itinerary for Jaipur</span>
                </h2>
                <DestinationItineraryTabs itineraries={data.itineraries} />
              </section>

              {/* Section 8: Famous Food in Jaipur */}
              <section id="food" className="by-dest-section">
                <div className="by-dest-sec-header-row">
                  <h2 className="by-dest-sec-title">
                    <IconSoup size={22} className="by-sec-icon" />
                    <span>Famous Food in Jaipur</span>
                  </h2>
                  <Link href="/articles" className="by-sec-viewall" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>View All</span>
                    <IconArrowRight size={14} />
                  </Link>
                </div>

                <div className="by-food-grid">
                  {data.famousFood.map((dish) => (
                    <div key={dish.name} className="by-food-card">
                      <div className="by-food-img-wrap">
                        <img src={dish.image} alt={dish.name} loading="lazy" />
                      </div>
                      <strong className="by-food-name">{dish.name}</strong>
                    </div>
                  ))}
                </div>
              </section>

              {/* Section 9: Where to Stay */}
              <section id="stay" className="by-dest-section">
                <div className="by-dest-sec-header-row">
                  <h2 className="by-dest-sec-title">
                    <IconBed size={22} className="by-sec-icon" />
                    <span>Where to Stay in Jaipur</span>
                  </h2>
                  <Link href="/destinations" className="by-sec-viewall" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <span>View All</span>
                    <IconArrowRight size={14} />
                  </Link>
                </div>

                <div className="by-stay-grid">
                  {data.whereToStay.map((stay) => {
                    const StayIcon = stay.icon;
                    return (
                      <div key={stay.title} className="by-stay-card">
                        <span className="by-stay-icon">
                          <StayIcon size={24} />
                        </span>
                        <h3 className="by-stay-title">{stay.title}</h3>
                        <span className="by-stay-price">{stay.price}</span>
                        <p className="by-stay-desc">{stay.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Section 10: Travel Tips */}
              <section id="travel-guide" className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconBulb size={22} className="by-sec-icon" />
                  <span>Travel Tips</span>
                </h2>
                <div className="by-tips-card">
                  <ul className="by-tips-two-col">
                    {data.travelTips.map((tip, idx) => (
                      <li key={idx}>
                        <span className="by-tip-check" style={{ display: 'inline-flex', alignItems: 'center' }}>
                          <IconCheck size={14} />
                        </span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>

            {/* ==================== RIGHT SIDEBAR ==================== */}
            <aside className="by-dest-sidebar-col">
              {/* Sidebar Card 1: Quick Information */}
              <div className="by-sidebar-card">
                <h3 className="by-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconInfoCircle size={18} className="by-sidebar-title-icon" />
                  <span>Quick Information</span>
                </h3>
                <dl className="by-quick-info-list">
                  {data.quickInfo.map((q) => (
                    <div key={q.label} className="by-quick-info-row">
                      <dt>{q.label}</dt>
                      <dd>{q.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              {/* Sidebar Card 2: Jaipur on Map */}
              <div id="map" className="by-sidebar-card by-map-sidebar-card">
                <h3 className="by-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconMap size={18} className="by-sidebar-title-icon" />
                  <span>Jaipur on Map</span>
                </h3>
                <div className="by-sidebar-map-preview">
                  <img
                    src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
                    alt="Jaipur Rajasthan Geographic Location"
                    loading="lazy"
                  />
                  <div className="by-map-pin-overlay">
                    <span className="by-pin-pulse" />
                    <span className="by-pin-label">Jaipur, RJ</span>
                  </div>
                </div>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=26.9124,75.7873"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="by-map-ext-btn"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                >
                  <span>Open in Google Maps</span>
                  <IconExternalLink size={14} />
                </a>
              </div>

              {/* Sidebar Card 3: Plan Your Trip Form */}
              <SidebarPlanForm destinationName="Jaipur" />

              {/* Sidebar Card 4: Current Weather */}
              <div className="by-sidebar-card by-weather-sidebar-card">
                <h3 className="by-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconCloudSun size={18} className="by-sidebar-title-icon" />
                  <span>Current Weather</span>
                </h3>
                <p className="by-weather-loc">Jaipur, Rajasthan</p>
                <div className="by-weather-display">
                  <span className="by-weather-temp">{data.weather.temp}</span>
                  <span className="by-weather-icon" style={{ display: 'inline-flex' }}>
                    <IconSun size={32} />
                  </span>
                </div>
                <p className="by-weather-cond">{data.weather.condition}</p>
                <p className="by-weather-minmax">{data.weather.minMax}</p>
                <Link href="/weather" className="by-weather-link" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>View 7 Day Forecast</span>
                  <IconArrowRight size={14} />
                </Link>
              </div>

              {/* Sidebar Card 5: Official Information */}
              <div className="by-sidebar-card">
                <h3 className="by-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconBuildingMonument size={18} className="by-sidebar-title-icon" />
                  <span>Official Information</span>
                </h3>
                <ul className="by-official-links">
                  {data.officialInfo.map((info) => (
                    <li key={info.name} className="by-official-link-row">
                      <strong>{info.name}</strong>
                      {info.url ? (
                        <a href={info.url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span>{info.label}</span>
                          <IconExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="by-official-tel" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <IconPhoneCall size={14} />
                          <span>{info.label}</span>
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Sidebar Card 6: Nearby Destinations */}
              <div className="by-sidebar-card">
                <h3 className="by-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconMapPin size={18} className="by-sidebar-title-icon" />
                  <span>Nearby Destinations</span>
                </h3>
                <div className="by-nearby-list">
                  {data.nearbyDestinations.map((near) => (
                    <Link key={near.name} href={near.href} className="by-nearby-row">
                      <div className="by-nearby-info">
                        <strong>{near.name}</strong>
                        <span>{near.distance}</span>
                      </div>
                      <span className="by-nearby-arrow">&gt;</span>
                    </Link>
                  ))}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}

// -------------------------------------------------------------
// RENDER DYNAMIC DATABASE DESTINATION (FOR NAWALGARH ETC.)
// -------------------------------------------------------------
function renderDatabaseDestinationView(dest) {
  const stateName = dest.states?.name_en || dest.state_name || 'India';
  const districtName = dest.districts?.name_en || dest.district_name || null;
  const coverUrl = dest.cover_image_url || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1600&q=85';
  const mapUrl = getMapPinUrl(dest.latitude, dest.longitude);

  const keyFacts = [
    ...(dest.attractions?.length ? [{ label: 'Monuments', value: `${dest.attractions.length}+`, icon: IconBuildingMonument }] : []),
    ...(dest.best_time_en ? [{ label: 'Best Time', value: dest.best_time_en, icon: IconSun }] : []),
    { label: 'Ideal Duration', value: '1 – 2 Days', icon: IconClock },
    { label: 'State', value: stateName, icon: IconMapPin },
  ];

  return (
    <main className="by-dest-page-root">
      <div className="by-dest-breadcrumb-bar">
        <div className="by-container">
          <nav className="by-breadcrumbs" aria-label="Breadcrumb">
            <ol>
              <li><Link href="/">Home</Link></li>
              <li className="separator">&gt;</li>
              <li><Link href="/destinations">Destinations</Link></li>
              <li className="separator">&gt;</li>
              {dest.states?.slug ? <li><Link href={`/states/${dest.states.slug}`}>{stateName}</Link></li> : <li>{stateName}</li>}
              <li className="separator">&gt;</li>
              <li className="current" aria-current="page">{dest.name_en}</li>
            </ol>
          </nav>
        </div>
      </div>

      <section
        className="by-dest-hero-banner"
        style={{ backgroundImage: `url(${coverUrl})` }}
        aria-labelledby="dest-hero-title"
      >
        <div className="by-dest-hero-gradient" aria-hidden="true" />
        <div className="by-container by-dest-hero-shell">
          <div className="by-dest-hero-top-row">
            <span className="by-dest-state-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <IconMapPin size={14} />
              <span>{stateName.toUpperCase()}</span>
            </span>
            <DestinationInteractiveClient
              destination={{
                slug: dest.slug,
                name: dest.name_en,
                state: stateName,
                coverUrl,
              }}
              galleryPhotos={[]}
            />
          </div>

          <div className="by-dest-hero-title-block">
            <h1 id="dest-hero-title" className="by-dest-title">{dest.name_en}</h1>
            {dest.summary_en && <p className="by-dest-subtitle">{dest.summary_en}</p>}
            {dest.description_en && <p className="by-dest-overview-text">{dest.description_en.slice(0, 220)}...</p>}
          </div>

          <div className="by-dest-facts-row">
            {keyFacts.map((fact) => {
              const FactIcon = fact.icon;
              return (
                <div key={fact.label} className="by-dest-fact-pill">
                  <span className="by-fact-icon">
                    <FactIcon size={18} />
                  </span>
                  <div className="by-fact-text">
                    <span className="by-fact-label">{fact.label}</span>
                    <strong className="by-fact-val">{fact.value}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <nav className="by-dest-subnav" aria-label="Section navigation">
        <div className="by-container">
          <div className="by-subnav-scroll">
            <a href="#overview" className="by-subnav-link active">Overview</a>
            <a href="#places" className="by-subnav-link">Places to Visit ({dest.attractions?.length || 0})</a>
            <a href="#articles" className="by-subnav-link">Travel Guides</a>
            <a href="#map" className="by-subnav-link">Location</a>
          </div>
        </div>
      </nav>

      <div className="by-dest-body-layout">
        <div className="by-container by-dest-grid">
          <div className="by-dest-main-col">
            <section id="overview" className="by-dest-section">
              <h2 className="by-dest-sec-title">
                <IconBookOpen size={22} className="by-sec-icon" />
                <span>About {dest.name_en}</span>
              </h2>
              <div className="by-about-row">
                <p className="by-about-p">{dest.description_en || dest.summary_en}</p>
              </div>
            </section>

            {/* Attractions */}
            <section id="places" className="by-dest-section">
              <div className="by-dest-sec-header-row">
                <h2 className="by-dest-sec-title">
                  <IconMapPin size={22} className="by-sec-icon" />
                  <span>Verified Attractions in {dest.name_en}</span>
                </h2>
                <span className="by-sec-count">{dest.attractions?.length || 0} Listed</span>
              </div>

              {dest.attractions?.length > 0 ? (
                <div className="by-places-slider-grid">
                  {dest.attractions.map((attr) => (
                    <article key={attr.slug} className="by-place-card">
                      <div className="by-place-info" style={{ padding: '1.25rem' }}>
                        <span className="by-place-tag">{attr.category || 'Historic Monument'}</span>
                        <h3 className="by-place-name" style={{ marginTop: '0.4rem' }}>{attr.name_en}</h3>
                        {attr.description_en && (
                          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {attr.description_en.slice(0, 140)}...
                          </p>
                        )}
                        {attr.visiting_hours && (
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <IconClock size={14} />
                            <span><strong>Hours:</strong> {attr.visiting_hours}</span>
                          </p>
                        )}
                        <Link
                          href={`/attractions/${dest.slug}/${attr.slug}`}
                          className="by-transport-action"
                          style={{ marginTop: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <span>View Monument Details</span>
                          <IconArrowRight size={14} />
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="by-empty-notice">
                  <p>Attractions for {dest.name_en} are currently undergoing editorial verification.</p>
                </div>
              )}
            </section>

            {/* Published Articles */}
            {dest.articles?.length > 0 && (
              <section id="articles" className="by-dest-section">
                <h2 className="by-dest-sec-title">
                  <IconBookOpen size={22} className="by-sec-icon" />
                  <span>Editorial Travel Guides for {dest.name_en}</span>
                </h2>
                <div className="by-articles-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                  {dest.articles.map((art) => (
                    <Link key={art.slug} href={`/articles/${art.slug}`} className="by-article-card">
                      <div className="by-article-body">
                        <span className="by-itin-badge" style={{ marginBottom: '0.5rem', display: 'inline-block' }}>
                          {art.category || 'Travel Guide'}
                        </span>
                        <h3 className="by-article-title">{art.title_en}</h3>
                        {art.excerpt_en && (
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: '0.4rem 0' }}>
                            {art.excerpt_en.slice(0, 120)}...
                          </p>
                        )}
                        <div className="by-article-footer">
                          <span className="by-article-read-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <span>Read full guide</span>
                            <IconArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="by-dest-sidebar-col">
            <div className="by-sidebar-card">
              <h3 className="by-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IconInfoCircle size={18} className="by-sidebar-title-icon" />
                <span>Quick Information</span>
              </h3>
              <dl className="by-quick-info-list">
                <div className="by-quick-info-row">
                  <dt>State</dt>
                  <dd>{stateName}</dd>
                </div>
                {districtName && (
                  <div className="by-quick-info-row">
                    <dt>District</dt>
                    <dd>{districtName}</dd>
                  </div>
                )}
                {dest.best_time_en && (
                  <div className="by-quick-info-row">
                    <dt>Best Time</dt>
                    <dd>{dest.best_time_en}</dd>
                  </div>
                )}
              </dl>
            </div>

            {mapUrl && (
              <div id="map" className="by-sidebar-card">
                <h3 className="by-sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <IconMap size={18} className="by-sidebar-title-icon" />
                  <span>Location on Map</span>
                </h3>
                <a href={mapUrl} target="_blank" rel="noopener noreferrer" className="by-map-ext-btn" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                  <span>Open in Google Maps</span>
                  <IconExternalLink size={14} />
                </a>
              </div>
            )}

            <SidebarPlanForm destinationName={dest.name_en} />
          </aside>
        </div>
      </div>
    </main>
  );
}
