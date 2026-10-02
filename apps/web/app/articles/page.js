import { ApiState, ArticleCard, ContentSearch, PageHeading, Pagination } from '../../components/content.js';
import { getCollection, parsePage, parseSearchTerm } from '../../lib/content-api.mjs';
import { getDictionary, getLanguage } from '../../lib/i18n.js';

export const dynamic = 'force-dynamic';

export const metadata = { title: 'Travel stories', description: 'Read published BharatYatra travel stories.' };

export default async function ArticlesPage({ searchParams }) {
  const dict = await getDictionary();
  const lang = await getLanguage();
  const showHi = lang === 'hi';

  const params = await searchParams;
  const page = parsePage(params?.page);
  const search = parseSearchTerm(params?.q);
  if (page === null || !search.valid) return <main className="page-shell"><PageHeading eyebrow={dict.content.journal} title={dict.nav.articles}/><ApiState state="invalid"/></main>;
  const result = await getCollection('articles', { page, limit: 12, q: search.value });
  return <main className="page-shell list-page">
    <PageHeading eyebrow={dict.content.journal} title={showHi ? 'यात्रा लेख' : 'Travel Stories'} description={showHi ? 'प्रकाशित कहानियाँ और मार्गदर्शिकाएँ।' : 'Published stories and guides.'}/>
    <ContentSearch pathname="/articles" value={search.value}/>
    {result.state !== 'success' ? <ApiState state={result.state} label={dict.nav.articles}/> : result.data.length === 0 ? <ApiState state="empty" label={dict.nav.articles}/> : <div className="card-grid">{result.data.map((item) => <ArticleCard key={item.slug} item={item}/>)}</div>}
    {result.state === 'success' ? <Pagination pagination={result.pagination} pathname="/articles" extra={search.value ? { q: search.value } : {}}/> : null}
  </main>;
}
