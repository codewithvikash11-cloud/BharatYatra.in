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
                    <span>{dict.common.explore}</span>
                    <IconArrowRight size={15} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Scoped CSS for States Directory */}
      <style jsx>{`
        .by-states-visual-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }

        .by-state-visual-card {
          background: #ffffff;
          border: 1px solid var(--border-color, #dce4dc);
          border-radius: var(--radius-md, 14px);
          overflow: hidden;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(21, 62, 58, 0.05);
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
        }

        .by-state-visual-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(21, 62, 58, 0.12);
          border-color: var(--teal-secondary, #247a72);
        }

        .by-state-card-media {
          position: relative;
          width: 100%;
          height: 190px;
          overflow: hidden;
          background: #102f2c;
        }

        .by-state-card-media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .by-state-visual-card:hover .by-state-card-media img {
          transform: scale(1.05);
        }

        .by-state-card-gradient {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(16, 47, 44, 0.1) 40%, rgba(16, 47, 44, 0.7) 100%);
        }

        .by-state-type-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(21, 62, 58, 0.85);
          backdrop-filter: blur(4px);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.03em;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .by-state-card-content {
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .by-state-card-title {
          font-family: var(--font-heading, 'Playfair Display', Georgia, serif);
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--teal-primary, #153e3a);
          margin: 0 0 0.4rem;
          display: flex;
          align-items: baseline;
          gap: 0.4rem;
          flex-wrap: wrap;
        }

        .by-state-hindi-name {
          font-family: inherit;
          font-size: 0.85rem;
          color: var(--gold-dark, #a86f20);
          font-weight: 500;
        }

        .by-state-card-desc {
          font-size: 0.88rem;
          line-height: 1.5;
          color: var(--text-secondary, #64736f);
          margin: 0 0 1rem;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .by-state-card-action {
          margin-top: auto;
          display: flex;
          align-items: center;
          gap: 0.35rem;
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--teal-secondary, #247a72);
          transition: transform 0.2s ease;
        }

        .by-state-visual-card:hover .by-state-card-action {
          transform: translateX(3px);
          color: var(--gold-dark, #a86f20);
        }

        @media (max-width: 768px) {
          .by-states-visual-grid {
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 1rem;
          }
          .by-state-card-media {
            height: 160px;
          }
        }

        @media (max-width: 480px) {
          .by-states-visual-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
