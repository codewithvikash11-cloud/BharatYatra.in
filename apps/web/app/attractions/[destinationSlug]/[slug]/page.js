import { notFound } from 'next/navigation';
import { ApiState, ContentDetail } from '../../../../components/content.js';
import { getContent } from '../../../../lib/content-api.mjs';
import { getDictionary } from '../../../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { destinationSlug, slug } = await params;
  const result = await getContent('attractions', [destinationSlug, slug]);
  if (result.state !== 'success') return { title: 'Not found' };
  const item = result.payload.data;
  return { title: item.name_en, description: item.description_en || item.name_en, alternates: { canonical: `/attractions/${encodeURIComponent(destinationSlug)}/${encodeURIComponent(slug)}` } };
}

export default async function AttractionDetailPage({ params }) {
  const { destinationSlug, slug } = await params;
  const dict = await getDictionary();
  const result = await getContent('attractions', [destinationSlug, slug]);
  if (result.state === 'not-found') notFound();
  if (result.state !== 'success') return <main className="page-shell"><ApiState state="error" label={dict.nav.attractions}/></main>;
  return <main className="page-shell detail-page"><ContentDetail item={result.payload.data} kind="attraction"/></main>;
}
