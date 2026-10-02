import Link from 'next/link';
import { getMapPinUrl } from '../lib/map-url.mjs';
import { getDictionary, getLanguage } from '../lib/i18n.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getCoverImage(type, slug) {
  try {
    const asset = await prisma.media_assets.findUnique({
      where: { storage_path: `content/${type}/${slug}/cover` }
    });
    return asset?.public_url || null;
  } catch {
    return null;
  }
}

export async function ApiState({ state, label }) {
  const dict = await getDictionary();
  if (state === 'empty') return <p className="state-box" role="status">{dict.content.empty.replace('{type}', label)}</p>;
  if (state === 'not-found') return <p className="state-box" role="status">{dict.content.notFound}</p>;
  if (state === 'error') return <p className="state-box state-error" role="alert">{dict.content.error}</p>;
  if (state === 'invalid') return <p className="state-box state-error" role="alert">{dict.content.invalid}</p>;
  return null;
}

export function PageHeading({ eyebrow, title, description }) {
  return <header className="page-heading"><p className="eyebrow">{eyebrow}</p><h1 lang="hi">{title}</h1>{description ? <p>{description}</p> : null}</header>;
}

export async function ContentSearch({ pathname, value }) {
  const dict = await getDictionary();
  return <form className="content-search" action={pathname} method="get" role="search">
    <label htmlFor={`search-${pathname.replaceAll('/', '-')}`}>{dict.common.searchLabel}</label>
    <input id={`search-${pathname.replaceAll('/', '-')}`} type="search" name="q" defaultValue={value || ''} maxLength={100} placeholder={dict.common.searchPlaceholder}/>
    <button className="button-link" type="submit">{dict.common.searchBtn}</button>
    {value ? <Link className="text-link" href={pathname}>{dict.common.searchClear}</Link> : null}
  </form>;
}

export async function Pagination({ pagination, pathname, extra = {} }) {
  const dict = await getDictionary();
  if (!pagination || pagination.totalPages <= 1) return null;
  const linkFor = (page) => {
    const query = new URLSearchParams({ ...extra, page: String(page) });
    return `${pathname}?${query}`;
  };
  return <nav className="pagination" aria-label="सूची के पेज">
    {pagination.page > 1 ? <Link href={linkFor(pagination.page - 1)}>{dict.common.prevPage}</Link> : <span />}
    <span>{dict.common.page} {pagination.page} / {pagination.totalPages}</span>
    {pagination.page < pagination.totalPages ? <Link href={linkFor(pagination.page + 1)}>{dict.common.nextPage}</Link> : <span />}
  </nav>;
}

