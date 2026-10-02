import { ApiState, ContentSearch, DestinationCard, PageHeading, Pagination } from '../../components/content.js';
import { getCollection, parsePage, parseSearchTerm } from '../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Destinations', description: 'Browse published destination guides across India.' };

export default async function DestinationsPage({ searchParams }) {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  
  const params = await searchParams;
  const page = parsePage(params?.page);
  const search = parseSearchTerm(params?.q);
  if (page === null || !search.valid) return <main className="page-shell"><PageHeading eyebrow={dict.content.destinations} title={dict.common.searchLabel}/><ApiState state="invalid"/></main>;
  const result = await getCollection('destinations', { page, limit: 12, q: search.value });
  return <main className="page-shell list-page">
    <PageHeading eyebrow={dict.content.destinations} title={showHi ? 'स्थान खोजें' : 'Search Destinations'} description={showHi ? 'सिर्फ प्रकाशित स्थान मार्गदर्शिकाएँ यहाँ दिखाई जाती हैं।' : 'Only published destination guides are shown here.'}/>
    <ContentSearch pathname="/destinations" value={search.value}/>
    {result.state !== 'success' ? <ApiState state={result.state} label={dict.nav.destinations}/> : result.data.length === 0 ? <ApiState state="empty" label={dict.nav.destinations}/> : <div className="card-grid">{result.data.map((item) => <DestinationCard key={item.slug} item={item}/>)}</div>}
    {result.state === 'success' ? <Pagination pagination={result.pagination} pathname="/destinations" extra={search.value ? { q: search.value } : {}}/> : null}
  </main>;
}
