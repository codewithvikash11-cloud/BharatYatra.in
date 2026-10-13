'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ItineraryInteractiveClient({ itinerary }) {
  const [activeDay, setActiveDay] = useState(1);
  const [completedStops, setCompletedStops] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    try {
      const storedFavs = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      setIsSaved(storedFavs.some((item) => item.slug === itinerary.slug));

      const storedStops = JSON.parse(localStorage.getItem(`bharatyatra_itinerary_${itinerary.slug}`) || '{}');
      setCompletedStops(storedStops);
    } catch {}
  }, [itinerary.slug]);

  const toggleStop = (stopKey) => {
    const updated = { ...completedStops, [stopKey]: !completedStops[stopKey] };
    setCompletedStops(updated);
    try {
      localStorage.setItem(`bharatyatra_itinerary_${itinerary.slug}`, JSON.stringify(updated));
    } catch {}
  };

  const toggleSave = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      let updated;
      if (isSaved) {
        updated = stored.filter((item) => item.slug !== itinerary.slug);
        setIsSaved(false);
      } else {
        updated = [
          ...stored,
          {
            slug: itinerary.slug,
            title: itinerary.title,
            subtitle: `${itinerary.days} · ${itinerary.category || 'Itinerary'}`,
            image: itinerary.cover,
            url: `/itineraries/${itinerary.slug}`,
          },
        ];
        setIsSaved(true);
      }
      localStorage.setItem('bharatyatra_favorites', JSON.stringify(updated));
      window.dispatchEvent(new Event('bharatyatra_favorites_updated'));
    } catch {}
  };

  const handleShare = async () => {
    const shareData = {
      title: `${itinerary.title} | BharatYatra`,
      text: itinerary.summary,
      url: window.location.href,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 3000);
      } catch {}
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const currentDayData = itinerary.daysSchedule.find((d) => d.day === activeDay) || itinerary.daysSchedule[0];
  const totalStopsCount = itinerary.daysSchedule.reduce((acc, d) => acc + (d.activities?.length || 0), 0);
  const completedCount = Object.values(completedStops).filter(Boolean).length;

  return (
    <div className="itinerary-detail-shell">
      {/* Top Action Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          padding: '1.25rem 1.5rem',
          background: '#FFFFFF',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-sm)',
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--teal-deep)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Trip Progress:
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
            <strong>{completedCount}</strong> of <strong>{totalStopsCount}</strong> stops explored
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {/* Save / Favorite */}
          <button
            type="button"
            onClick={toggleSave}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: isSaved ? '1px solid #B9653F' : '1px solid var(--border-color)',
              background: isSaved ? '#FDF0EC' : '#FFFFFF',
              color: isSaved ? '#B9653F' : 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
            aria-label={isSaved ? 'Remove from saved trips' : 'Save to my trips'}
          >
            <span>{isSaved ? '❤️' : '♡'}</span>
            <span>{isSaved ? 'Saved to Wishlist' : 'Save Itinerary'}</span>
          </button>

          {/* Share */}
          <button
            type="button"
            onClick={handleShare}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--border-color)',
              background: '#FFFFFF',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
            aria-label="Share this itinerary"
          >
            <span>↗</span>
            <span>Share</span>
          </button>

          {/* Print */}
          <button
            type="button"
            onClick={handlePrint}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.5rem 1rem',
              borderRadius: '999px',
              border: '1px solid var(--teal-deep)',
              background: 'transparent',
              color: 'var(--teal-deep)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
            aria-label="Print this itinerary"
          >
            <span>🖨️</span>
            <span>Print</span>
          </button>
        </div>
      </div>

      {shareToast && (
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
          }}
        >
          ✓ Link copied to clipboard! Share with your travel companions.
        </div>
      )}

      {/* Day Navigation Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {itinerary.daysSchedule.map((d) => {
            const isActive = d.day === activeDay;
            return (
              <button
                key={d.day}
                type="button"
                onClick={() => setActiveDay(d.day)}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: 'var(--radius-md)',
                  border: isActive ? '2px solid var(--teal-primary)' : '1px solid var(--border-color)',
                  background: isActive ? 'var(--teal-deep)' : '#FFFFFF',
                  color: isActive ? '#FFFDF8' : 'var(--text-primary)',
                  fontWeight: 700,
                  fontSize: '0.92rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                }}
              >
                Day {d.day}: {d.theme || d.title || `Leg ${d.day}`}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Day Card */}
      {currentDayData && (
        <div
          style={{
            background: '#FFFFFF',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)',
            padding: '2rem',
            boxShadow: 'var(--shadow-sm)',
            marginBottom: '2.5rem',
          }}
        >
          <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem', marginBottom: '1.75rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--gold-dark)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              SCHEDULE FOR DAY {currentDayData.day}
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.65rem', margin: '0.35rem 0 0.5rem 0' }}>
              {currentDayData.title}
            </h2>
            {currentDayData.summary && (
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: 0, lineHeight: 1.6 }}>
                {currentDayData.summary}
              </p>
            )}
          </div>

          {/* Activities Timeline */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {currentDayData.activities?.map((act, actIdx) => {
              const stopKey = `${currentDayData.day}-${actIdx}`;
              const isDone = !!completedStops[stopKey];

              return (
                <div
                  key={actIdx}
                  style={{
                    display: 'flex',
                    gap: '1.25rem',
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: isDone ? '#F0FDF4' : 'var(--cream)',
                    border: isDone ? '1px solid #86EFAC' : '1px solid var(--border-color)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => toggleStop(stopKey)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '1.4rem',
                      color: isDone ? '#16A34A' : 'var(--text-muted)',
                      padding: 0,
                      alignSelf: 'flex-start',
                    }}
                    aria-label={isDone ? `Mark ${act.title} as uncompleted` : `Mark ${act.title} as completed`}
                  >
                    {isDone ? '☑' : '☐'}
                  </button>

                  {/* Details */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.3rem' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          fontWeight: 700,
                          color: 'var(--teal-deep)',
                          background: '#FFFFFF',
                          padding: '0.2rem 0.55rem',
                          borderRadius: '4px',
                          border: '1px solid var(--border-color)',
                        }}
                      >
                        ⏱ {act.time}
                      </span>
                      <h3
                        style={{
                          margin: 0,
                          fontSize: '1.15rem',
                          fontFamily: 'var(--font-heading)',
                          color: isDone ? 'var(--text-muted)' : 'var(--teal-deep)',
                          textDecoration: isDone ? 'line-through' : 'none',
                        }}
                      >
                        {act.title}
                      </h3>
                      {act.category && (
                        <span style={{ fontSize: '0.75rem', color: 'var(--gold-dark)', fontWeight: 600 }}>
                          · {act.category}
                        </span>
                      )}
                    </div>

                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                      {act.note || act.description}
                    </p>

                    {act.transport && (
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <span>🚗</span>
                        <span><strong>Transit note:</strong> {act.transport}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Helpful Companion Links Box */}
      <div
        style={{
          background: 'var(--cream)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.5rem',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.1rem' }}>
            💰 Estimate Trip Budget
          </h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Calculate stay, meals, monument tickets, and cab costs for this {itinerary.days} itinerary.
          </p>
          <Link href={`/budget-calculator`} className="button-link-secondary" style={{ fontSize: '0.82rem' }}>
            Open Budget Calculator →
          </Link>
        </div>

        <div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.1rem' }}>
            📋 Preparation Checklist
          </h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Verify your temple footwear, UPI apps, travel medical insurance, and electrical adapters.
          </p>
          <Link href="/checklist" className="button-link-secondary" style={{ fontSize: '0.82rem' }}>
            View Packing Checklist →
          </Link>
        </div>

        <div>
          <h3 style={{ margin: '0 0 0.4rem 0', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.1rem' }}>
            🚆 Transit & Trains
          </h3>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            Check Vande Bharat trains, expressways, and official IRCTC booking guidelines.
          </p>
          <Link href="/routes" className="button-link-secondary" style={{ fontSize: '0.82rem' }}>
            Compare Transit Options →
          </Link>
        </div>
      </div>
    </div>
  );
}
