import Link from 'next/link';
import { ArticleCard, ApiState, AttractionCard, ContentSearch, DestinationCard, PageHeading } from '../components/content.js';
import { getCollection } from '../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../lib/i18n.js';
import { MapSymbol, RouteSymbol, MountainSymbol, TempleSymbol, HeritageFortSymbol } from '../components/travel-symbols.js';
import { PrismaClient } from '@prisma/client';

export const dynamic = 'force-dynamic';

const prisma = new PrismaClient();

async function getSiteMedia() {
  try {
    const assets = await prisma.media_assets.findMany({
      where: { storage_path: { startsWith: 'site/home/' } }
    });
    return assets.reduce((acc, asset) => {
      acc[asset.storage_path.replace('site/home/', '')] = asset.public_url || null;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export default async function HomePage() {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';

  const [destinations, attractions, articles, statesRes, stats] = await Promise.all([
    getCollection('destinations', { limit: 4 }),
    getCollection('attractions', { limit: 4 }),
    getCollection('articles', { limit: 4 }),
    getCollection('states', { limit: 8 }),
    prisma.$transaction([
      prisma.states.count({ where: { type: 'STATE', status: 'PUBLISHED' } }),
      prisma.states.count({ where: { type: 'UT', status: 'PUBLISHED' } }),
      prisma.destinations.count({ where: { status: 'PUBLISHED' } }),
      prisma.articles.count({ where: { status: 'PUBLISHED' } }),
    ]).catch(() => [28, 8, 1000, 5000])
  ]);
  
  const [stateCount, utCount, destCount, articleCount] = stats;

  const siteMedia = await getSiteMedia();
  const heroImage = siteMedia['hero'] || '/hero.jpg';

  const regions = [
    { name: 'North India', nameHi: 'उत्तर भारत', slug: 'north', desc: 'Mountains, Heritage & Spirituality' },
    { name: 'South India', nameHi: 'दक्षिण भारत', slug: 'south', desc: 'Temples, Backwaters & Beaches' },
    { name: 'East India', nameHi: 'पूर्वी भारत', slug: 'east', desc: 'Culture, Rivers & Lush Landscapes' },
    { name: 'West India', nameHi: 'पश्चिम भारत', slug: 'west', desc: 'Deserts, Forts & Coastlines' },
    { name: 'Central India', nameHi: 'मध्य भारत', slug: 'central', desc: 'Forests, Wildlife & Ancient Heritage' },
    { name: 'Northeast India', nameHi: 'पूर्वोत्तर भारत', slug: 'northeast', desc: 'Hills, Waterfalls & Tribal Cultures' }
  ];

  return <main>
    <section className="hero page-shell" style={{ position: 'relative' }}>
      <div className="hero-copy">
        <p className="eyebrow">BHARATYATRA <span className="language-tag">{showHi ? 'हिंदी' : 'EN'}</span></p>
        <h1>{showHi ? 'भारत, हर यात्रा में' : 'India, through every journey.'}</h1>
        <p>{showHi ? 'भारत के हर कोने से स्थान, कहानियाँ, मार्ग और अनुभव खोजें।' : 'Discover places, stories, routes and experiences from every corner of India.'}</p>
        <ContentSearch pathname="/destinations" />
        <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['Rajasthan', 'Kerala', 'Nawalgarh', 'Jaipur', 'Varanasi', 'Leh', 'Goa', 'Hampi'].map(s => (
             <Link key={s} href={`/destinations?q=${s}`} className="language-tag" style={{ color: 'var(--muted)', borderColor: 'var(--line)' }}>{s}</Link>
          ))}
        </div>
        <div className="hero-actions">
          <Link className="button-link" href="/states">{showHi ? 'भारत खोजें' : 'Explore India'}</Link>
          <Link className="text-link" href="/articles">{showHi ? 'यात्रा गाइड पढ़ें' : 'Read Travel Guides'}</Link>
        </div>
      </div>

      <div className="hero-art-image" style={{ width: '100%', height: '100%', minHeight: '500px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--glass-shadow)', position: 'relative' }}>
        <img src={heroImage} alt="Travel India Map" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </div>
    </section>

    <section className="page-shell" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', background: 'var(--card)', padding: '2rem', borderRadius: '16px', boxShadow: 'var(--glass-shadow)', border: '1px solid var(--line)', marginTop: '-2rem', position: 'relative', zIndex: 10 }}>
       <div style={{ flex: 1, minWidth: '150px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--saffron)', fontFamily: 'Playfair Display, serif' }}>{stateCount > 0 ? stateCount : 28}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>{showHi ? 'राज्य' : 'States'}</div>
       </div>
       <div style={{ flex: 1, minWidth: '150px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--saffron)', fontFamily: 'Playfair Display, serif' }}>{utCount > 0 ? utCount : 8}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>{showHi ? 'केंद्र शासित प्रदेश' : 'Union Territories'}</div>
       </div>
       <div style={{ flex: 1, minWidth: '150px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--saffron)', fontFamily: 'Playfair Display, serif' }}>{destCount > 0 ? `${destCount}+` : '1000+'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>{showHi ? 'गंतव्य' : 'Destinations'}</div>
       </div>
       <div style={{ flex: 1, minWidth: '150px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--saffron)', fontFamily: 'Playfair Display, serif' }}>{articleCount > 0 ? `${articleCount}+` : '5000+'}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase' }}>{showHi ? 'यात्रा कहानियाँ' : 'Travel Stories'}</div>
       </div>
    </section>

    <section className="page-shell content-section" style={{ marginTop: '4rem' }}>
      <div className="section-heading">
        <PageHeading eyebrow="EXPLORE INDIA" title={showHi ? 'राज्यों और केंद्र शासित प्रदेशों को खोजें' : 'States & Union Territories'} description={showHi ? 'हिमालय से लेकर हिंद महासागर तक' : 'From the Himalayas to the Indian Ocean.'} />
        <Link className="button-link" href="/map" style={{ padding: '0.75rem 1.25rem', fontSize: '0.85rem' }}>{showHi ? 'इंटरएक्टिव मैप देखें' : 'View Interactive Map →'}</Link>
      </div>
      {statesRes.state !== 'success' ? <ApiState state={statesRes.state} label="States" /> : statesRes.data.length === 0 ? <ApiState state="empty" label="States" /> : (
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {statesRes.data.map(st => (
            <Link href={`/states/${st.slug}`} key={st.slug} className="content-card" style={{ minHeight: '200px', padding: '1.5rem', background: 'var(--card)' }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--teal)' }}>{showHi && st.name_hi ? st.name_hi : st.name_en}</h2>
              {!showHi && st.name_hi && <span className="hindi-name" style={{ marginTop: '0' }}>{st.name_hi}</span>}
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <span style={{ fontSize: '0.8rem', color: 'var(--saffron)', fontWeight: 600 }}>{st.type}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>

    <section className="page-shell content-section" style={{ background: 'var(--soft-bg)', padding: '4rem 2rem', borderRadius: '24px' }}>
       <div className="section-heading">
          <PageHeading eyebrow="REGIONS" title={showHi ? 'क्षेत्र के अनुसार खोजें' : 'Discover by Region'} description={showHi ? 'भारत के विविध क्षेत्रों का अन्वेषण करें' : 'Explore India\'s diverse regions, each with its own unique culture, landscapes and experiences.'} />
       </div>
       <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {regions.map(r => (
             <Link key={r.slug} href={`/destinations?region=${r.slug}`} className="content-card" style={{ padding: '2rem', background: 'var(--gradient-brand)', color: 'white', borderColor: 'transparent' }}>
                <h2 style={{ color: 'white' }}>{showHi ? r.nameHi : r.name}</h2>
                <p style={{ color: 'rgba(255,255,255,0.8)' }}>{r.desc}</p>
                <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.85rem' }}>
                   Explore →
                </div>
             </Link>
          ))}
       </div>
    </section>

    <section className="page-shell content-section" aria-label={dict.home.destTitle}>
      <div className="section-heading"><PageHeading eyebrow={dict.home.destEyebrow} title={showHi ? 'विशेष गंतव्य' : 'Featured Destinations'} description={showHi ? 'आपकी अगली यात्रा को प्रेरित करने के लिए चुने गए स्थान' : 'Handpicked places to inspire your next journey across India.'} /><Link className="text-link" href="/destinations">{dict.common.allDestinations}</Link></div>
      {destinations.state !== 'success' ? <ApiState state={destinations.state} label={dict.nav.destinations} /> : destinations.data.length === 0 ? <ApiState state="empty" label={dict.nav.destinations} /> : <div className="card-grid">{destinations.data.map((item) => <DestinationCard key={item.slug} item={item} />)}</div>}
    </section>

    <section className="page-shell content-section" aria-label={dict.content.attractionGuide}>
      <div className="section-heading"><PageHeading eyebrow="ATTRACTIONS" title={showHi ? 'देखने योग्य जगहें' : 'Places to Explore'} description={showHi ? 'विरासत, प्रकृति, मंदिर और बहुत कुछ' : 'Heritage, Nature, Temples, Beaches, Mountains, and Culture.'} /><Link className="text-link" href="/attractions">{showHi ? 'सभी आकर्षण ↗' : 'All attractions ↗'}</Link></div>
      {attractions.state !== 'success' ? <ApiState state={attractions.state} label={dict.nav.attractions} /> : attractions.data.length === 0 ? <ApiState state="empty" label={dict.nav.attractions} /> : <div className="card-grid">{attractions.data.map((item) => <AttractionCard key={`${item.destinations?.slug}-${item.slug}`} item={item} />)}</div>}
    </section>

    <section className="page-shell content-section" aria-label={dict.home.artTitle}>
      <div className="section-heading"><PageHeading eyebrow={dict.home.artEyebrow} title={showHi ? 'नवीनतम यात्रा कहानियाँ' : 'Latest Travel Stories'} description={showHi ? 'हमारे संपादकों से गाइड, कहानियाँ और अंतर्दृष्टि' : 'Guides, stories and insights from our editors.'} /><Link className="text-link" href="/articles">{dict.home.artLink}</Link></div>
      {articles.state !== 'success' ? <ApiState state={articles.state} label={dict.nav.articles} /> : articles.data.length === 0 ? <ApiState state="empty" label={dict.nav.articles} /> : <div className="card-grid">{articles.data.map((item) => <ArticleCard key={item.slug} item={item} />)}</div>}
    </section>
  </main>;
}
