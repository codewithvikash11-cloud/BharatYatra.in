import { notFound } from 'next/navigation';
import Link from 'next/link';
import { PageHeading, DestinationCard } from '../../../../components/content.js';
import { getContent, getCollection } from '../../../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { stateSlug, slug } = await params;
  const result = await getContent('districts', [stateSlug, slug]);
  if (result.state !== 'success') return {};
  return { title: `${result.payload.data.name_en} | BharatYatra` };
}

export default async function DistrictDetailPage({ params }) {
  const { stateSlug, slug } = await params;
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  const result = await getContent('districts', [stateSlug, slug]);
  const district = result.state === 'success' ? result.payload.data : null;

  if (!district) {
    notFound();
  }

  const destinationsResult = await getCollection('destinations', { district: slug, limit: 20 });
  const tehsilsResult = await getCollection('tehsils', { district: slug, limit: 20 });
  const state = district.states;

  return (
    <main className="detail-page page-shell">
      <nav className="breadcrumb" style={{ marginBottom: '2rem', fontSize: '0.85rem' }}>
        <Link href="/" className="text-link">{dict.common.home}</Link> &rsaquo;{' '}
        <Link href="/states" className="text-link">{dict.nav.states}</Link> &rsaquo;{' '}
        <Link href={`/states/${stateSlug}`} className="text-link">{state ? (showHi && state.name_hi ? state.name_hi : state.name_en) : stateSlug}</Link> &rsaquo;{' '}
        <span style={{ color: 'var(--muted)' }}>{showHi && district.name_hi ? district.name_hi : district.name_en}</span>
      </nav>

      <div className="detail-content">
        <p className="eyebrow">{dict.content.district.toUpperCase()}</p>
        <h1>{showHi && district.name_hi ? district.name_hi : district.name_en}{!showHi && district.name_hi ? <span className="hindi-name" lang="hi">{district.name_hi}</span> : null}</h1>
        
        {showHi && district.description_hi ? (
          <p className="detail-summary" lang="hi">{district.description_hi}</p>
        ) : (district.description_en ? (
          <p className="detail-summary">{district.description_en}</p>
        ) : (
          <p className="detail-summary">{showHi ? `${district.name_hi || district.name_en} ज़िले के पर्यटन स्थलों की खोज करें।` : `Explore destinations and local areas in ${district.name_en} district.`}</p>
        ))}
      </div>

      {destinationsResult.state === 'success' && destinationsResult.data.length > 0 && (
        <section className="content-section" style={{ marginTop: '4rem' }}>
          <PageHeading eyebrow={dict.content.destinations} title={showHi ? 'प्रमुख स्थान' : 'Destinations'} description={showHi ? `${district.name_hi || district.name_en} के प्रमुख स्थान` : `Destinations in ${district.name_en}`} />
          <div className="card-grid">
            {destinationsResult.data.map((item) => (
              <DestinationCard key={item.slug} item={item} />
            ))}
          </div>
        </section>
      )}

      {tehsilsResult.state === 'success' && tehsilsResult.data.length > 0 && (
        <section className="content-section" style={{ marginTop: '4rem' }}>
          <PageHeading eyebrow={dict.content.localAreas} title={showHi ? 'स्थानीय क्षेत्र' : 'Local Areas'} description={showHi ? `${district.name_hi || district.name_en} की तहसीलें` : `Tehsils and subdivisions of ${district.name_en}`} />
          <div className="card-grid">
            {tehsilsResult.data.map((tehsil) => (
              <div className="content-card" key={tehsil.slug}>
                <h2>{showHi && tehsil.name_hi ? tehsil.name_hi : tehsil.name_en}{!showHi && tehsil.name_hi ? <span className="hindi-name" lang="hi">{tehsil.name_hi}</span> : null}</h2>
                <p className="card-kicker">{tehsil.local_label || (showHi ? 'तहसील' : 'Tehsil')}</p>
                {showHi && tehsil.description_hi ? <p lang="hi">{tehsil.description_hi}</p> : (tehsil.description_en && <p>{tehsil.description_en}</p>)}
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
