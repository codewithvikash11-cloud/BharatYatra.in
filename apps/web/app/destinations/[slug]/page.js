import { notFound } from 'next/navigation';
import { ApiState, ContentDetail } from '../../../components/content.js';
import { getContent } from '../../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const result = await getContent('destinations', [slug]);
  if (result.state !== 'success') return { title: 'Not found' };
  const item = result.payload.data;
  return { title: item.name_en, description: item.summary_en || item.name_en, alternates: { canonical: `/destinations/${encodeURIComponent(slug)}` } };
}

export default async function DestinationDetailPage({ params }) {
  const { slug } = await params;
  const dict = await getDictionary();
  const result = await getContent('destinations', [slug]);
  if (result.state === 'not-found') notFound();
  if (result.state !== 'success') return <main className="page-shell"><ApiState state="error" label={dict.nav.destinations}/></main>;
  
  const item = result.payload.data;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    name: item.name_en,
    description: item.summary_en || item.name_en,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="page-shell detail-page"><ContentDetail item={item} kind="destination"/></main>
    </>
  );
}
