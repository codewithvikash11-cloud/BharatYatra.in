import Link from 'next/link';
import WeatherGuideClient from '../../components/weather-guide-client.js';

export const metadata = {
  title: 'India Weather & Best Time to Visit Guide | BharatYatra',
  description: 'Month-by-month climate guide for India: discover season-wise temperatures, monsoon windows, winter heritage conditions, and ideal regional circuits.',
};

export default function WeatherPage() {
  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '980px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Weather & Climate</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>SEASONAL CLIMATE ADVISORY</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            Best Time to Visit India: Weather Guide
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            India spans six distinct climatic zones. Plan around mild winter sunshine in the plains, clear skies in the deserts, and lush monsoon retreats in the Western Ghats.
          </p>
        </header>

        {/* Client Tool */}
        <WeatherGuideClient />
      </div>
    </main>
  );
}
