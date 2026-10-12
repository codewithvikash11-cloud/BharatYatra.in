import Link from 'next/link';
import { getCollection } from '../lib/content-api.mjs';

export const dynamic = 'force-dynamic';

const photos = {
  hero: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85',
  jaipur: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=900&q=80',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=900&q=80',
  hills: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=900&q=80',
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=900&q=80',
  varanasi: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=900&q=80',
};

const fallbackDestinations = [
  ['jaipur-rajasthan', 'Jaipur', 'Rajasthan', 'Forts · Palaces · Culture', photos.jaipur],
  ['varanasi', 'Varanasi', 'Uttar Pradesh', 'Spiritual · Ghats · Heritage', photos.varanasi],
  ['manali', 'Manali', 'Himachal Pradesh', 'Mountains · Nature · Adventure', photos.hills],
  ['goa', 'Goa', 'Goa', 'Beaches · Food · Relaxation', photos.goa],
];

const tools = [['Destinations','Places to visit','/destinations'],['Trip Planner','Plan your journey','/articles?category=Planning'],['Routes & Transport','Trains, bus, flight, road','/search?q=transport'],['Stay & Food','Hotels, restaurants','/articles?category=Food'],['Travel Guides','Practical information','/articles'],['Interactive Map','Explore India','/states']];
const categories = [['Forts & Palaces','Royal architecture','/attractions'],['Temples & Spiritual','Sacred journeys','/articles?category=Heritage'],['Nature & Wildlife','Forests and mountains','/destinations?q=nature'],['Heritage & Culture','Living traditions','/articles?category=Culture']];

export default async function HomePage() {
  const [destRes, articleRes] = await Promise.all([getCollection('destinations',{limit:6}), getCollection('articles',{limit:6})]);
  const destinations = destRes.state === 'success' && destRes.data.length ? destRes.data.map((item, index) => [item.slug,item.name_en,item.states?.name_en || item.state_name || 'India',item.summary_en || 'Explore this published destination guide.', [photos.jaipur, photos.varanasi, photos.hills, photos.goa][index % 4]]) : fallbackDestinations;
  const articles = articleRes.state === 'success' ? articleRes.data : [];
  return <main className="reference-home">
    <section className="reference-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(16,47,44,.86),rgba(16,47,44,.3)),url(${photos.hero})`}}>
      <div className="reference-shell reference-hero-copy">
        <p>DISCOVER INCREDIBLE INDIA</p><h1>Explore India, Plan<br/>Better Trips</h1>
        <h2>India, through every journey.</h2>
        <span>Your complete travel companion for destinations, itineraries, transport, stays, food and practical travel information.</span>
        <form action="/search" method="get" className="reference-search" role="search"><input name="q" type="search" aria-label="Search destinations" placeholder="Where do you want to go? (e.g. Jaipur, Kerala, Varanasi)"/><button>Search</button></form>
        <div className="reference-popular">Popular: {['Jaipur','Udaipur','Goa','Varanasi','Rishikesh','Kerala'].map(q=><Link key={q} href={`/search?q=${q}`}>{q}</Link>)}</div>
      </div>
    </section>
    <section className="reference-shell reference-tools">{tools.map(([title,sub,href],i)=><Link href={href} key={title}><b>{String(i+1).padStart(2,'0')}</b><strong>{title}</strong><span>{sub}</span></Link>)}</section>
    <section className="reference-shell reference-section"><header><div><h2>Popular Destinations</h2><p>Explore India&apos;s most loved destinations</p></div><Link href="/destinations">View all destinations →</Link></header><div className="reference-destinations">{destinations.slice(0,6).map(([slug,name,state,summary,image])=><Link className="reference-destination" href={`/destinations/${slug}`} key={slug}><img src={image} alt={name} width="560" height="360" loading="lazy"/><div><h3>{name}</h3><p>{state}</p><span>{summary}</span></div></Link>)}</div></section>
    <section className="reference-cream"><div className="reference-shell reference-section"><header><div><h2>Explore India by Region</h2><p>Discover destinations across different regions</p></div><Link href="/states">All states &amp; UTs →</Link></header><div className="reference-regions"><Link href="/states"><img src={photos.hills} alt="North India" width="600" height="300"/><b>North India</b><span>Himalayas, heritage, spirituality</span></Link><Link href="/states"><img src={photos.kerala} alt="South India" width="600" height="300"/><b>South India</b><span>Beaches, temples, culture</span></Link><Link href="/states"><img src={photos.jaipur} alt="West India" width="600" height="300"/><b>West India</b><span>Rajasthan, Gujarat, beaches</span></Link></div></div></section>
    <section className="reference-shell reference-section"><header><div><h2>Plan Your Trip</h2><p>Useful tools to make your India journey easier</p></div><Link href="/articles?category=Planning">View all tools →</Link></header><div className="reference-categories">{categories.map(([title,sub,href],i)=><Link href={href} key={title}><b>{String(i+1).padStart(2,'0')}</b><h3>{title}</h3><p>{sub}</p><span>Explore →</span></Link>)}</div></section>
    <section className="reference-cream"><div className="reference-shell reference-section"><header><div><h2>Latest From Our Blog</h2><p>Travel tips, guides and stories from across India</p></div><Link href="/articles">View all articles →</Link></header><div className="reference-articles">{(articles.length?articles:[{slug:'',title_en:'Travel stories are being verified',excerpt_en:'New editor-approved guides will appear here.',cover_image_url:photos.varanasi}]).map((a,i)=><Link href={a.slug?`/articles/${a.slug}`:'/articles'} key={a.slug||'empty'}><img src={a.cover_image_url||[photos.varanasi,photos.hills,photos.kerala][i%3]} alt={a.cover_image_alt||a.title_en} width="600" height="340" loading="lazy"/><h3>{a.title_en}</h3><p>{a.excerpt_en||'Read our latest published travel guide.'}</p><span>Read article →</span></Link>)}</div></div></section>
    <section className="reference-cta"><div className="reference-shell"><div><h2>Start Planning Your India Journey Today</h2><p>Discover destinations, build your itinerary and get practical travel information — all in one place.</p></div><Link href="/destinations">Plan Your Trip Now →</Link></div></section>
  </main>;
}
