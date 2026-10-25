import Link from 'next/link';
import { ApiState, ContentSearch, DestinationCard, getCoverImages, PageHeading, Pagination } from '../../components/content.js';
import { getCollection, parsePage, parseSearchTerm } from '../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../lib/i18n.js';
import { RegionIcon, IconX, IconMapPin } from '../../components/icons.js';

export const dynamic = 'force-dynamic';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app').replace(/\/+$/, '');

export const metadata = {
  title: 'Destinations in India | Browse by Region | BharatYatra',
  description: 'Explore verified travel guides across India by region: North India, South India, East India, West India, Central India, and Northeast India.',
  alternates: {
    canonical: `${siteUrl}/destinations`,
  },
  openGraph: {
    title: 'Destinations in India | Browse by Region | BharatYatra',
    description: 'Explore verified travel guides across India by region: North India, South India, East India, West India, Central India, and Northeast India.',
    url: `${siteUrl}/destinations`,
    siteName: 'BharatYatra',
    images: [{ url: `${siteUrl}/image.png`, width: 1200, height: 630, alt: 'India Destinations BharatYatra' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Destinations in India | BharatYatra',
    description: 'Explore verified travel guides across India by region.',
    images: [`${siteUrl}/image.png`],
  },
};

const regionsList = [
  { id: 'all', label: 'All Regions' },
  { id: 'north', label: 'North India' },
  { id: 'south', label: 'South India' },
  { id: 'east', label: 'East India' },
  { id: 'west', label: 'West India' },
  { id: 'central', label: 'Central India' },
  { id: 'northeast', label: 'Northeast India' },
];

export default async function DestinationsPage({ searchParams }) {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';

  const params = await searchParams;
  const page = parsePage(params?.page);
  const search = parseSearchTerm(params?.q);
  const region = typeof params?.region === 'string' ? params.region.toLowerCase().trim() : '';

  if (page === null || !search.valid) {
    return (
      <main className="page-shell">
        <PageHeading eyebrow={dict.content.destinations} title={dict.common.searchLabel} />
        <ApiState state="invalid" />
      </main>
    );
  }

  const result = await getCollection('destinations', {
    page,
    limit: 12,
    q: search.value,
    region: region && region !== 'all' ? region : undefined,
  });
  const coverImages = result.state === 'success'
    ? await getCoverImages('destinations', result.data.filter((item) => !item.cover_image_url).map((item) => item.slug))
    : {};

  const selectedRegion = regionsList.find((r) => r.id === (region || 'all')) || regionsList[0];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'India Travel Destinations | BharatYatra',
    description: 'Explore verified travel guides across India by region: North, South, East, West, Central, and Northeast India.',
    url: `${siteUrl}/destinations`,
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Destinations', item: `${siteUrl}/destinations` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      <main className="page-shell list-page" style={{ paddingBottom: '5rem' }}>
      <PageHeading
        eyebrow={dict.content.destinations}
        title={showHi ? 'स्थान खोजें' : 'Explore India’s Destinations'}
        description={
          showHi
            ? 'सिर्फ प्रकाशित स्थान मार्गदर्शिकाएँ यहाँ दिखाई जाती हैं।'
            : 'Comprehensive, verified guides for India’s most historic and cultural travel hubs.'
        }
      />

      {/* Region Selector Pills */}
      <nav aria-label="Region filters" style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {regionsList.map((r) => {
            const isActive = (region || 'all') === r.id;
            const href = r.id === 'all'
              ? (search.value ? `/destinations?q=${encodeURIComponent(search.value)}` : '/destinations')
              : `/destinations?region=${r.id}${search.value ? `&q=${encodeURIComponent(search.value)}` : ''}`;

            return (
              <Link
                key={r.id}
                href={href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.55rem 1.15rem',
                  borderRadius: '999px',
                  border: isActive ? '1px solid var(--teal-deep)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--teal-deep)' : '#FFFFFF',
                  color: isActive ? '#FFFDF8' : 'var(--text-primary)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.85rem',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <RegionIcon regionId={r.id} size={16} />
                <span>{r.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Active Filter Note */}
      {region && region !== 'all' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <span>Filtering by: <strong>{selectedRegion.label}</strong></span>
          <Link href={`/destinations${search.value ? `?q=${encodeURIComponent(search.value)}` : ''}`} style={{ color: 'var(--teal-primary)', fontWeight: 600, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <IconX size={14} />
            <span>Clear region filter</span>
          </Link>
        </div>
      )}

      {/* Search Bar */}
      <ContentSearch pathname="/destinations" value={search.value} />

      {/* Results Rendering */}
      {result.state !== 'success' ? (
        <ApiState state={result.state} label={dict.nav.destinations} />
      ) : result.data.length === 0 ? (
        <div className="empty-editorial-card" style={{ maxWidth: '640px', margin: '2.5rem auto', textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ color: 'var(--teal-primary)', marginBottom: '0.75rem', display: 'flex', justifyContent: 'center' }}>
            <IconMapPin size={40} />
          </div>
          <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
            No destinations found {region && region !== 'all' ? `in ${selectedRegion.label}` : ''}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
            We haven&apos;t published destination guides for this specific filter yet. Check back soon or browse all published destinations.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <Link href="/destinations" className="btn-gold-pill" style={{ fontSize: '0.85rem' }}>
              View All Destinations
            </Link>
          </div>
        </div>
      ) : (
        <div className="card-grid">
          {result.data.map((item) => (
            <DestinationCard key={item.slug} item={item} coverImage={coverImages[item.slug]} />
          ))}
        </div>
      )}

      {result.state === 'success' && result.data.length > 0 ? (
        <Pagination
          pagination={result.pagination}
          pathname="/destinations"
          extra={{
            ...(region && region !== 'all' ? { region } : {}),
            ...(search.value ? { q: search.value } : {}),
          }}
        />
      ) : null}
    </main>
    </>
  );
}
