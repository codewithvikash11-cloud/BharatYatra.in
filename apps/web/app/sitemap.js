import { getCollection } from '../lib/content-api.mjs';

export const dynamic='force-dynamic';
export const revalidate=0;

async function publishedRecords(resource){
  const first=await getCollection(resource,{page:1,limit:100});
  if(first.state!=='success')return [];
  const pages=[...Array(Math.max(0,first.pagination.totalPages-1)).keys()].map((index)=>index+2);
  const remaining=[];
  for(let index=0;index<pages.length;index+=4){
    const batch=await Promise.all(pages.slice(index,index+4).map((page)=>getCollection(resource,{page,limit:100})));
    if(batch.some((result)=>result.state!=='success'))return [];
    remaining.push(...batch.flatMap((result)=>result.data));
  }
  return [...first.data,...remaining];
}

export default async function sitemap(){
  const base=(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000').replace(/\/+$/,'');
  const [destinations,attractions,articles]=await Promise.all([
    publishedRecords('destinations'),publishedRecords('attractions'),publishedRecords('articles'),
  ]);
  const fixed=['/','/destinations','/attractions','/articles','/about'].map((path)=>({url:`${base}${path}`}));
  return [...fixed,
    ...destinations.map((item)=>({url:`${base}/destinations/${encodeURIComponent(item.slug)}`,lastModified:item.published_at||undefined})),
    ...attractions.filter((item)=>item.destinations?.slug).map((item)=>({url:`${base}/attractions/${encodeURIComponent(item.destinations.slug)}/${encodeURIComponent(item.slug)}`,lastModified:item.published_at||undefined})),
    ...articles.map((item)=>({url:`${base}/articles/${encodeURIComponent(item.slug)}`,lastModified:item.published_at||undefined})),
  ];
}
