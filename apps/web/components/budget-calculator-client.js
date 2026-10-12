'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function BudgetCalculatorClient() {
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState('mid'); // budget, mid, luxury
  const [destType, setDestType] = useState('heritage'); // heritage, metro, nature

  // Baseline cost rates per person per day (INR)
  const rates = {
    budget: { stay: 700, food: 400, transport: 300, activities: 200, buffer: 200 },
    mid: { stay: 2200, food: 1000, transport: 800, activities: 500, buffer: 500 },
    luxury: { stay: 7500, food: 2500, transport: 2200, activities: 1200, buffer: 1600 },
  };

  const destMultiplier = {
    heritage: 1.0,
    metro: 1.15,
    nature: 0.95,
  }[destType];

  const currentRate = rates[style];

  const stayTotal = Math.round(currentRate.stay * destMultiplier * days * travelers);
  const foodTotal = Math.round(currentRate.food * destMultiplier * days * travelers);
  const transportTotal = Math.round(currentRate.transport * destMultiplier * days * travelers);
  const activitiesTotal = Math.round(currentRate.activities * destMultiplier * days * travelers);
  const bufferTotal = Math.round(currentRate.buffer * destMultiplier * days * travelers);

  const grandTotalINR = stayTotal + foodTotal + transportTotal + activitiesTotal + bufferTotal;
  const approxUSD = Math.round(grandTotalINR / 86); // 1 USD ~ 86 INR

  return (
    <div>
      {/* Input Configuration Box */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2.5rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Trip Duration
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="range"
              min="1"
              max="21"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--teal-primary)' }}
            />
            <strong style={{ fontSize: '1.1rem', color: 'var(--teal-deep)', minWidth: '60px' }}>
              {days} {days === 1 ? 'Day' : 'Days'}
            </strong>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Travelers
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <input
              type="range"
              min="1"
              max="8"
              value={travelers}
              onChange={(e) => setTravelers(Number(e.target.value))}
              style={{ flex: 1, accentColor: 'var(--teal-primary)' }}
            />
            <strong style={{ fontSize: '1.1rem', color: 'var(--teal-deep)', minWidth: '70px' }}>
              {travelers} {travelers === 1 ? 'Person' : 'People'}
            </strong>
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Travel Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#FFFDF8', color: 'var(--text-primary)', fontSize: '0.92rem', fontWeight: 600 }}
          >
            <option value="budget">🎒 Budget / Backpacker</option>
            <option value="mid">🏨 Mid-Range Comfort</option>
            <option value="luxury">👑 Heritage & Luxury</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
            Circuit Type
          </label>
          <select
            value={destType}
            onChange={(e) => setDestType(e.target.value)}
            style={{ width: '100%', padding: '0.65rem 0.85rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)', background: '#FFFDF8', color: 'var(--text-primary)', fontSize: '0.92rem' }}
          >
            <option value="heritage">🏰 Heritage & Golden Triangle</option>
            <option value="metro">🏙️ Metro Cities (Delhi/Mumbai)</option>
            <option value="nature">⛰️ Hills & Nature (Himachal/Kerala)</option>
          </select>
        </div>
      </div>

      {/* Grand Estimate Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--teal-deep) 0%, var(--teal-primary) 100%)',
          color: '#FFFDF8',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          boxShadow: 'var(--shadow-md)',
          marginBottom: '2.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
        }}
      >
        <div>
          <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.85, fontWeight: 600 }}>
            Estimated Total for {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'} ({days} Days)
          </span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.35rem' }}>
            <span style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FFFFFF' }}>
              ₹{grandTotalINR.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '1.25rem', color: 'var(--gold-muted)', fontWeight: 600 }}>
              (~${approxUSD.toLocaleString()} USD)
            </span>
          </div>
          <span style={{ display: 'block', fontSize: '0.88rem', opacity: 0.8, marginTop: '0.2rem' }}>
            Includes stay, food, intra-city transit, monument tickets & emergency contingency.
          </span>
        </div>

        <Link
          href="/trip-planner"
          className="btn-gold-pill"
          style={{ textDecoration: 'none', background: 'var(--gold-muted)', color: '#FFFFFF' }}
        >
          Build Detailed Itinerary →
        </Link>
      </div>

      {/* Detailed Breakdown Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
          Cost Category Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🏨</span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Accommodation</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              ₹{stayTotal.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hotels, homestays or heritage suites</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🍲</span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Food & Dining</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              ₹{foodTotal.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Breakfast, thalis, street food & chai</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🛺</span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Local Transport</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              ₹{transportTotal.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto rickshaws, cabs, metro & fuel</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🎟</span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Sightseeing & Tickets</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              ₹{activitiesTotal.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monument entry, audio guides & boat rides</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>🛡️</span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Contingency Buffer</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              ₹{bufferTotal.toLocaleString('en-IN')}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tips, shopping & unexpected transit</span>
          </div>
        </div>
      </div>

      {/* Money-Saving Tips Card */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
          Proven Money-Saving Tips for India
        </h4>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
          <li><strong>Composite Monument Tickets:</strong> In cities like Jaipur, buy the composite ticket covering Amer Fort, Hawa Mahal, Jantar Mantar, Albert Hall, and Nahargarh for significant savings.</li>
          <li><strong>Digital UPI Payments:</strong> Indian UPI operates without foreign transaction percentage fees and eliminates currency exchange markups at local shops.</li>
          <li><strong>Government Tourist Canteen & RTDC:</strong> Enjoy authentic, hygienic traditional regional food at reasonable set prices.</li>
        </ul>
      </div>
    </div>
  );
}
