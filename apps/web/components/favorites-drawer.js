'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function FavoritesDrawer({ isOpen, onClose }) {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const stored = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      setFavorites(stored);
    } catch {
      setFavorites([]);
    }
  }, [isOpen]);

  const removeFavorite = (slug) => {
    try {
      const updated = favorites.filter((f) => f.slug !== slug);
      localStorage.setItem('bharatyatra_favorites', JSON.stringify(updated));
      setFavorites(updated);
      window.dispatchEvent(new Event('bharatyatra_favorites_updated'));
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fav-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Saved Destinations">
      <div className="fav-drawer-panel" onClick={(e) => e.stopPropagation()}>
        <div className="fav-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '1.25rem' }}>❤️</span>
            <h2 style={{ margin: 0, fontSize: '1.15rem', fontFamily: 'var(--font-heading)', color: 'var(--teal-deep)' }}>
              Saved Places ({favorites.length})
            </h2>
          </div>
          <button type="button" className="fav-close-btn" onClick={onClose} aria-label="Close saved places">
            ✕
          </button>
        </div>

        <div className="fav-drawer-body">
          {favorites.length === 0 ? (
            <div className="fav-empty-state">
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🧭</div>
              <h3 style={{ margin: '0 0 0.5rem', fontSize: '1rem', color: 'var(--teal-deep)' }}>No saved places yet</h3>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Click the &ldquo;Save&rdquo; heart on any destination or attraction to build your wishlist.
              </p>
              <Link href="/destinations" className="btn-gold-pill" onClick={onClose} style={{ marginTop: '1.25rem', display: 'inline-block', fontSize: '0.85rem' }}>
                Explore Destinations →
              </Link>
            </div>
          ) : (
            <div className="fav-list">
              {favorites.map((item) => (
                <div key={item.slug} className="fav-item-row">
                  {item.image && (
                    <img src={item.image} alt={item.title} className="fav-item-thumb" />
                  )}
                  <div className="fav-item-info">
                    <Link href={item.url || `/destinations/${item.slug}`} onClick={onClose} className="fav-item-title">
                      {item.title}
                    </Link>
                    {item.subtitle && <span className="fav-item-sub">{item.subtitle}</span>}
                  </div>
                  <button
                    type="button"
                    className="fav-remove-btn"
                    onClick={() => removeFavorite(item.slug)}
                    title="Remove from saved"
                    aria-label={`Remove ${item.title}`}
                  >
                    🗑
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
