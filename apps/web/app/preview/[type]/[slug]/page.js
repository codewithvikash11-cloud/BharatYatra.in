import { notFound } from 'next/navigation';
import { createHmac } from 'node:crypto';
import prisma from '../../../../lib/db.js';
import Link from 'next/link';
import { MarkdownContent } from '../../../../lib/markdown.js';
import { ContentTypeBadge, ContentTypeTemplateExtras } from '../../../../components/article-templates.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params, searchParams }) {
  const { type, slug } = await params;
  return {
    title: `[Draft Preview] ${slug} · BharatYatra Admin`,
    robots: {
      index: false,
      follow: false,
      noarchive: true,
      nosnippet: true,
    },
  };
}

export default async function DraftPreviewPage({ params, searchParams }) {
  const { type, slug } = await params;
  const { token } = await searchParams;

  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) notFound();

  // Validate security preview token
  const expectedToken = createHmac('sha256', secret).update(`${type}:${slug}`).digest('hex');
  if (!token || token !== expectedToken) {
    notFound();
  }

  // Fetch record regardless of status (DRAFT, REVIEW, or PUBLISHED)
  let item = null;
  try {
    if (type === 'articles') {
      item = await prisma.articles.findFirst({
        where: { slug },
        include: { destinations: true, states: true },
      });
    } else if (type === 'destinations') {
      item = await prisma.destinations.findFirst({
        where: { slug },
        include: {
          states: true,
          districts: true,
          tehsils: true,
          attractions: true,
          articles: true,
        },
      });
    } else if (type === 'attractions') {
      item = await prisma.attractions.findFirst({
        where: { slug },
        include: {
          destinations: { include: { states: true } },
        },
      });
    } else if (type === 'itineraries') {
      item = await prisma.itineraries.findFirst({
        where: { slug },
        include: { destinations: true },
      });
    }
  } catch (err) {
    console.error('Draft preview DB query error:', err);
    notFound();
  }

  if (!item) {
    notFound();
  }

  const isLive = item.status === 'PUBLISHED';

  return (
    <div className="draft-preview-wrapper" style={{ background: '#FFFDF8', minHeight: '100vh' }}>
      {/* ====================================================
          PRIVATE ADMIN PREVIEW HEADER BANNER
          ==================================================== */}
      <aside
        role="region"
        aria-label="Admin Preview Mode"
        style={{
          background: '#153E3A',
          color: '#FFFDF8',
          padding: '12px 24px',
          borderBottom: '3px solid #C58B32',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 9999,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800, letterSpacing: '0.05em', fontSize: '0.82rem' }}>
            🔒 ADMIN DRAFT PREVIEW
          </span>
          <span
            style={{
              background: isLive ? '#2e7d32' : item.status === 'REVIEW' ? '#0277bd' : '#C58B32',
              color: '#fff',
              padding: '3px 10px',
              borderRadius: '99px',
              fontSize: '0.72rem',
              fontWeight: 700,
              letterSpacing: '0.05em',
            }}
          >
            STATUS: {item.status}
          </span>
          <span style={{ fontSize: '0.8rem', opacity: 0.9 }}>
            {isLive
              ? 'This content is published and visible on the public website.'
              : 'Private preview only. This page is NOT visible to public visitors or search engines.'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {isLive && (
            <Link
              href={type === 'articles' ? `/articles/${item.slug}` : type === 'destinations' ? `/destinations/${item.slug}` : `/${type}`}
              style={{
                fontSize: '0.78rem',
                color: '#E9E0CF',
                textDecoration: 'underline',
                fontWeight: 600,
              }}
            >
              View Public Page ↗
            </Link>
          )}
          <a
            href="http://localhost:3001/content"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: '#fff',
              padding: '4px 12px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              textDecoration: 'none',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.25)',
            }}
          >
            ← Back to Admin Studio
          </a>
        </div>
      </aside>

      {/* ====================================================
          TEMPLATE-SPECIFIC DRAFT PREVIEWS
          ==================================================== */}
      {type === 'articles' && renderArticlePreview(item)}
      {type === 'destinations' && renderDestinationPreview(item)}
      {type === 'attractions' && renderAttractionPreview(item)}
      {type === 'itineraries' && renderItineraryPreview(item)}
    </div>
  );
}

