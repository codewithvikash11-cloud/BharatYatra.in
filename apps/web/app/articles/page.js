import { ApiState, ArticleCard, ContentSearch, getCoverImages, PageHeading, Pagination } from '../../components/content.js';
import { getCollection, parsePage, parseSearchTerm } from '../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../lib/i18n.js';

export const dynamic = 'force-dynamic';

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://bharat-yatra-in.vercel.app').replace(/\/+$/, '');

export const metadata = {
  title: 'Travel Stories & Editorial Guides across India | BharatYatra Journal',
  description: 'Explore authentic travel journals, heritage architecture reviews, detailed road trip routes, and cultural stories across India.',
  alternates: {
    canonical: `${siteUrl}/articles`,
  },
  openGraph: {
    title: 'Travel Stories & Editorial Guides across India | BharatYatra Journal',
    description: 'Explore authentic travel journals, heritage architecture reviews, detailed road trip routes, and cultural stories across India.',
    url: `${siteUrl}/articles`,
    siteName: 'BharatYatra',
    images: [{ url: `${siteUrl}/image.png`, width: 1200, height: 630, alt: 'BharatYatra Travel Journal' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Travel Stories & Editorial Guides | BharatYatra',
    description: 'Authentic travel stories and heritage guides across India.',
    images: [`${siteUrl}/image.png`],
  },
};

export default async function ArticlesPage({ searchParams }) {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';

  const params = await searchParams;
  const page = parsePage(params?.page);
  const search = parseSearchTerm(params?.q);
  if (page === null || !search.valid) return <main className="page-shell"><PageHeading eyebrow={dict.content.journal} title={dict.nav.articles}/><ApiState state="invalid"/></main>;
  const result = await getCollection('articles', { page, limit: 12, q: search.value });
  const coverImages = result.state === 'success'
    ? await getCoverImages('articles', result.data.filter((item) => !item.cover_image_url).map((item) => item.slug))
    : {};

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'BharatYatra Travel Journal',
    description: 'Published travel stories, heritage guides, and itineraries across India.',
    url: `${siteUrl}/articles`,
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
      { '@type': 'ListItem', position: 2, name: 'Travel Stories', item: `${siteUrl}/articles` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />
      <main className="page-shell list-page">
        <PageHeading eyebrow={dict.content.journal} title={showHi ? 'यात्रा लेख' : 'Travel Stories'} description={showHi ? 'प्रकाशित कहानियाँ और मार्गदर्शिकाएँ।' : 'Published stories and guides.'}/>
        <ContentSearch pathname="/articles" value={search.value}/>
        {result.state !== 'success' ? <ApiState state={result.state} label={dict.nav.articles}/> : result.data.length === 0 ? <ApiState state="empty" label={dict.nav.articles}/> : <div className="card-grid">{result.data.map((item) => <ArticleCard key={item.slug} item={item} coverImage={coverImages[item.slug]}/>)}</div>}
        {result.state === 'success' ? <Pagination pagination={result.pagination} pathname="/articles" extra={search.value ? { q: search.value } : {}}/> : null}
      </main>
    </>
  );
}
