import Link from 'next/link';
import MapExplorerClient from '../../components/map-explorer-client.js';

export const metadata = {
  title: 'Interactive India Travel Map | BharatYatra',
  description: 'Explore destinations across North, South, East, West, Central, and Northeast India with geographical coordinates, highlights, and verified travel guides.',
};

export default function MapPage() {
  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Interactive Map</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>GEOGRAPHIC DISCOVERY</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            Interactive Travel Map of India
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Browse major travel hubs and cultural landmarks across regional zones with exact coordinates and direct links to comprehensive travel guides.
          </p>
        </header>

        {/* Client Tool */}
        <MapExplorerClient />
      </div>
    </main>
  );
}
