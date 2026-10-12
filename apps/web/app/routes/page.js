import Link from 'next/link';
import RouteFinderClient from '../../components/route-finder-client.js';

export const metadata = {
  title: 'Routes & Transport in India | Find Your Route | BharatYatra',
  description: 'Verified transport guide for India: compare trains (Vande Bharat, Shatabdi), expressways, domestic flights, and state bus routes across popular circuits.',
};

export default function RoutesPage() {
  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '980px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Routes & Transport</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>CONNECTIVITY & TRANSIT</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            India Routes & Transport Directory
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Compare trains, expressways, domestic flights, and state buses across major Indian travel circuits with verified station names and official booking portals.
          </p>
        </header>

        {/* Client Tool */}
        <RouteFinderClient />
      </div>
    </main>
  );
}
