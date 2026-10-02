import { notFound } from 'next/navigation';
import { ApiState, ContentDetail } from '../../../components/content.js';
import { getContent } from '../../../lib/content-api.mjs';
import { getDictionary } from '../../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getContent('articles', [slug]);
  if (result.state !== 'success') return { title: 'Not found' };
  const item = result.payload.data;
  return {
    title: item.seo_title_en || item.title_en,
    description: item.seo_description_en || item.excerpt_en || item.title_en,
    alternates: { canonical: `/articles/${encodeURIComponent(slug)}` },
  };
}

export default async function ArticleDetailPage({ params }) {
  const { slug } = await params;
  const dict = await getDictionary();
  const result = await getContent('articles', [slug]);
  if (result.state === 'not-found') notFound();
  if (result.state !== 'success') return <main className="page-shell"><ApiState state="error" label={dict.nav.articles}/></main>;
  
  const item = result.payload.data;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: item.title_en,
    description: item.excerpt_en || item.seo_description_en,
    datePublished: item.published_at || new Date().toISOString(),
    author: { '@type': 'Organization', name: 'BharatYatra' },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="page-shell detail-page"><ContentDetail item={item} kind="article"/></main>
    </>
  );
}
