import Link from 'next/link';
import { getMapPinUrl } from '../lib/map-url.mjs';
import { getDictionary, getLanguage } from '../lib/i18n.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getCoverImage(type, slug) {
  try {
    const asset = await prisma.media_assets.findUnique({
      where: { storage_path: `content/${type}/${slug}/cover` },
    });
    return asset?.public_url || null;
  } catch {
    return null;
  }
}

export async function ApiState({ state, label }) {
  const dict = await getDictionary();
  if (state === 'empty') return <div className="empty-editorial-card"><p>No published {label.toLowerCase()} available at the moment. Check back soon as our travel editors publish new guides.</p></div>;
  if (state === 'not-found') return <p className="state-box" role="status">This content is not available.</p>;
  if (state === 'error') return <p className="state-box state-error" role="alert">Content could not be loaded at this time. Please try again shortly.</p>;
  if (state === 'invalid') return <p className="state-box state-error" role="alert">Invalid request parameters.</p>;
  return null;
}

export function PageHeading({ eyebrow, title, description }) {
  return (
    <header className="page-heading">
      {eyebrow && <p className="section-eyebrow">{eyebrow}</p>}
      <h1 className="section-main-title">{title}</h1>
      {description && <p className="section-subtext">{description}</p>}
    </header>
  );
}

export async function ContentSearch({ pathname, value }) {
  return (
    <form className="hero-search-box" action={pathname} method="get" role="search">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#87938F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
      <input
        id={`search-${pathname.replaceAll('/', '-')}`}
        className="search-input-field"
        type="search"
        name="q"
        defaultValue={value || ''}
        maxLength={100}
        placeholder="Search destinations, states, or monuments..."
        aria-label="Search destinations, states, or attractions"
      />
      <button className="search-submit-btn" type="submit">
        Search
      </button>
      {value ? (
        <Link className="section-link-more" href={pathname} style={{ fontSize: '0.82rem', marginLeft: '0.5rem' }}>
          Clear
        </Link>
      ) : null}
    </form>
  );
}

export async function Pagination({ pagination, pathname, extra = {} }) {
  if (!pagination || pagination.totalPages <= 1) return null;
  const linkFor = (page) => {
    const query = new URLSearchParams({ ...extra, page: String(page) });
    return `${pathname}?${query}`;
  };
  return (
    <nav className="pagination" aria-label="Pagination navigation">
      {pagination.page > 1 ? <Link href={linkFor(pagination.page - 1)}>← Previous</Link> : <span />}
      <span>Page {pagination.page} of {pagination.totalPages}</span>
      {pagination.page < pagination.totalPages ? <Link href={linkFor(pagination.page + 1)}>Next →</Link> : <span />}
    </nav>
  );
}

