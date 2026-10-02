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

  const [destinations, attractions, articles, statesRes] = await Promise.all([
    getCollection('destinations', { limit: 4 }),
    getCollection('attractions', { limit: 4 }),
    getCollection('articles', { limit: 4 }),
    getCollection('states', { limit: 8 }),
  ]);
  
  const siteMedia = await getSiteMedia();
  const heroImage = siteMedia['hero'] || null; // e.g. a photo if uploaded, otherwise use illustration

  return <main>
    <section className="hero page-shell" style={{ position: 'relative' }}>
      <div className="hero-copy">
        <p className="eyebrow">BHARATYATRA <span className="language-tag">{showHi ? 'हिंदी' : 'EN'}</span></p>
        <h1>{showHi ? 'भारत, हर यात्रा में' : 'India, through every journey'}</h1>
        <p>{dict.home.heroDesc}</p>
        <ContentSearch pathname="/destinations"/>
        <div className="hero-actions">
          <Link className="button-link" href="/states">{dict.home.heroExplore}</Link>
          <Link className="text-link" href="/articles">{dict.common.readArticles}</Link>
        </div>
      </div>
      
      {heroImage ? (
        <div className="hero-art-image" style={{ width: '100%', height: '100%', minHeight: '400px', borderRadius: '24px', overflow: 'hidden', boxShadow: 'var(--glass-shadow)' }}>
          <img src={heroImage} alt="Travel India" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      ) : (
        <div className="hero-art-illustration" aria-hidden="true" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--soft-bg)', borderRadius: '24px', padding: '2rem' }}>
          <MapSymbol style={{ width: '80%', height: '80%', color: 'var(--teal)', opacity: 0.1, position: 'absolute' }} />
          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '2rem', alignItems: 'center' }}>
             <div style={{ display: 'flex', gap: '3rem' }}>
               <div style={{ textAlign: 'center', color: 'var(--teal-secondary)' }}><MountainSymbol style={{ width: '40px', height: '40px' }} /><br/><small>North</small></div>
               <div style={{ textAlign: 'center', color: 'var(--saffron)', marginTop: '-2rem' }}><HeritageFortSymbol style={{ width: '40px', height: '40px' }} /><br/><small>Heritage</small></div>
               <div style={{ textAlign: 'center', color: 'var(--teal-secondary)' }}><TempleSymbol style={{ width: '40px', height: '40px' }} /><br/><small>South</small></div>
             </div>
             <RouteSymbol style={{ width: '80px', height: '20px', color: 'var(--saffron)', marginTop: '1rem' }} />
          </div>
        </div>
      )}
    </section>

    <section className="page-shell content-section">
      <div className="section-heading">
        <PageHeading eyebrow="EXPLORE INDIA" title={showHi ? 'राज्यों और केंद्र शासित प्रदेशों को खोजें' : 'States & Union Territories'} description={showHi ? 'पूरे भारत में प्रामाणिक भौगोलिक खोज' : 'Authentic geographic discovery across India'}/>
        <Link className="text-link" href="/states">{showHi ? 'सभी राज्य ↗' : 'All States ↗'}</Link>
      </div>
      {siteMedia['explore-promo'] && (
        <div style={{ marginBottom: '2rem', borderRadius: '16px', overflow: 'hidden', height: '200px' }}>
          <img src={siteMedia['explore-promo']} alt="Explore India" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}
      {statesRes.state !== 'success' ? <ApiState state={statesRes.state} label="States" /> : statesRes.data.length === 0 ? <ApiState state="empty" label="States" /> : (
        <div className="card-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {statesRes.data.map(st => (
            <Link href={`/states/${st.slug}`} key={st.slug} className="content-card" style={{ minHeight: '180px', padding: '1.5rem', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--soft-bg)' }}>
              <h2 style={{ fontSize: '1.25rem' }}>{showHi && st.name_hi ? st.name_hi : st.name_en}</h2>
              {!showHi && st.name_hi && <span className="hindi-name" style={{ marginTop: '0' }}>{st.name_hi}</span>}
            </Link>
          ))}
        </div>
      )}
    </section>

    <section className="page-shell content-section" aria-label={dict.home.destTitle}>
      <div className="section-heading"><PageHeading eyebrow={dict.home.destEyebrow} title={dict.home.destTitle} description={dict.home.destDesc}/><Link className="text-link" href="/destinations">{dict.common.allDestinations}</Link></div>
      {destinations.state !== 'success' ? <ApiState state={destinations.state} label={dict.nav.destinations}/> : destinations.data.length === 0 ? <ApiState state="empty" label={dict.nav.destinations}/> : <div className="card-grid">{destinations.data.map((item) => <DestinationCard key={item.slug} item={item}/>)}</div>}
    </section>
    
    <section className="page-shell content-section" aria-label={dict.content.attractionGuide}>
      <div className="section-heading"><PageHeading eyebrow="PLACES TO PAUSE" title={showHi ? 'देखने योग्य जगहें' : 'Places to Pause'} description={showHi ? 'प्रकाशित आकर्षण मार्गदर्शिका' : 'Published attraction guides'}/><Link className="text-link" href="/attractions">{showHi ? 'सभी आकर्षण ↗' : 'All attractions ↗'}</Link></div>
      {attractions.state !== 'success' ? <ApiState state={attractions.state} label={dict.nav.attractions}/> : attractions.data.length === 0 ? <ApiState state="empty" label={dict.nav.attractions}/> : <div className="card-grid">{attractions.data.map((item) => <AttractionCard key={`${item.destinations?.slug}-${item.slug}`} item={item}/>)}</div>}
    </section>

    <section className="page-shell content-section" aria-label={dict.home.artTitle}>
      <div className="section-heading"><PageHeading eyebrow={dict.home.artEyebrow} title={dict.home.artTitle} description={dict.home.artDesc}/><Link className="text-link" href="/articles">{dict.home.artLink}</Link></div>
      {articles.state !== 'success' ? <ApiState state={articles.state} label={dict.nav.articles}/> : articles.data.length === 0 ? <ApiState state="empty" label={dict.nav.articles}/> : <div className="card-grid">{articles.data.map((item) => <ArticleCard key={item.slug} item={item}/>)}</div>}
    </section>
  </main>;
}
