import Link from 'next/link';

export const metadata = {
  title: 'Travel Help & Safety Helpline | Essential India Travel Guide | BharatYatra',
  description: 'Verified official 24x7 emergency helplines, tourist helpline 1363, visa & entry regulations, UPI digital payments guide, and cultural etiquette for traveling in India.',
};

export default function TravelHelpPage() {
  return (
    <main className="tool-page-root" style={{ background: '#FFFDF8', minHeight: '80vh', padding: '2.5rem 0 5rem 0' }}>
      <div className="page-shell" style={{ maxWidth: '1040px', margin: '0 auto', padding: '0 1.25rem' }}>
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" style={{ marginBottom: '1.5rem' }}>
          <ol style={{ display: 'flex', gap: '0.5rem', listStyle: 'none', margin: 0, padding: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            <li><Link href="/" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Home</Link></li>
            <li>/</li>
            <li style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Travel Help & Safety</li>
          </ol>
        </nav>

        {/* Heading */}
        <header style={{ marginBottom: '2.5rem' }}>
          <p className="section-eyebrow" style={{ margin: 0 }}>OFFICIAL SAFETY & PRACTICAL GUIDANCE</p>
          <h1 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: 'clamp(2.2rem, 4vw, 3rem)', margin: '0.35rem 0 0.75rem 0', lineHeight: 1.2 }}>
            Essential Travel Help & Helplines
          </h1>
          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: '720px', lineHeight: 1.6, margin: 0 }}>
            Verified multi-lingual emergency phone numbers, official government tourism portals, digital currency information, and safety standards for travelers across India.
          </p>
        </header>

        {/* 1. Emergency Helplines Callout Box */}
        <section style={{ marginBottom: '3rem' }}>
          <div
            style={{
              background: 'linear-gradient(135deg, var(--teal-deep) 0%, #173633 100%)',
              color: '#FFFFFF',
              borderRadius: 'var(--radius-lg)',
              padding: '2.5rem',
              boxShadow: 'var(--shadow-md)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🚨</span>
              <h2 style={{ fontFamily: 'var(--font-heading)', margin: 0, fontSize: '1.5rem', color: '#FFFDF8' }}>
                24x7 National Emergency & Assistance Numbers
              </h2>
            </div>
            <p style={{ margin: '0 0 1.75rem 0', fontSize: '0.95rem', opacity: 0.9, lineHeight: 1.6 }}>
              Toll-free emergency numbers accessible from any mobile or landline network in India without an area code.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>National Emergency</span>
                <strong style={{ display: 'block', fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-muted)', margin: '0.2rem 0' }}>112</strong>
                <span style={{ fontSize: '0.82rem', opacity: 0.85 }}>Unified Police, Fire & Medical response</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ministry of Tourism Helpline</span>
                <strong style={{ display: 'block', fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-muted)', margin: '0.2rem 0' }}>1363</strong>
                <span style={{ fontSize: '0.82rem', opacity: 0.85 }}>24x7 Multi-lingual toll-free assistance (12 languages)</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Indian Railways Support</span>
                <strong style={{ display: 'block', fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-muted)', margin: '0.2rem 0' }}>139</strong>
                <span style={{ fontSize: '0.82rem', opacity: 0.85 }}>RailMadad security & passenger grievances</span>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.15)' }}>
                <span style={{ fontSize: '0.8rem', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Medical Emergency</span>
                <strong style={{ display: 'block', fontSize: '2rem', fontFamily: 'var(--font-heading)', color: 'var(--gold-muted)', margin: '0.2rem 0' }}>108 / 102</strong>
                <span style={{ fontSize: '0.82rem', opacity: 0.85 }}>Ambulance service across all Indian states</span>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Official Portals Directory */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            Official Government Portals & Services
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🛂</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--teal-deep)' }}>Indian Visa Online</h3>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Official Government of India portal for e-Visa applications (Tourist, Business, Medical, Conference).
              </p>
              <a href="https://indianvisaonline.gov.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                indianvisaonline.gov.in ↗
              </a>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🏛️</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--teal-deep)' }}>Incredible India</h3>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Ministry of Tourism official national tourism portal featuring certified guides, regional offices, and cultural itineraries.
              </p>
              <a href="https://www.incredibleindia.org" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                incredibleindia.org ↗
              </a>
            </div>

            <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🚆</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--teal-deep)' }}>IRCTC Railway Booking</h3>
              </div>
              <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Official railway portal for reservation of Vande Bharat, Rajdhani, Shatabdi, and Express trains across India.
              </p>
              <a href="https://www.irctc.co.in" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-secondary)', fontSize: '0.85rem', fontWeight: 600 }}>
                irctc.co.in ↗
              </a>
            </div>
          </div>
        </section>

        {/* 3. Practical Guidance Cards */}
        <section style={{ marginBottom: '3.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.5rem', marginBottom: '1.25rem' }}>
            Practical Traveler Guidance
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div style={{ background: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>💳</span>
                <h3 style={{ margin: 0, color: 'var(--teal-deep)', fontSize: '1.15rem' }}>Currency & UPI Payments</h3>
              </div>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                India is largely cashless. Street vendors, autorickshaws, and monuments accept UPI (Unified Payments Interface).
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                <li>International travelers from G20 nations can get UPI One World prepaid digital wallets at major international airports.</li>
                <li>International Visa and Mastercard credit cards are widely accepted at hotels and established stores.</li>
                <li>Keep small ₹100, ₹200, and ₹500 currency notes for rural areas and temple donations.</li>
              </ul>
            </div>

            <div style={{ background: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem' }}>🛕</span>
                <h3 style={{ margin: 0, color: 'var(--teal-deep)', fontSize: '1.15rem' }}>Sacred Site Etiquette</h3>
              </div>
              <p style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Sacred spaces welcome visitors of all faiths when modest cultural standards are observed:
              </p>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-primary)', lineHeight: 1.7 }}>
                <li>Always remove footwear at the entrance shoe stand (free or nominal ₹5 token).</li>
                <li>Cover shoulders and knees; cover your head with a scarf at Gurdwaras and select mosques.</li>
                <li>Avoid leather items (belts, wallets) when visiting traditional Hindu temple inner sanctums.</li>
                <li>Walk clockwise (pradakshina) around stupas and shrines.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