export async function DestinationCard({ item }) {
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  const location = [showHi && item.districts?.name_hi ? item.districts.name_hi : (item.districts?.name_en || item.district_name), showHi && item.states?.name_hi ? item.states.name_hi : (item.states?.name_en || item.state_name)].filter(Boolean).join(' · ') || (showHi ? 'भारत' : 'India');
  const coverUrl = await getCoverImage('destinations', item.slug);
  return <article className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
    {coverUrl && <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}><img src={coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <p className="card-kicker">{location}</p>
      <h2><Link href={`/destinations/${encodeURIComponent(item.slug)}`}>{showHi && item.name_hi ? item.name_hi : item.name_en}{!showHi && item.name_hi ? <span className="hindi-name">{item.name_hi}</span> : null}</Link></h2>
      {showHi && item.summary_hi ? <p lang="hi">{item.summary_hi}</p> : (item.summary_en ? <p>{item.summary_en}</p> : null)}
    </div>
  </article>;
}

export async function AttractionCard({ item }) {
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  const dict = await getDictionary();
  const destination = item.destinations;
  const destName = destination ? (showHi && destination.name_hi ? destination.name_hi : destination.name_en) : '';
  const coverUrl = await getCoverImage('attractions', item.slug);
  return <article className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
    {coverUrl && <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}><img src={coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <p className="card-kicker">{item.category || dict.content.attractionGuide}{destName ? ` · ${destName}` : ''}</p>
      <h2><Link href={`/attractions/${encodeURIComponent(destination?.slug || 'unknown')}/${encodeURIComponent(item.slug)}`}>{showHi && item.name_hi ? item.name_hi : item.name_en}{!showHi && item.name_hi ? <span className="hindi-name">{item.name_hi}</span> : null}</Link></h2>
      {showHi && item.description_hi ? <p lang="hi">{item.description_hi}</p> : (item.description_en ? <p>{item.description_en}</p> : null)}
    </div>
  </article>;
}

export async function ArticleCard({ item }) {
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  const coverUrl = await getCoverImage('articles', item.slug);
  return <article className="content-card" style={{ padding: 0, overflow: 'hidden' }}>
    {coverUrl && <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}><img src={coverUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
    <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
      <p className="card-kicker">{item.author_name || 'BharatYatra'}</p>
      <h2><Link href={`/articles/${encodeURIComponent(item.slug)}`}>{showHi && item.title_hi ? item.title_hi : item.title_en}{!showHi && item.title_hi ? <span className="hindi-name">{item.title_hi}</span> : null}</Link></h2>
      {showHi && item.excerpt_hi ? <p lang="hi">{item.excerpt_hi}</p> : (item.excerpt_en ? <p>{item.excerpt_en}</p> : null)}
    </div>
  </article>;
}

export async function ContentDetail({ item, kind }) {
  const dict = await getDictionary();
  const lang = await getLanguage();
  
  // Choose correct content based on language
  const showHi = lang === 'hi';
  
  const title = showHi && item.name_hi ? item.name_hi : (item.name_en || item.title_en);
  const titleFallback = showHi && item.name_hi ? (item.name_en || item.title_en) : (showHi && item.title_hi ? item.title_hi : null);
  
  const titleHi = !showHi && (kind === 'article' ? item.title_hi : item.name_hi); // Only show dual lang if english selected and hi exists
  
  const summaryRaw = kind === 'article' ? (showHi && item.excerpt_hi ? item.excerpt_hi : item.excerpt_en) : (showHi && item.summary_hi ? item.summary_hi : item.summary_en);
  const summary = summaryRaw;
  const bodyRaw = kind === 'article' ? (showHi && item.body_hi ? item.body_hi : item.body_en) : (showHi && item.description_hi ? item.description_hi : item.description_en);
  const body = bodyRaw;
  
  const mapUrl = kind === 'article' ? null : getMapPinUrl(item.latitude, item.longitude);
  
  let locationPills = null;
  if (kind === 'destination') {
    const s = item.states;
    const d = item.districts;
    locationPills = (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
        {s && <Link href={`/states/${s.slug}`} className="language-tag">{showHi && s.name_hi ? s.name_hi : s.name_en}</Link>}
        {d && s && <Link href={`/districts/${s.slug}/${d.slug}`} className="language-tag">{showHi && d.name_hi ? d.name_hi : d.name_en}</Link>}
      </div>
    );
  }

  return <article className="detail-content">
    <p className="eyebrow">{kind === 'article' ? dict.content.journal : kind === 'destination' ? dict.content.destinationGuide : dict.content.attractionGuide}</p>
    <h1>{title}{!showHi && titleHi ? <span className="hindi-name" lang="hi">{titleHi}</span> : null}{showHi && titleFallback ? <span className="hindi-name" lang="en">{titleFallback}</span> : null}</h1>
    {locationPills}
    {summary ? <p className="detail-summary">{summary}</p> : null}
    {kind === 'attraction' && item.destinations ? <p className="card-kicker"><Link href={`/destinations/${item.destinations.slug}`}>{showHi && item.destinations.name_hi ? item.destinations.name_hi : item.destinations.name_en}</Link></p> : null}
    
    {(item.best_time_en || item.best_time_hi) && (
      <div className="state-box" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
        <h3 className="card-kicker">{dict.content.bestTime}</h3>
        <p style={{margin: '0.25rem 0'}}>{showHi && item.best_time_hi ? item.best_time_hi : item.best_time_en}</p>
      </div>
    )}

    {mapUrl ? <p className="map-link"><a className="text-link" href={mapUrl} target="_blank" rel="noreferrer">{dict.common.viewOnMap}</a></p> : null}
    {body ? <div className="article-body">{body}</div> : null}
  </article>;
}
