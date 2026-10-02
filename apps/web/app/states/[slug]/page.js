import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeading, DestinationCard } from '../../../components/content.js';
import { getContent, getCollection } from '../../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getContent('states', [slug]);
  if (result.state !== 'success') return {};
  return { title: `${result.payload.data.name_en} | BharatYatra` };
}

export default async function StateDetailPage({ params }) {
  const { slug } = await params;
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  const result = await getContent('states', [slug]);
  const state = result.state === 'success' ? result.payload.data : null;

  if (!state) {
    notFound();
  }

  const districtsResult = await getCollection('districts', { state: slug, limit: 20 });
  const destinationsResult = await getCollection('destinations', { state: slug, limit: 20 });

  return (
    <main className="detail-page page-shell">
      <nav className="breadcrumb" style={{ marginBottom: '2rem', fontSize: '0.85rem' }}>
        <Link href="/" className="text-link">{dict.common.home}</Link> &rsaquo;{' '}
        <Link href="/states" className="text-link">{dict.nav.states}</Link> &rsaquo;{' '}
        <span style={{ color: 'var(--muted)' }}>{showHi && state.name_hi ? state.name_hi : state.name_en}</span>
      </nav>

      <div className="detail-content">
        <p className="eyebrow">{state.type === 'UT' ? (showHi ? 'केंद्र शासित प्रदेश' : 'UNION TERRITORY') : (showHi ? 'राज्य' : 'STATE')}</p>
        <h1>{showHi && state.name_hi ? state.name_hi : state.name_en}{!showHi && state.name_hi ? <span className="hindi-name" lang="hi">{state.name_hi}</span> : null}</h1>
        
        {showHi && state.description_hi ? (
          <p className="detail-summary" lang="hi">{state.description_hi}</p>
        ) : (state.description_en ? (
          <p className="detail-summary">{state.description_en}</p>
        ) : (
          <p className="detail-summary">{showHi ? `${state.name_hi || state.name_en} के पर्यटन स्थलों और संस्कृति की खोज करें।` : `Explore the destinations, culture, and attractions of ${state.name_en}.`}</p>
        ))}
      </div>

      {destinationsResult.state === 'success' && destinationsResult.data.length > 0 && (
        <section className="content-section" style={{ marginTop: '4rem' }}>
          <PageHeading eyebrow={dict.content.destinations} title={showHi ? 'प्रमुख स्थान' : 'Destinations'} description={showHi ? `${state.name_hi || state.name_en} के प्रमुख स्थान` : `Popular destinations in ${state.name_en}`} />
          <div className="card-grid">
            {destinationsResult.data.map((item) => (
              <DestinationCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {districtsResult.state === 'success' && districtsResult.data.length > 0 && (
        <section className="content-section" style={{ marginTop: '4rem' }}>
          <PageHeading eyebrow={dict.content.district} title={showHi ? 'ज़िले' : 'Districts'} description={showHi ? `${state.name_hi || state.name_en} के ज़िले` : `Districts of ${state.name_en}`} />
          <div className="card-grid">
            {districtsResult.data.map((dist) => (
              <div className="content-card" key={dist.slug}>
                <h2><Link href={`/districts/${state.slug}/${dist.slug}`}>{showHi && dist.name_hi ? dist.name_hi : dist.name_en}{!showHi && dist.name_hi ? <span className="hindi-name">{dist.name_hi}</span> : null}</Link></h2>
                <Link className="text-link" href={`/districts/${state.slug}/${dist.slug}`} style={{ marginTop: 'auto' }}>{dict.common.view}</Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