export async function DestinationCard({ item }) {
  const location = [
    item.districts?.name_en || item.district_name,
    item.states?.name_en || item.state_name
  ].filter(Boolean).join(' · ') || 'India';

  const coverUrl = await getCoverImage('destinations', item.slug);

  return (
    <article className="destination-card-item">
      <div className="destination-card-media">
        {coverUrl ? (
          <img src={coverUrl} alt={item.name_en || 'Destination'} className="destination-card-img" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #153E3A 0%, #247A72 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>BharatYatra</span>
          </div>
        )}
        <span className="destination-card-badge">Destination</span>
      </div>
      <div className="destination-card-body">
        <p className="destination-location-kicker">{location}</p>
        <h2 className="destination-card-title">
          <Link href={`/destinations/${encodeURIComponent(item.slug)}`}>
            {item.name_en}
          </Link>
        </h2>
        {item.summary_en && (
          <p className="destination-card-summary">
            {item.summary_en}
          </p>
        )}
        <div className="destination-card-footer">
          <Link href={`/destinations/${encodeURIComponent(item.slug)}`}>
            Explore Destination <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export async function AttractionCard({ item }) {
  const destination = item.destinations;
  const destName = destination ? destination.name_en : '';
  const coverUrl = await getCoverImage('attractions', item.slug);

  return (
    <article className="destination-card-item">
      <div className="destination-card-media">
        {coverUrl ? (
          <img src={coverUrl} alt={item.name_en || 'Attraction'} className="destination-card-img" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #102F2C 0%, #153E3A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Attraction</span>
          </div>
        )}
        <span className="destination-card-badge">{item.category || 'Monument'}</span>
      </div>
      <div className="destination-card-body">
        <p className="destination-location-kicker">{destName ? `${destName} · ` : ''}{item.category || 'Historic Monument'}</p>
        <h2 className="destination-card-title">
          <Link href={`/attractions/${encodeURIComponent(destination?.slug || 'guide')}/${encodeURIComponent(item.slug)}`}>
            {item.name_en}
          </Link>
        </h2>
        {item.description_en && (
          <p className="destination-card-summary">
            {item.description_en}
          </p>
        )}
        <div className="destination-card-footer">
          <Link href={`/attractions/${encodeURIComponent(destination?.slug || 'guide')}/${encodeURIComponent(item.slug)}`}>
            View Attraction <span className="arrow">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export async function ArticleCard({ item }) {
  const coverUrl = await getCoverImage('articles', item.slug);
  const wordCount = (item.body_en || item.excerpt_en || '').split(/\s+/).length;
  const readingTime = Math.max(2, Math.ceil(wordCount / 200));

  return (
    <article className="article-card-item">
      <div className="article-card-media">
        {coverUrl ? (
          <img src={coverUrl} alt={item.title_en || 'Travel Guide'} className="article-card-img" />
        ) : (
          <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #153E3A 0%, #247A72 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Journal</span>
          </div>
        )}
      </div>
      <div className="article-card-body">
        <div className="article-meta-row">
          <span>Travel Journal</span>
          <span>·</span>
          <span>{readingTime} min read</span>
        </div>
        <h2 className="article-card-title">
          <Link href={`/articles/${encodeURIComponent(item.slug)}`}>
            {item.title_en}
          </Link>
        </h2>
        {item.excerpt_en && (
          <p className="article-card-excerpt">
            {item.excerpt_en}
          </p>
        )}
        <div className="article-card-author-row">
          <span className="article-author-info">By {item.author_name || 'BharatYatra Editors'}</span>
          <Link href={`/articles/${encodeURIComponent(item.slug)}`} className="article-read-link">
            Read Guide <span>→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}

export async function ContentDetail({ item, kind }) {
  const dict = await getDictionary();
  const title = item.name_en || item.title_en || 'Untitled';
  const summary = kind === 'article' ? item.excerpt_en : item.summary_en;
  const body = kind === 'article' ? item.body_en : item.description_en;
  const mapUrl = kind === 'article' ? null : getMapPinUrl(item.latitude, item.longitude);
  const coverUrl = await getCoverImage(kind === 'article' ? 'articles' : kind === 'destination' ? 'destinations' : 'attractions', item.slug);

  let locationPills = null;
  if (kind === 'destination') {
    const s = item.states;
    const d = item.districts;
    locationPills = (
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {s && (
          <Link href={`/states/${s.slug}`} className="suggestion-pill">
            {s.name_en}
          </Link>
        )}
        {d && s && (
          <Link href={`/districts/${s.slug}/${d.slug}`} className="suggestion-pill">
            {d.name_en}
          </Link>
        )}
      </div>
    );
  }

  const wordCount = (body || '').split(/\s+/).length;
  const readingTime = Math.max(2, Math.ceil(wordCount / 200));

  return (
    <article className="detail-content">
      <p className="section-eyebrow">
        {kind === 'article' ? 'TRAVEL JOURNAL' : kind === 'destination' ? 'DESTINATION GUIDE' : 'ATTRACTION GUIDE'}
      </p>
      <h1>{title}</h1>

      {kind === 'article' && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
          {item.author_name && <span style={{ fontWeight: 600, color: 'var(--teal-primary)' }}>By {item.author_name}</span>}
          <span>· {readingTime} min read</span>
          {item.published_at && (
            <span>· Published {new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          )}
        </div>
      )}

      {locationPills}

      {coverUrl && (
        <div style={{ width: '100%', height: '420px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', marginBottom: '2.5rem', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
          <img src={coverUrl} alt={title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      )}

      {summary && <p className="detail-summary">{summary}</p>}

      {kind === 'attraction' && item.destinations && (
        <p className="destination-location-kicker" style={{ marginBottom: '1.5rem' }}>
          Destination: <Link href={`/destinations/${item.destinations.slug}`} style={{ color: 'var(--teal-secondary)', textDecoration: 'underline' }}>{item.destinations.name_en}</Link>
        </p>
      )}

      {item.best_time_en && (
        <div className="state-box" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
          <h3 className="section-eyebrow" style={{ margin: 0 }}>BEST TIME TO VISIT</h3>
          <p style={{ margin: '0.35rem 0 0 0', fontWeight: 500, color: 'var(--teal-primary)' }}>{item.best_time_en}</p>
        </div>
      )}

      {mapUrl && (
        <p style={{ margin: '1.5rem 0' }}>
          <a className="button-link-secondary" href={mapUrl} target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', padding: '0.6rem 1.25rem' }}>
            View Geographic Coordinates on Map ↗
          </a>
        </p>
      )}

      {body && <div className="article-body">{body}</div>}
    </article>
  );
}
