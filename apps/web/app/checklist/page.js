import Link from 'next/link';
import TravelChecklistClient from '../../components/travel-checklist-client.js';

export const metadata = {
  title: 'Travel Checklist | What to Pack for India | BharatYatra',
  description: 'Interactive packing checklist for traveling in India: documents, health, temple-friendly footwear, electrical adapters, and hygiene essentials.',
};

export default function ChecklistPage() {
  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '980px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Travel Checklist</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>SMART PACKING GUIDE</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            India Travel Preparation Checklist
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Curated list of verified travel essentials for India. Items are saved locally in your browser so you can check them off as you pack.
          </p>
        </header>

        {/* Client Tool */}
        <TravelChecklistClient />
      </div>
    </main>
  );
}
