import Link from 'next/link';

export const metadata = {
  title: 'Cultural Events & Festivals in India | BharatYatra',
  description: 'Verified calendar of vibrant Indian cultural festivals, fairs, and heritage celebrations: Pushkar Camel Fair, Diwali in Jaipur, Hornbill, and Rann Utsav.',
};

const festivals = [
  {
    title: 'Pushkar Camel Fair (Kartik Mela)',
    location: 'Pushkar, Rajasthan',
    period: 'November (Kartik Purnima)',
    category: 'Cultural Fair & Livestock',
    description: 'One of the world’s largest camel and livestock fairs. Hundreds of thousands of pastoralists gather in the Thar Desert dunes for camel beauty contests, folk music, Ferris wheels, and sacred ritual dips in holy Pushkar Lake.',
    etiquette: 'Be respectful when photographing sadhus and villagers. Wear sunglasses and scarves for desert dust.',
    destSlug: 'jaipur',
    cover: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Dev Deepawali & Ganga Mahotsav',
    location: 'Varanasi, Uttar Pradesh',
    period: 'Fifteen days after Diwali (Full Moon)',
    category: 'Spiritual Celebration',
    description: 'Known as the Diwali of the Gods. Over one million earthen lamps (diyas) light up all eighty-four ghats along the sacred River Ganga, transforming the riverfront into a magnificent river of light.',
    etiquette: 'Book sunrise and evening boats weeks in advance. Stay with crowds and follow police lane directions.',
    destSlug: null,
    cover: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Hornbill Festival',
    location: 'Kisama Heritage Village, Kohima, Nagaland',
    period: '1 – 10 December (Annual)',
    category: 'Tribal Cultural Heritage',
    description: 'The "Festival of Festivals" uniting all seventeen indigenous Naga tribes. Showcases traditional morungs (dormitories), warrior dances, indigenous archery, rock concerts, and rich Naga culinary traditions.',
    etiquette: 'Inner Line Permit (ILP) required for Indian nationals; foreign tourists must register with Foreigners Registration Office.',
    destSlug: null,
    cover: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Rann Utsav White Desert Festival',
    location: 'Dhordo, Kutch, Gujarat',
    period: 'November – February (Full Moon Highlights)',
    category: 'Desert Festival & Crafts',
    description: 'A celebration of music, dance, and Kutchi embroidery amidst the white salt desert of Kutch under starry full moon skies. Luxury tent cities, desert safaris, and artisan handicraft markets.',
    etiquette: 'Permits required for entry to the White Desert border area (issued online or at Bhirandiyara checkpost).',
    destSlug: null,
    cover: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Mysore Dasara',
    location: 'Mysuru, Karnataka',
    period: 'September / October (Navratri)',
    category: 'Royal Heritage Procession',
    description: 'A 10-day state celebration culminating in the grand Jumboo Savari elephant procession carrying the golden idol of Goddess Chamundeshwari. Mysore Palace is illuminated nightly by 100,000 light bulbs.',
    etiquette: 'Expect massive crowds along Sayyaji Rao Road; gold cards for royal seating are available via Karnataka Tourism.',
    destSlug: null,
    cover: 'https://images.unsplash.com/photo-1615836245337-f5b9b2303f10?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Khajuraho Dance Festival',
    location: 'Khajuraho, Madhya Pradesh',
    period: 'February (Week-long)',
    category: 'Classical Arts & Dance',
    description: 'Masters of Indian classical dance (Kathak, Bharatanatyam, Odissi, Kuchipudi) perform under open skies against the floodlit backdrop of the UNESCO World Heritage Western Group of Temples.',
    etiquette: 'Open-air seated event; winter evenings can be cool so carry a warm shawl.',
    destSlug: null,
    cover: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=800&q=80',
  },
];

export default function EventsPage() {
  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Events & Festivals</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>LIVING TRADITIONS & CELEBRATIONS</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            Festivals & Cultural Gatherings of India
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Discover calendar dates, historical significance, cultural etiquette, and practical tips for experiencing India’s most celebrated living heritage events.
          </p>
        </header>

        {/* Festivals Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.75rem', marginBottom: '3.5rem' }}>
          {festivals.map((fest) => (
            <article
              key={fest.title}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                <img
                  src={fest.cover}
                  alt={fest.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <span style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--teal-deep)', color: '#FFFDF8', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.65rem', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {fest.category}
                </span>
              </div>

              <div style={{ padding: '1.75rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.82rem', color: 'var(--gold-dark)', fontWeight: 600 }}>📍 {fest.location}</span>
                  <span style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>🗓️ {fest.period}</span>
                </div>

                <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.35rem', margin: '0 0 0.75rem 0' }}>
                  {fest.title}
                </h2>

                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: '0 0 1.25rem 0', flex: 1 }}>
                  {fest.description}
                </p>

                <div style={{ background: 'var(--cream)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', fontSize: '0.82rem', color: 'var(--text-primary)', marginBottom: '1.25rem' }}>
                  <strong>Traveler Etiquette:</strong> {fest.etiquette}
                </div>

                <div>
                  <Link
                    href={fest.destSlug ? `/destinations/${fest.destSlug}` : '/trip-planner'}
                    className="btn-outline-teal"
                    style={{ textDecoration: 'none', fontSize: '0.85rem', display: 'inline-block' }}
                  >
                    Plan Trip for This Festival →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
