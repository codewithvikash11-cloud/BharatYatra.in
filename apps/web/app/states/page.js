import Link from 'next/link';
import { PageHeading, ApiState } from '../../components/content.js';
import { getCollection } from '../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../lib/i18n.js';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'भारत के राज्य और केंद्र शासित प्रदेश | States and Union Territories of India' };

export default async function StatesPage() {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  const result = await getCollection('states', { limit: 50 });

  return (
    <main className="list-page page-shell">
      <PageHeading 
        eyebrow={dict.content.exploreIndia} 
        title={dict.content.statesAndUTs} 
        description={dict.content.statesDesc}
      />
      {result.state !== 'success' ? (
        <ApiState state={result.state} label={dict.nav.states} />
      ) : result.data.length === 0 ? (
        <ApiState state="empty" label={dict.nav.states} />
      ) : (
        <div className="card-grid">
          {result.data.map((item) => (
            <div className="content-card" key={item.slug}>
              <p className="card-kicker">{item.type === 'UT' ? (showHi ? 'केंद्र शासित प्रदेश' : 'Union Territory') : (showHi ? 'राज्य' : 'State')}</p>
              <h2><Link href={`/states/${item.slug}`}>{showHi && item.name_hi ? item.name_hi : item.name_en}{!showHi && item.name_hi ? <span className="hindi-name">{item.name_hi}</span> : null}</Link></h2>
              {showHi && item.description_hi ? <p lang="hi">{item.description_hi}</p> : (item.description_en && <p>{item.description_en}</p>)}
              <Link className="text-link" href={`/states/${item.slug}`} style={{ marginTop: 'auto' }}>
                {dict.common.explore}
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
