'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SavedPlacesClient() {
  const [favorites, setFavorites] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const loadFavorites = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      setFavorites(stored);
    } catch {
      setFavorites([]);
    }
  };

  useEffect(() => {
    setMounted(true);
    loadFavorites();

    const handleUpdate = () => loadFavorites();
    window.addEventListener('bharatyatra_favorites_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('bharatyatra_favorites_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const removeFavorite = (slug) => {
    try {
      const updated = favorites.filter((item) => item.slug !== slug);
      localStorage.setItem('bharatyatra_favorites', JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new Event('bharatyatra_favorites_updated'));
    } catch {}
  };

  const clearAll = () => {
    try {
      localStorage.removeItem('bharatyatra_favorites');
      setFavorites([]);
      window.dispatchEvent(new Event('bharatyatra_favorites_updated'));
    } catch {}
  };

  const shareWishlist = async () => {
    if (favorites.length === 0) return;
    const itemsList = favorites.map((f) => `• ${f.title} (${f.url})`).join('\n');
    const text = `My BharatYatra Travel Wishlist (${favorites.length} places):\n${itemsList}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title: 'My BharatYatra Wishlist', text, url: window.location.href });
      } catch {}
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopyToast(true);
        setTimeout(() => setCopyToast(false), 3000);
      } catch {}
    }
  };

  if (!mounted) {
    return (
      <div style={{ padding: '3rem 0', textAlign: 'center', color: 'var(--text-muted)' }}>
        Loading your saved wishlist…
      </div>
    );
  }

  return (
    <div>
      {/* Top Toolbar */}
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
          marginBottom: '2.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <span style={{ fontSize: '1.2rem' }}>❤️</span>
          <strong style={{ color: 'var(--teal-deep)', fontSize: '1.05rem' }}>
            {favorites.length} {favorites.length === 1 ? 'Place' : 'Places'} in your Wishlist
          </strong>
        </div>

        {favorites.length > 0 && (
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={shareWishlist}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                border: '1px solid var(--border-color)',
                background: '#FFFFFF',
                color: 'var(--text-primary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              ↗ Share Wishlist
            </button>
            <button
              type="button"
              onClick={clearAll}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '999px',
                border: '1px solid #FECACA',
                background: '#FEF2F2',
                color: '#DC2626',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
          </div>
        )}
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
          }}
        >
          ✓ Wishlist copied to clipboard! Share it with your friends.
        </div>
      )}

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="empty-editorial-card" style={{ maxWidth: '640px', margin: '3rem auto', textAlign: 'center', padding: '3.5rem 2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧭</div>
          <h2 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.4rem', margin: '0 0 0.5rem 0' }}>
            Your Wishlist is Empty
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, margin: '0 0 1.5rem 0' }}>
            Save destinations, monuments, and handcrafted itineraries by clicking the heart icon as you explore BharatYatra.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/destinations" className="btn-gold-pill" style={{ fontSize: '0.85rem', textDecoration: 'none' }}>
              Explore Destinations →
            </Link>
            <Link href="/itineraries" className="button-link-secondary" style={{ fontSize: '0.85rem' }}>
              View Suggested Itineraries
            </Link>
          </div>
        </div>
      ) : (
        /* Grid of Saved Items */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: '1.75rem' }}>
          {favorites.map((item) => (
            <article
              key={item.slug}
              style={{
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-sm)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{ height: '200px', width: '100%', position: 'relative' }}>
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80'}
                  alt={item.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <button
                  type="button"
                  onClick={() => removeFavorite(item.slug)}
                  title="Remove from wishlist"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.9)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    color: '#DC2626',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  aria-label={`Remove ${item.title} from wishlist`}
                >
                  ✕
                </button>
              </div>

              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {item.subtitle && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--gold-dark)', fontWeight: 600, display: 'block', marginBottom: '0.25rem' }}>
                      {item.subtitle}
                    </span>
                  )}
                  <h3 style={{ fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)', fontSize: '1.25rem', margin: '0 0 0.5rem 0' }}>
                    <Link href={item.url || `/destinations/${item.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {item.title}
                    </Link>
                  </h3>
                </div>

                <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={item.url || `/destinations/${item.slug}`}
                    className="btn-gold-pill"
                    style={{ fontSize: '0.82rem', textDecoration: 'none', flex: 1, textAlign: 'center' }}
                  >
                    Open Guide →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
