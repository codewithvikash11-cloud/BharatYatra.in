'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  IconSettings,
  IconChevronDown,
  IconChevronUp,
  IconCopy,
  IconCheck,
  IconArrowRight,
  IconBed,
  IconSoup,
  IconCar,
  IconTicket,
  IconShieldCheck,
} from './icons';

const defaultRates = {
  budget: { stay: 700, food: 400, transport: 300, activities: 200, buffer: 200 },
  mid: { stay: 2200, food: 1000, transport: 800, activities: 500, buffer: 500 },
  luxury: { stay: 7500, food: 2500, transport: 2200, activities: 1200, buffer: 1600 },
};

export default function BudgetCalculatorClient() {
  const [days, setDays] = useState(4);
  const [travelers, setTravelers] = useState(2);
  const [style, setStyle] = useState('mid'); // budget, mid, luxury
  const [destType, setDestType] = useState('heritage'); // heritage, metro, nature
  const [currency, setCurrency] = useState('INR'); // INR or USD
  const [showCustomRates, setShowCustomRates] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  // User-editable daily assumptions per person
  const [customRates, setCustomRates] = useState({
    stay: defaultRates.mid.stay,
    food: defaultRates.mid.food,
    transport: defaultRates.mid.transport,
    activities: defaultRates.mid.activities,
    buffer: defaultRates.mid.buffer,
  });

  const handleStyleChange = (newStyle) => {
    setStyle(newStyle);
    setCustomRates({ ...defaultRates[newStyle] });
  };

  const handleRateChange = (field, value) => {
    const num = Math.max(0, parseInt(value, 10) || 0);
    setCustomRates((prev) => ({ ...prev, [field]: num }));
  };

  const resetToDefaults = () => {
    setCustomRates({ ...defaultRates[style] });
  };

  const destMultiplier = {
    heritage: 1.0,
    metro: 1.15,
    nature: 0.95,
  }[destType];

  const stayTotal = Math.round(customRates.stay * destMultiplier * days * travelers);
  const foodTotal = Math.round(customRates.food * destMultiplier * days * travelers);
  const transportTotal = Math.round(customRates.transport * destMultiplier * days * travelers);
  const activitiesTotal = Math.round(customRates.activities * destMultiplier * days * travelers);
  const bufferTotal = Math.round(customRates.buffer * destMultiplier * days * travelers);

  const grandTotalINR = stayTotal + foodTotal + transportTotal + activitiesTotal + bufferTotal;
  const inrToUsdRate = 86; // 1 USD ~ 86 INR
  const approxUSD = Math.round(grandTotalINR / inrToUsdRate);

  const displayTotal = currency === 'INR' ? `₹${grandTotalINR.toLocaleString('en-IN')}` : `$${approxUSD.toLocaleString()} USD`;
  const formatAmount = (amtINR) => {
    if (currency === 'INR') {
      return `₹${amtINR.toLocaleString('en-IN')}`;
    }
    return `$${Math.round(amtINR / inrToUsdRate).toLocaleString()}`;
  };

  const handleCopySummary = async () => {
    const summary = `BharatYatra Trip Budget Estimate:\n` +
      `• Duration: ${days} Days | Travelers: ${travelers} | Style: ${style.toUpperCase()}\n` +
      `• Total: ₹${grandTotalINR.toLocaleString('en-IN')} (~$${approxUSD} USD)\n` +
      `• Stay: ₹${stayTotal.toLocaleString('en-IN')} | Food: ₹${foodTotal.toLocaleString('en-IN')}\n` +
      `• Transit: ₹${transportTotal.toLocaleString('en-IN')} | Sightseeing: ₹${activitiesTotal.toLocaleString('en-IN')}\n` +
      `Calculated at ${typeof window !== 'undefined' ? window.location.href : 'BharatYatra'}`;

    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(summary);
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 3000);
      }
    } catch {}
  };

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
          marginBottom: '2rem',
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
            onChange={(e) => handleStyleChange(e.target.value)}
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

      {/* Editable Assumptions Toggle & Panel */}
      <div
        style={{
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 2rem',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h3 style={{ margin: '0 0 0.25rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconSettings size={18} />
              <span>Editable Assumptions & Daily Rates</span>
            </h3>
            <p style={{ margin: 0, fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              Adjust baseline daily rates per person to match your exact accommodation or dietary preferences.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCustomRates(!showCustomRates)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--teal-primary)',
              background: showCustomRates ? 'var(--teal-primary)' : 'transparent',
              color: showCustomRates ? '#FFFFFF' : 'var(--teal-primary)',
              fontWeight: 600,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {showCustomRates ? (
              <>
                <span>Hide Custom Rates</span>
                <IconChevronUp size={14} />
              </>
            ) : (
              <>
                <span>Edit Daily Assumptions</span>
                <IconChevronDown size={14} />
              </>
            )}
          </button>
        </div>

        {showCustomRates && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <IconBed size={15} />
                  <span>Stay / Night (₹)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={customRates.stay}
                  onChange={(e) => handleRateChange('stay', e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <IconSoup size={15} />
                  <span>Food / Day (₹)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={customRates.food}
                  onChange={(e) => handleRateChange('food', e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <IconCar size={15} />
                  <span>Transit / Day (₹)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={customRates.transport}
                  onChange={(e) => handleRateChange('transport', e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <IconTicket size={15} />
                  <span>Sightseeing / Day (₹)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={customRates.activities}
                  onChange={(e) => handleRateChange('activities', e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>

              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  <IconShieldCheck size={15} />
                  <span>Contingency / Day (₹)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={customRates.buffer}
                  onChange={(e) => handleRateChange('buffer', e.target.value)}
                  style={{ width: '100%', padding: '0.55rem', borderRadius: '4px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Multipliers: Circuit factor {destMultiplier}x applied automatically.
              </span>
              <button
                type="button"
                onClick={resetToDefaults}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--teal-primary)',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Reset to {style.toUpperCase()} defaults
              </button>
            </div>
          </div>
        )}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.85, fontWeight: 600 }}>
              Estimated Total for {travelers} {travelers === 1 ? 'Traveler' : 'Travelers'} ({days} Days)
            </span>
            {/* Currency toggle */}
            <div style={{ display: 'inline-flex', background: 'rgba(255, 255, 255, 0.2)', borderRadius: '999px', padding: '2px' }}>
              <button
                type="button"
                onClick={() => setCurrency('INR')}
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: 'none',
                  background: currency === 'INR' ? '#FFFFFF' : 'transparent',
                  color: currency === 'INR' ? 'var(--teal-deep)' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                ₹ INR
              </button>
              <button
                type="button"
                onClick={() => setCurrency('USD')}
                style={{
                  padding: '2px 8px',
                  borderRadius: '999px',
                  border: 'none',
                  background: currency === 'USD' ? '#FFFFFF' : 'transparent',
                  color: currency === 'USD' ? 'var(--teal-deep)' : '#FFFFFF',
                  fontWeight: 700,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                }}
              >
                $ USD
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
            <span style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontFamily: 'var(--font-heading)', fontWeight: 700, color: '#FFFFFF' }}>
              {displayTotal}
            </span>
            {currency === 'INR' && (
              <span style={{ fontSize: '1.25rem', color: 'var(--gold-muted)', fontWeight: 600 }}>
                (~${approxUSD.toLocaleString()} USD)
              </span>
            )}
          </div>
          <span style={{ display: 'block', fontSize: '0.88rem', opacity: 0.8, marginTop: '0.2rem' }}>
            Includes accommodation, meals, transit, monument tickets & emergency contingency.
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            type="button"
            onClick={handleCopySummary}
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '999px',
              border: '1px solid rgba(255, 255, 255, 0.6)',
              background: 'transparent',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <IconCopy size={16} />
            <span>Copy Estimate</span>
          </button>
          <Link
            href="/trip-planner"
            className="btn-gold-pill"
            style={{ textDecoration: 'none', background: 'var(--gold-muted)', color: '#FFFFFF', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <span>Build Detailed Itinerary</span>
            <IconArrowRight size={16} />
          </Link>
        </div>
      </div>

      {copyToast && (
        <div
          role="status"
          style={{
            background: 'var(--teal-deep)',
            color: '#FFFFFF',
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius-md)',
            fontSize: '0.88rem',
            marginBottom: '1.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <IconCheck size={16} />
          <span>Budget breakdown copied to clipboard!</span>
        </div>
      )}

      {/* Detailed Breakdown Grid */}
      <div style={{ marginBottom: '3rem' }}>
        <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.4rem', marginBottom: '1.25rem' }}>
          Cost Category Breakdown
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ color: 'var(--teal-deep)', display: 'inline-flex' }}>
              <IconBed size={24} />
            </span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Accommodation</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              {formatAmount(stayTotal)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Hotels, homestays or heritage suites ({formatAmount(customRates.stay)}/night)</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ color: 'var(--teal-deep)', display: 'inline-flex' }}>
              <IconSoup size={24} />
            </span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Food & Dining</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              {formatAmount(foodTotal)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Breakfast, thalis, street food & chai ({formatAmount(customRates.food)}/day)</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ color: 'var(--teal-deep)', display: 'inline-flex' }}>
              <IconCar size={24} />
            </span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Local Transport</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              {formatAmount(transportTotal)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Auto rickshaws, cabs, metro & fuel ({formatAmount(customRates.transport)}/day)</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ color: 'var(--teal-deep)', display: 'inline-flex' }}>
              <IconTicket size={24} />
            </span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Sightseeing & Tickets</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              {formatAmount(activitiesTotal)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Monument entry, audio guides & boat rides ({formatAmount(customRates.activities)}/day)</span>
          </div>

          <div style={{ background: '#FFFFFF', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1.25rem' }}>
            <span style={{ color: 'var(--teal-deep)', display: 'inline-flex' }}>
              <IconShieldCheck size={24} />
            </span>
            <strong style={{ display: 'block', color: 'var(--text-primary)', marginTop: '0.4rem', fontSize: '1.05rem' }}>Contingency Buffer</strong>
            <span style={{ display: 'block', fontSize: '1.4rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', margin: '0.2rem 0' }}>
              {formatAmount(bufferTotal)}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Tips, shopping & unexpected transit ({formatAmount(customRates.buffer)}/day)</span>
          </div>
        </div>
      </div>

      {/* Prominent Calculation Disclaimer & Tips */}
      <div style={{ background: 'var(--cream)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: '2rem' }}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem' }}>
          Editorial Tariff Methodology & Disclaimers
        </h4>
        <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Estimates are editorial baselines based on current average Indian tourism tariffs; actual costs vary by travel season (peak winter vs. off-peak monsoon), specific booking channel, and personal travel preferences. BharatYatra does not charge booking surcharges or conceal commission fees.
        </p>
        <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.8 }}>
          <li><strong>Composite Monument Tickets:</strong> In cities like Jaipur, buy the composite ticket covering Amer Fort, Hawa Mahal, Jantar Mantar, Albert Hall, and Nahargarh for significant savings.</li>
          <li><strong>Digital UPI Payments:</strong> Indian UPI operates without foreign transaction percentage fees and eliminates currency exchange markups at local shops.</li>
          <li><strong>Government Tourist Canteens:</strong> Enjoy authentic, hygienic traditional regional food at reasonable set prices.</li>
        </ul>
      </div>
    </div>
  );
}
