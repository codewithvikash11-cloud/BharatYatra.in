import { ApiState, AttractionCard, ContentSearch, PageHeading, Pagination } from '../../components/content.js';
import { getCollection, parsePage, parseSearchTerm } from '../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Attractions', description: 'Browse published attractions in India.' };

export default async function AttractionsPage({ searchParams }) {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';
  
  const params = await searchParams;
  const page = parsePage(params?.page);
  const destination = params?.destination;
  const search = parseSearchTerm(params?.q);
  if (page === null || !search.valid || (destination !== undefined && (typeof destination !== 'string' || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(destination)))) {
    return <main className="page-shell"><PageHeading eyebrow={dict.content.attractionGuide.toUpperCase()} title={dict.common.searchLabel}/><ApiState state="invalid"/></main>;
  }
  const result = await getCollection('attractions', { page, limit: 12, destination, q: search.value });
  return <main className="page-shell list-page">
    <PageHeading eyebrow={dict.content.attractionGuide.toUpperCase()} title={showHi ? 'आकर्षण देखें' : 'Search Attractions'} description={showHi ? 'प्रकाशित आकर्षण मार्गदर्शिकाएँ।' : 'Published attraction guides.'}/>
    <ContentSearch pathname="/attractions" value={search.value}/>
    {destination ? <p className="filter-note">{showHi ? 'स्थान: ' : 'Destination: '}{destination} · <a href="/attractions">{showHi ? 'फ़िल्टर हटाएँ' : 'Clear filter'}</a></p> : null}
    {result.state !== 'success' ? <ApiState state={result.state} label={dict.nav.attractions}/> : result.data.length === 0 ? <ApiState state="empty" label={dict.nav.attractions}/> : <div className="card-grid">{result.data.map((item) => <AttractionCard key={`${item.destinations.slug}-${item.slug}`} item={item}/>)}</div>}
    {result.state === 'success' ? <Pagination pagination={result.pagination} pathname="/attractions" extra={{ ...(destination ? { destination } : {}), ...(search.value ? { q: search.value } : {}) }}/>: null}
  </main>;
}
