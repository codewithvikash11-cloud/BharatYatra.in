import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getContent } from '../../../lib/content-api.mjs';
import { MarkdownContent } from '../../../lib/markdown.js';
import prisma from '../../../lib/db.js';
import { ContentTypeBadge, ContentTypeTemplateExtras } from '../../../components/article-templates.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  let item = null;
  const result = await getContent('articles', [slug]);
  if (result.state === 'success' && result.payload?.data) {
    item = result.payload.data;
  }
  if (!item) {
    try {
      item = await prisma.articles.findFirst({ where: { slug, status: 'PUBLISHED' } });
    } catch {}
  }
  if (!item) {
    return { title: 'Article Not Found | BharatYatra' };
  }
  const title = item.seo_title_en || item.title_en;
  const description = item.seo_description_en || item.excerpt_en || item.title_en;
  const canonicalUrl = item.canonical_url || `https://bharat-yatra-in.vercel.app/articles/${encodeURIComponent(slug)}`;
  const coverUrl = item.cover_image_url || '/hero.jpg';

  return {
    title: `${title} | BharatYatra Travel Journal`,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: item.published_at,
      authors: [item.author_name || 'BharatYatra Editorial'],
      siteName: 'BharatYatra',
      images: [{ url: coverUrl, width: 1200, height: 630, alt: item.cover_image_alt || title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [coverUrl],
    },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  let item = null;

  // 1. Check API first
  const result = await getContent('articles', [slug]);
  if (result.state === 'success' && result.payload?.data) {
    item = result.payload.data;
  }

  // 2. Direct database query fallback for published records
  if (!item) {
    try {
      const dbArticle = await prisma.articles.findFirst({
        where: { slug, status: 'PUBLISHED' },
        include: {
          destinations: { select: { slug: true, name_en: true, state_name: true } },
          states: { select: { slug: true, name_en: true } },
        },
      });
      if (dbArticle) item = dbArticle;
    } catch {}
  }

  if (!item) {
    notFound();
  }

  // Fetch 2-3 related published articles for internal crawlable links
  let relatedArticles = [];
  try {
    relatedArticles = await prisma.articles.findMany({
      where: {
        status: 'PUBLISHED',
        slug: { not: slug },
      },
      take: 3,
      orderBy: { published_at: 'desc' },
      select: {
        slug: true,
        title_en: true,
        excerpt_en: true,
        category: true,
        cover_image_url: true,
        cover_image_alt: true,
      },
    });
  } catch {}

  const coverUrl = item.cover_image_url || '/hero.jpg';
  const wordCount = (item.body_en || item.excerpt_en || '').split(/\s+/).length;
  const readingTime = Math.max(3, Math.ceil(wordCount / 200));
  const publishDate = item.published_at
    ? new Date(item.published_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    : 'Recent';

  const destination = item.destinations;
  const state = item.states;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title_en,
    description: item.excerpt_en || item.seo_description_en,
    image: coverUrl,
    datePublished: item.published_at,
    author: {
      '@type': 'Person',
      name: item.author_name || 'BharatYatra Editorial',
    },
    publisher: {
      '@type': 'Organization',
      name: 'BharatYatra',
      url: 'https://bharat-yatra-in.vercel.app',
      logo: {
        '@type': 'ImageObject',
        url: 'https://bharat-yatra-in.vercel.app/icon.svg',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://bharat-yatra-in.vercel.app/articles/${slug}`,
    },
  };

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://bharat-yatra-in.vercel.app' },
      { '@type': 'ListItem', position: 2, name: 'Travel Guides', item: 'https://bharat-yatra-in.vercel.app/articles' },
      { '@type': 'ListItem', position: 3, name: item.category || 'Culture', item: `https://bharat-yatra-in.vercel.app/articles` },
      { '@type': 'ListItem', position: 4, name: item.title_en, item: `https://bharat-yatra-in.vercel.app/articles/${slug}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }} />

      <main className="article-page-root">
        {/* ====================================================
            1. BREADCRUMBS & ARTICLE HEADER
            ==================================================== */}
        <div className="page-shell" style={{ maxWidth: '860px', paddingTop: '2.5rem', paddingBottom: '1.5rem' }}>
          <nav className="breadcrumb-nav" aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
            <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem', flexWrap: 'wrap' }}>
              <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
              <li>/</li>
              <li><Link href="/articles" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Travel Guides</Link></li>
              {item.category && (
                <>
                  <li>/</li>
                  <li><Link href={`/articles?category=${encodeURIComponent(item.category)}`} style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{item.category}</Link></li>
                </>
              )}
              <li>/</li>
              <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>{item.title_en}</li>
            </ol>
          </nav>

          {/* Category & Location Badges */}
          <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {item.category && <ContentTypeBadge category={item.category} />}
            {destination && (
              <Link
                href={`/destinations/${destination.slug}`}
                style={{ fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--teal-deep)', background: 'var(--cream)', border: '1px solid var(--border-color)', padding: '0.25rem 0.75rem', borderRadius: '999px', textDecoration: 'none' }}
              >
                📍 {destination.name_en}
              </Link>
            )}
            {state && (
              <Link
                href={`/states/${state.slug}`}
                style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text-muted)', textDecoration: 'none' }}
              >
                {state.name_en}
              </Link>
            )}
          </div>

          <h1 style={{ fontSize: 'clamp(2rem, 4.5vw, 3rem)', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', lineHeight: 1.25, margin: '0 0 1.25rem 0' }}>
            {item.title_en}
          </h1>

          {item.excerpt_en && (
            <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.75rem 0', fontStyle: 'italic' }}>
              {item.excerpt_en}
            </p>
          )}

          {/* Byline / Metadata */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', padding: '1rem 0', margin: '1.5rem 0 2rem 0', fontSize: '0.9rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--teal-deep)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#FFFDF8', fontWeight: 700, fontSize: '0.95rem' }}>
                BY
              </div>
              <div>
                <strong style={{ display: 'block', color: 'var(--text-primary)' }}>{item.author_name || 'BharatYatra Editorial'}</strong>
                <span style={{ fontSize: '0.82rem' }}>Published {publishDate}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.85rem' }}>
              <span>⏱ {readingTime} min read</span>
              <span>📖 English Edition</span>
            </div>
          </div>
        </div>

        {/* ====================================================
            2. COVER IMAGE
            ==================================================== */}
        <div className="page-shell" style={{ maxWidth: '1040px', marginBottom: '2.5rem' }}>
          <figure style={{ margin: 0 }}>
            <div style={{ width: '100%', aspectRatio: '16/9', maxHeight: '520px', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-color)' }}>
              <img
                src={coverUrl}
                alt={item.cover_image_alt || item.title_en}
                fetchPriority="high"
                decoding="async"
                width="1200"
                height="675"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            {item.cover_image_alt && (
              <figcaption style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '0.6rem', fontStyle: 'italic' }}>
                {item.cover_image_alt}
              </figcaption>
            )}
          </figure>
        </div>

        {/* ====================================================
            3. ARTICLE BODY (MARKDOWN PROSE)
            ==================================================== */}
        <div className="page-shell" style={{ maxWidth: '820px', paddingBottom: '3rem' }}>
          <article className="article-prose-container" style={{ fontSize: '1.1rem', lineHeight: 1.85, color: 'var(--text-primary)' }}>
            <MarkdownContent content={item.body_en} />
          </article>

          {/* Content-Aware Specialized Template Extras */}
          <ContentTypeTemplateExtras
            category={item.category}
            destination={destination}
            state={state}
            title={item.title_en}
          />

          {/* Related Destination Banner */}
          {destination && (
            <div style={{ marginTop: '3.5rem', padding: '2rem', borderRadius: 'var(--radius-lg)', background: 'var(--cream)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
              <div>
                <p className="section-eyebrow" style={{ margin: 0 }}>EXPLORE THE DESTINATION</p>
                <h3 style={{ margin: '0.35rem 0 0 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.4rem' }}>
                  Planning a journey to {destination.name_en}?
                </h3>
                <p style={{ margin: '0.35rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
                  Explore the latest verified places, practical guidance, and editorial stories for {destination.name_en}.
                </p>
              </div>
              <Link href={`/destinations/${destination.slug}`} className="btn-gold-pill" style={{ textDecoration: 'none' }}>
                View {destination.name_en} Guide →
              </Link>
            </div>
          )}
        </div>

        {/* ====================================================
            4. MORE STORIES FROM BHARATYATRA (INTERNAL LINKS)
            ==================================================== */}
        {relatedArticles.length > 0 && (
          <section className="content-section shaded" style={{ padding: '4rem 0', borderTop: '1px solid var(--border-color)' }}>
            <div className="page-shell" style={{ maxWidth: '1040px' }}>
              <div className="section-heading-row" style={{ marginBottom: '2rem' }}>
                <div className="section-title-group">
                  <p className="section-eyebrow">CONTINUE READING</p>
                  <h2 className="section-main-title">
                    More stories for<br />
                    <span className="serif-italic-gold">the road.</span>
                  </h2>
                </div>
                <Link href="/articles" className="section-link-more">
                  All articles <span>→</span>
                </Link>
              </div>

              <div className="article-related-grid">
                {relatedArticles.map((rel) => (
                  <Link key={rel.slug} href={`/articles/${rel.slug}`} className="story-card-item" style={{ textDecoration: 'none' }}>
                    <div className="story-card-media" style={{ height: '180px' }}>
                      <img
                        src={rel.cover_image_url || '/hero.jpg'}
                        alt={rel.cover_image_alt || rel.title_en}
                        loading="lazy"
                        decoding="async"
                        width="600"
                        height="360"
                      />
                    </div>
                    <div className="story-card-body">
                      <p className="story-card-kicker">{rel.category || 'TRAVEL GUIDE'}</p>
                      <h3 className="story-card-title" style={{ fontSize: '1.15rem' }}>
                        {rel.title_en}
                      </h3>
                      {rel.excerpt_en && (
                        <p className="story-card-excerpt" style={{ fontSize: '0.88rem' }}>
                          {rel.excerpt_en}
                        </p>
                      )}
                      <span className="story-card-link-cta">
                        Read story <span>→</span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
