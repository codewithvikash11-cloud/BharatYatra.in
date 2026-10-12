import Link from 'next/link';

export function ContentTypeBadge({ category }) {
  const cat = (category || '').toLowerCase();
  let label = 'TRAVEL GUIDE';
  let icon = '📖';

  if (cat.includes('heritage') || cat.includes('history')) {
    label = 'HISTORY & HERITAGE';
    icon = '🏛️';
  } else if (cat.includes('food') || cat.includes('culture')) {
    label = 'FOOD & CULTURE';
    icon = '🍲';
  } else if (cat.includes('tip') || cat.includes('plan')) {
    label = 'TRAVEL PLANNING';
    icon = '🧭';
  } else if (cat.includes('sight') || cat.includes('near')) {
    label = 'NEARBY PLACES & SIGHTSEEING';
    icon = '📍';
  } else if (cat.includes('itinerar')) {
    label = 'CURATED ITINERARY';
    icon = '🗓️';
  } else if (cat.includes('event') || cat.includes('update')) {
    label = 'TRAVEL UPDATE & EVENT';
    icon = '📢';
  }

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        fontSize: '0.78rem',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--gold-muted)',
        background: 'var(--teal-deep)',
        padding: '0.3rem 0.85rem',
        borderRadius: '999px',
      }}
    >
      <span>{icon}</span> {label}
    </span>
  );
}

export function ContentTypeTemplateExtras({ category, destination, state, title }) {
  const cat = (category || '').toLowerCase();

  // 1. HISTORY & HERITAGE TEMPLATE
  if (cat.includes('heritage') || cat.includes('history')) {
    return (
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <div
          style={{
            background: 'var(--cream)',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--gold-muted)',
            borderRadius: 'var(--radius-md)',
            padding: '1.75rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.2rem' }}>🏛️</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.15rem' }}>
              Heritage & Architectural Context
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This heritage document is curated with historical accuracy. Monument preservation in this region is overseen by respective archaeological departments and private heritage trusts. Travelers are requested to respect sacred frescoes, fragile stone carvings, and photography restrictions.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem',
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '1.5rem',
          }}
        >
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Conservation Status</span>
            <p style={{ margin: '0.2rem 0 0 0', fontWeight: 600, color: 'var(--teal-deep)' }}>Protected Living Heritage</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Heritage Etiquette</span>
            <p style={{ margin: '0.2rem 0 0 0', fontWeight: 600, color: 'var(--teal-deep)' }}>No Flash / Modest Attire</p>
          </div>
          <div>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Source Verification</span>
            <p style={{ margin: '0.2rem 0 0 0', fontWeight: 600, color: 'var(--teal-deep)' }}>Editorial Archive & Field Study</p>
          </div>
        </div>
      </div>
    );
  }

  // 2. TRAVEL PLANNING / TIPS TEMPLATE
  if (cat.includes('tip') || cat.includes('plan')) {
    return (
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🧭</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
              Travel Planning Checklist
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.35rem' }}>✓ Best Window for Travel</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>October to March brings pleasant daytime temperatures suitable for walking tours.</span>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.35rem' }}>✓ Connectivity & Access</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Accessible by state highways, local express trains, and nearest domestic airports.</span>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.35rem' }}>✓ Payments & Currency</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>UPI QR codes widely accepted; keep modest cash reserves for local village vendors.</span>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.35rem' }}>✓ Essential Gear</strong>
              <span style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Slip-on shoes for frequent temple/monument visits, cotton scarves, and sunscreen.</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/trip-planner" className="btn-gold-pill" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
              Open Interactive Trip Planner →
            </Link>
            <Link href="/budget-calculator" className="btn-outline-teal" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
              Estimate Budget →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. FOOD & CULTURE TEMPLATE
  if (cat.includes('food') || cat.includes('culture')) {
    return (
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <div
          style={{
            background: 'var(--cream)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🍲</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
              Regional Culinary & Cultural Guide
            </h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Indian regional gastronomy reflects centuries of climate adaptation, indigenous spices, and local heritage. When sampling traditional recipes:
          </p>
          <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-primary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
            <li>Seek bustling heritage eateries and sweetshops known for rapid turnover and freshness.</li>
            <li>Drink bottled or purified water and opt for freshly made piping-hot dishes.</li>
            <li>Inquire politely about spice levels beforehand if sensitive to Indian chilies.</li>
            <li>Remember to eat with your right hand when partaking in traditional seated thali meals.</li>
          </ul>
        </div>
      </div>
    );
  }

  // 4. SIGHTSEEING & NEARBY PLACES TEMPLATE
  if (cat.includes('sight') || cat.includes('near')) {
    return (
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📍</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
              Geographic Exploration Notes
            </h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Distances and travel times in this circuit depend on regional road conditions and heritage settlement layouts. We recommend hiring a local registered auto-rickshaw or guide for monument hopping inside narrow walled-city streets.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {destination && (
              <Link href={`/destinations/${destination.slug}`} className="btn-gold-pill" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
                View All {destination.name_en} Attractions →
              </Link>
            )}
            <Link href="/attractions" className="btn-outline-teal" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
              Browse Attractions Directory →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default Editorial Extra
  return null;
}