function renderArticlePreview(item) {
  const readTime = Math.max(2, Math.ceil((item.body_en || '').split(/\s+/).length / 200));

  return (
    <article className="by-article-page" style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto' }}>
      <nav aria-label="Breadcrumb" className="by-breadcrumbs" style={{ marginBottom: '1.5rem' }}>
        <ol style={{ display: 'flex', gap: '8px', listStyle: 'none', padding: 0, fontSize: '0.85rem', color: '#64736F' }}>
          <li><Link href="/">Home</Link></li>
          <li>/</li>
          <li><Link href="/blog">Articles</Link></li>
          <li>/</li>
          <li aria-current="page" style={{ color: '#153E3A', fontWeight: 600 }}>{item.title_en}</li>
        </ol>
      </nav>

      <header style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '1rem' }}>
          <ContentTypeBadge category={item.category} />
          {item.destinations && (
            <span style={{ fontSize: '0.78rem', color: '#247A72', background: '#eef6f5', padding: '3px 10px', borderRadius: '4px', fontWeight: 600 }}>
              📍 {item.destinations.name_en}
            </span>
          )}
          {item.states && (
            <span style={{ fontSize: '0.78rem', color: '#64736F', background: '#f5f5f0', padding: '3px 10px', borderRadius: '4px' }}>
              {item.states.name_en}
            </span>
          )}
        </div>

        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', color: '#153E3A', lineHeight: 1.25, margin: '0 0 1rem 0' }}>
          {item.title_en}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#64736F', fontSize: '0.88rem', paddingBottom: '1.25rem', borderBottom: '1px solid #DCE4DC' }}>
          <span>By <strong>{item.author_name || 'BharatYatra Editorial'}</strong></span>
          <span>·</span>
          <span>{readTime} min read</span>
          <span>·</span>
          <span>Draft Version</span>
        </div>
      </header>

      {item.cover_image_url && (
        <div style={{ width: '100%', height: '420px', borderRadius: '12px', overflow: 'hidden', marginBottom: '2rem', boxShadow: '0 6px 20px rgba(0,0,0,0.08)' }}>
          <img
            src={item.cover_image_url}
            alt={item.cover_image_alt || item.title_en}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>
      )}

      {item.excerpt_en && (
        <div style={{ fontSize: '1.15rem', fontStyle: 'italic', color: '#173633', background: '#F7F3E8', borderLeft: '4px solid #C58B32', padding: '1.25rem 1.75rem', borderRadius: '0 8px 8px 0', margin: '2rem 0', lineHeight: 1.6 }}>
          {item.excerpt_en}
        </div>
      )}

      {/* Content-Type Specialized Extras */}
      <ContentTypeTemplateExtras category={item.category} destination={item.destinations} />

      {/* Body Content */}
      <div className="by-article-body" style={{ color: '#173633', fontSize: '1.05rem', lineHeight: 1.8 }}>
        <MarkdownContent content={item.body_en || '_No content written yet._'} />
      </div>
    </article>
  );
}

