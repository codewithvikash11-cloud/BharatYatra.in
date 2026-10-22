import Link from 'next/link';
import { PageHeading, ApiState } from '../../components/content.js';
import { getCollection } from '../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../lib/i18n.js';
import { getSiteAppearance } from '../../lib/appearance.js';
import { IconArrowRight, IconMapPin } from '../../components/icons.js';

export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'भारत के राज्य और केंद्र शासित प्रदेश | States and Union Territories of India | BharatYatra',
  description: 'Explore authentic cultural heritage, monuments, itineraries, and travel guides across all 36 States and Union Territories of India.',
};

const DEFAULT_STATE_IMAGES = {
  rajasthan: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
  'jammu-and-kashmir': 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
  ladakh: 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
  'himachal-pradesh': 'https://images.unsplash.com/photo-1506461883276-594a12b11cf3?auto=format&fit=crop&w=800&q=80',
  uttarakhand: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
  'tamil-nadu': 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  karnataka: 'https://images.unsplash.com/photo-1600100397608-f010f443b711?auto=format&fit=crop&w=800&q=80',
  maharashtra: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&w=800&q=80',
  'madhya-pradesh': 'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=800&q=80',
  'west-bengal': 'https://images.unsplash.com/photo-1558431382-27e303142255?auto=format&fit=crop&w=800&q=80',
  odisha: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  meghalaya: 'https://images.unsplash.com/photo-1518002171953-a080ee817e1f?auto=format&fit=crop&w=800&q=80',
  sikkim: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80',
};

const GENERIC_STATE_IMAGE = 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=800&q=80';

export default async function StatesPage() {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';

  const [result, appearance] = await Promise.all([
    getCollection('states', { limit: 50 }),
    getSiteAppearance(),
  ]);

  return (
    <main className="list-page page-shell" style={{ maxWidth: '1240px', margin: '0 auto', padding: '2.5rem 1.25rem 4rem' }}>
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
        <div className="by-states-visual-grid">
          {result.data.map((item) => {
            const customCover = appearance[`site/states/${item.slug}`];
            const stateCover = customCover || DEFAULT_STATE_IMAGES[item.slug] || GENERIC_STATE_IMAGE;
            const isUt = item.type === 'UT';

            return (
              <Link href={`/states/${item.slug}`} className="by-state-visual-card" key={item.slug}>
                <div className="by-state-card-media">
                  <img
                    src={stateCover}
                    alt={item.name_en}
                    loading="lazy"
                    decoding="async"
                    width="600"
                    height="380"
                  />
                  <div className="by-state-card-gradient" />
                  <span className="by-state-type-badge">
                    {isUt ? (showHi ? 'केंद्र शासित प्रदेश' : 'Union Territory') : (showHi ? 'राज्य' : 'State')}
                  </span>
                </div>

                <div className="by-state-card-content">
                  <h2 className="by-state-card-title">
                    {showHi && item.name_hi ? item.name_hi : item.name_en}
                    {!showHi && item.name_hi && <span className="by-state-hindi-name">{item.name_hi}</span>}
                  </h2>

                  <p className="by-state-card-desc">
                    {showHi && item.description_hi
                      ? item.description_hi
                      : item.description_en || `Explore iconic destinations, heritage, and itineraries across ${item.name_en}.`}
                  </p>

                  <div className="by-state-card-action">
                    <span>{showHi ? 'देखें' : 'Explore'}</span>
                    <IconArrowRight size={15} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}

