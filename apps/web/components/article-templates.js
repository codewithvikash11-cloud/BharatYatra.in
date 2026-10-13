import Link from 'next/link';

export function ContentTypeBadge({ category }) {
  const cat = (category || '').toLowerCase();
  let label = 'TRAVEL GUIDE';
  let icon = '📖';

  if (cat.includes('destination')) {
    label = 'DESTINATION GUIDE';
    icon = '🗺️';
  } else if (cat.includes('attraction')) {
    label = 'TOURIST ATTRACTION GUIDE';
    icon = '🏛️';
  } else if (cat.includes('heritage') || cat.includes('history')) {
    label = 'HISTORY & HERITAGE';
    icon = '📜';
  } else if (cat.includes('tip') || cat.includes('plan')) {
    label = 'TRAVEL PLANNING';
    icon = '🧭';
  } else if (cat.includes('food') || cat.includes('culture')) {
    label = 'FOOD & CULTURE';
    icon = '🍲';
  } else if (cat.includes('itinerar')) {
    label = 'CURATED ITINERARY';
    icon = '🗓️';
  } else if (cat.includes('near') || cat.includes('sight')) {
    label = 'NEARBY PLACES';
    icon = '📍';
  } else if (cat.includes('update')) {
    label = 'TRAVEL UPDATE';
    icon = '📢';
  } else if (cat.includes('event') || cat.includes('festival')) {
    label = 'EVENTS & FESTIVALS';
    icon = '🎉';
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

  // 1. DESTINATION GUIDE TEMPLATE
  if (cat.includes('destination')) {
    return (
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <div
          style={{
            background: 'var(--cream)',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid var(--gold-muted)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🗺️</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.3rem' }}>
              Destination Overview & Practical Essentials
            </h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.96rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This comprehensive destination guide compiles verified geographical, cultural, and logistics information.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Best Season to Visit</span>
              <strong style={{ color: 'var(--teal-deep)', fontSize: '0.92rem' }}>October to March (Pleasant)</strong>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Local Transport</span>
              <strong style={{ color: 'var(--teal-deep)', fontSize: '0.92rem' }}>E-Rickshaws, Auto, Cabs</strong>
            </div>
            <div style={{ background: '#FFFFFF', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block' }}>Recommended Stay</span>
              <strong style={{ color: 'var(--teal-deep)', fontSize: '0.92rem' }}>2 to 4 Days</strong>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {destination && (
              <Link href={`/destinations/${destination.slug}`} className="btn-gold-pill" style={{ textDecoration: 'none', fontSize: '0.88rem' }}>
                Full {destination.name_en} Hub →
              </Link>
            )}
            <Link href="/trip-planner" className="btn-outline-teal" style={{ textDecoration: 'none', fontSize: '0.88rem' }}>
              Add to Trip Planner →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. TOURIST ATTRACTION GUIDE TEMPLATE
  if (cat.includes('attraction')) {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1.4rem' }}>🏛️</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.3rem' }}>
              Visitor Guidance & Verified Details
            </h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div style={{ background: 'var(--cream)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.4rem' }}>🕒 Typical Visiting Hours</strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>9:00 AM – 5:30 PM daily (Check seasonal sunset timings for fort ramparts).</p>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.4rem' }}>🎟 Entry & Ticket Guidance</strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Standard ASI / State Museum fees apply. Concessions available for Indian citizens & students.</p>
            </div>
            <div style={{ background: 'var(--cream)', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <strong style={{ color: 'var(--teal-deep)', display: 'block', marginBottom: '0.4rem' }}>📷 Photography & Etiquette</strong>
              <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>Mobile photography permitted; professional tripods or drones require ASI permission.</p>
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/attractions" className="btn-gold-pill" style={{ textDecoration: 'none', fontSize: '0.88rem' }}>
              Explore Attractions Directory →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 3. HISTORY & HERITAGE TEMPLATE
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
            <span style={{ fontSize: '1.2rem' }}>📜</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.15rem' }}>
              Heritage & Architectural Context
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            This heritage document is curated with historical accuracy. Monument preservation in this region is overseen by archaeological departments and heritage trusts. Travelers are requested to respect sacred frescoes, fragile stone carvings, and photography restrictions.
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

  // 4. TRAVEL PLANNING / TIPS TEMPLATE
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

  // 5. FOOD & CULTURE TEMPLATE
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

  // 6. ITINERARY TEMPLATE
  if (cat.includes('itinerar')) {
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🗓️</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
              Itinerary Highlights & Route Pacing
            </h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Follow the curated day-by-day stops outlined in this guide. Allow buffer time between transit legs to accommodate local rail/road rhythms.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/itineraries" className="btn-gold-pill" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
              Browse Curated Itineraries →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 7. SIGHTSEEING & NEARBY PLACES TEMPLATE
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

  // 8. TRAVEL UPDATES TEMPLATE
  if (cat.includes('update')) {
    return (
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <div
          style={{
            background: '#FFF8F4',
            border: '1px solid #EBC8BF',
            borderRadius: 'var(--radius-lg)',
            padding: '1.75rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.3rem' }}>📢</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: '#963A2C', fontSize: '1.2rem' }}>
              Editorial Travel Advisory & Transit Notice
            </h3>
          </div>
          <p style={{ margin: 0, fontSize: '0.95rem', color: '#68453F', lineHeight: 1.6 }}>
            Travel updates reflect current field reports and official transportation notifications. Please confirm seasonal permit requirements, pass validity, and highway conditions with local authorities before departure.
          </p>
        </div>
      </div>
    );
  }

  // 9. EVENTS & FESTIVALS TEMPLATE
  if (cat.includes('event') || cat.includes('festival')) {
    return (
      <div style={{ margin: '3rem 0 2rem 0' }}>
        <div
          style={{
            background: 'var(--cream)',
            border: '1px solid var(--border-color)',
            borderLeft: '4px solid #C58B32',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🎉</span>
            <h3 style={{ margin: 0, fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
              Festival Calendar & Cultural Participation
            </h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Indian fairs and festivals are vibrant living celebrations rooted in lunar calendars and regional traditions. Spectators are encouraged to observe sacred rituals reverently and secure heritage hotel bookings well in advance.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/events" className="btn-gold-pill" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
              Explore All India Festivals →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Default Fallback
  return null;
}