function renderDestinationPreview(dest) {
  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <div style={{ background: '#153E3A', color: '#FFFDF8', borderRadius: '16px', padding: '3rem 2.5rem', marginBottom: '2rem' }}>
        <span style={{ fontSize: '0.78rem', background: 'rgba(197,139,50,0.3)', color: '#F7F3E8', padding: '4px 12px', borderRadius: '99px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          {dest.states?.name_en || dest.state_name || 'India'}
        </span>
        <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.8rem', margin: '1rem 0 0.5rem 0' }}>
          {dest.name_en}
        </h1>
        {dest.name_hi && <p style={{ fontSize: '1.2rem', opacity: 0.8, margin: '0 0 1rem 0' }}>{dest.name_hi}</p>}
        {dest.summary_en && <p style={{ fontSize: '1.15rem', opacity: 0.95, maxWidth: '800px', lineHeight: 1.6, margin: 0 }}>{dest.summary_en}</p>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <div>
          <section style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #DCE4DC', marginBottom: '2rem' }}>
            <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#153E3A', marginBottom: '1rem' }}>About {dest.name_en}</h2>
            <div style={{ color: '#173633', lineHeight: 1.8 }}>
              <MarkdownContent content={dest.description_en || 'No description entered.'} />
            </div>
          </section>
        </div>

        <div>
          <aside style={{ background: '#F7F3E8', padding: '1.75rem', borderRadius: '12px', border: '1px solid #DCE4DC' }}>
            <h3 style={{ color: '#153E3A', fontSize: '1.1rem', marginBottom: '1rem' }}>Quick Facts</h3>
            <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}><strong>State:</strong> {dest.state_name || dest.states?.name_en || 'India'}</p>
            {dest.district_name && <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}><strong>District:</strong> {dest.district_name}</p>}
            {dest.best_time_en && <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}><strong>Best Time:</strong> {dest.best_time_en}</p>}
            {dest.latitude && <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}><strong>Coordinates:</strong> {dest.latitude}, {dest.longitude}</p>}
          </aside>
        </div>
      </div>
    </div>
  );
}

function renderAttractionPreview(attraction) {
  const dest = attraction.destinations;
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <span style={{ fontSize: '0.78rem', background: '#eef6f5', color: '#153E3A', padding: '4px 12px', borderRadius: '99px', fontWeight: 700 }}>
        {attraction.category || 'Historical Attraction'} · {dest?.name_en || 'India'}
      </span>
      <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', color: '#153E3A', margin: '1rem 0' }}>
        {attraction.name_en}
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
        <section style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #DCE4DC' }}>
          <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#153E3A', marginBottom: '1rem' }}>About this Attraction</h2>
          <div style={{ color: '#173633', lineHeight: 1.8 }}>
            <MarkdownContent content={attraction.description_en || 'No description entered.'} />
          </div>
        </section>
        <aside style={{ background: '#F7F3E8', padding: '1.75rem', borderRadius: '12px', border: '1px solid #DCE4DC' }}>
          <h3 style={{ color: '#153E3A', fontSize: '1.1rem', marginBottom: '1rem' }}>Visitor Information</h3>
          {attraction.visiting_hours && <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}><strong>Hours:</strong> {attraction.visiting_hours}</p>}
          {attraction.entry_fee_note && <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}><strong>Entry:</strong> {attraction.entry_fee_note}</p>}
          {attraction.source_url && (
            <p style={{ fontSize: '0.88rem', margin: '0.5rem 0' }}>
              <strong>Official Link:</strong> <a href={attraction.source_url} target="_blank" rel="noreferrer" style={{ color: '#247A72' }}>Source ↗</a>
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}

function renderItineraryPreview(itinerary) {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
      <span style={{ fontSize: '0.78rem', background: '#F7F3E8', color: '#C58B32', padding: '4px 12px', borderRadius: '99px', fontWeight: 700 }}>
        ⏱ {itinerary.duration_days} Days Suggested Itinerary
      </span>
      <h1 style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '2.5rem', color: '#153E3A', margin: '1rem 0' }}>
        {itinerary.title_en}
      </h1>
      <section style={{ background: '#fff', padding: '2rem', borderRadius: '12px', border: '1px solid #DCE4DC' }}>
        <h2 style={{ fontFamily: 'Playfair Display, serif', color: '#153E3A', marginBottom: '1rem' }}>Day-by-Day Schedule</h2>
        <div style={{ color: '#173633', lineHeight: 1.8 }}>
          <MarkdownContent content={itinerary.description_en || 'No description entered.'} />
        </div>
      </section>
    </div>
  );
}
