import Link from 'next/link';
import NearbyPlacesClient from '../../components/nearby-places-client.js';

export const metadata = {
  title: 'Nearby Places & Attractions | BharatYatra',
  description: 'Find verified tourist destinations, monuments, and hill forts around your current GPS coordinates or base city in India, with real mathematical distances and Google Maps navigation.',
};

export default function NearbyPlacesPage() {
  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Nearby Places</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>GEOGRAPHIC DISCOVERY</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            Find Nearby Places &amp; Attractions
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '780px', lineHeight: 1.6, margin: 0 }}>
            Discover verified monuments, heritage havelis, hill forts, and sacred temples around your current location or chosen hub city. All distances are calculated using precise GPS coordinates.
          </p>
        </header>

        {/* Interactive Nearby Places Client */}
        <NearbyPlacesClient />
      </div>
    </main>
  );
}
