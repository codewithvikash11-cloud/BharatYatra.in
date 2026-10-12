'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import BrandLogo from './brand-logo.js';
import FavoritesDrawer from './favorites-drawer.js';

export default function SiteHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [destDropdownOpen, setDestDropdownOpen] = useState(false);
  const [favDrawerOpen, setFavDrawerOpen] = useState(false);
  const [accountModalOpen, setAccountModalOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);
  const [navSearch, setNavSearch] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Sync favorites count
  const syncFavCount = () => {
    try {
      const stored = JSON.parse(localStorage.getItem('bharatyatra_favorites') || '[]');
      setFavCount(stored.length);
    } catch {
      setFavCount(0);
    }
  };

  useEffect(() => {
    syncFavCount();
    window.addEventListener('bharatyatra_favorites_updated', syncFavCount);
    window.addEventListener('storage', syncFavCount);
    return () => {
      window.removeEventListener('bharatyatra_favorites_updated', syncFavCount);
      window.removeEventListener('storage', syncFavCount);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setDestDropdownOpen(false);
    setAccountModalOpen(false);
  }, [pathname]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDestDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle ESC key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
        setDestDropdownOpen(false);
        setFavDrawerOpen(false);
        setAccountModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    if (navSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  const navLinks = [
    { href: '/trip-planner', label: 'Trip Planner' },
    { href: '/travel-help', label: 'Travel Help' },
    { href: '/events', label: 'Events' },
    { href: '/articles', label: 'Blog' },
  ];

  return (
    <>
      <header className="by-navbar-wrapper">
        <div className="by-navbar-container">
          {/* 1. Left: Brand Logo */}
          <div className="by-navbar-brand">
            <BrandLogo size="default" showSubtitle={true} />
          </div>

          {/* 2. Center: Primary Navigation */}
          <nav className="by-navbar-links" aria-label="Main Navigation">
            {/* Destinations Dropdown */}
            <div className="by-nav-dropdown-wrapper" ref={dropdownRef}>
              <button
                type="button"
                className={`by-nav-item by-nav-dropdown-btn ${pathname?.startsWith('/destinations') || pathname?.startsWith('/states') ? 'active' : ''}`}
                onClick={() => setDestDropdownOpen(!destDropdownOpen)}
                aria-expanded={destDropdownOpen}
                aria-haspopup="true"
              >
                <span>Destinations</span>
                <svg
                  className={`by-dropdown-chevron ${destDropdownOpen ? 'rotated' : ''}`}
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {destDropdownOpen && (
                <div className="by-nav-dropdown-menu" role="menu">
                  <div className="by-dropdown-col">
                    <span className="by-dropdown-header">Explore by Region</span>
                    <Link href="/destinations?region=north" className="by-dropdown-link" role="menuitem">
                      🏔 North India <small>Himalayas &amp; Heritage</small>
                    </Link>
                    <Link href="/destinations?region=south" className="by-dropdown-link" role="menuitem">
                      🌴 South India <small>Beaches &amp; Temples</small>
                    </Link>
                    <Link href="/destinations?region=west" className="by-dropdown-link" role="menuitem">
                      🏰 West India <small>Rajasthan &amp; Deserts</small>
                    </Link>
                    <Link href="/destinations?region=east" className="by-dropdown-link" role="menuitem">
                      🛕 East India <small>Temples &amp; Culture</small>
                    </Link>
                    <Link href="/destinations?region=central" className="by-dropdown-link" role="menuitem">
                      🐅 Central India <small>Wildife &amp; Ancient Sites</small>
                    </Link>
                    <Link href="/destinations?region=northeast" className="by-dropdown-link" role="menuitem">
                      🌿 North East India <small>Living Roots &amp; Valleys</small>
                    </Link>
                  </div>
                  <div className="by-dropdown-footer">
                    <Link href="/destinations" className="by-dropdown-viewall">
                      View All Destinations ({'>'})
                    </Link>
                    <Link href="/states" className="by-dropdown-viewall">
                      Browse by 36 States &amp; UTs ({'>'})
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Other Main Links */}
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname?.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`by-nav-item ${isActive ? 'active' : ''}`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right: Header Search, Favorites, and Account */}
          <div className="by-navbar-actions">
            {/* Header Search Box */}
            <form onSubmit={handleNavSearchSubmit} className="by-navbar-search-form" role="search">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#87938F"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                className="by-navbar-search-icon"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="search"
                className="by-navbar-search-input"
                placeholder="Search destinations, states, places..."
                aria-label="Search destinations, states, places"
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
              />
            </form>

            {/* Favorites Heart Button */}
            <button
              type="button"
              className="by-navbar-icon-btn by-favorites-btn"
              onClick={() => setFavDrawerOpen(true)}
              aria-label={`Saved destinations (${favCount} items)`}
              title="Saved destinations"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill={favCount > 0 ? '#B9653F' : 'none'}
                stroke={favCount > 0 ? '#B9653F' : '#153E3A'}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              {favCount > 0 && <span className="by-favorites-badge">{favCount}</span>}
            </button>

            {/* Account Avatar Button */}
            <div className="by-account-btn-wrapper">
              <button
                type="button"
                className="by-navbar-icon-btn by-account-avatar-btn"
                onClick={() => setAccountModalOpen(!accountModalOpen)}
                aria-label="User Account"
                title="Account"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#153E3A"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {accountModalOpen && (
                <div className="by-account-menu" role="menu">
                  <div className="by-account-menu-header">
                    <strong>BharatYatra Travel Club</strong>
                    <span>Plan &amp; save your journeys</span>
                  </div>
                  <Link href="/trip-planner" className="by-account-link" role="menuitem">
                    🗓 My Saved Itineraries
                  </Link>
                  <button
                    type="button"
                    className="by-account-link"
                    onClick={() => {
                      setAccountModalOpen(false);
                      setFavDrawerOpen(true);
                    }}
                    role="menuitem"
                  >
                    ❤️ Wishlist ({favCount})
                  </button>
                  <Link href="/checklist" className="by-account-link" role="menuitem">
                    📋 Packing Checklist
                  </Link>
                  <a href="http://localhost:3001" target="_blank" rel="noopener noreferrer" className="by-account-link by-admin-link" role="menuitem">
                    ⚙ Admin Studio ↗
                  </a>
                </div>
              )}
            </div>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              className="by-mobile-hamburger"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className={`by-hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`by-hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
              <span className={`by-hamburger-line ${mobileMenuOpen ? 'open' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="by-mobile-drawer">
            <div className="by-mobile-search-row">
              <form onSubmit={handleNavSearchSubmit} className="by-mobile-search-form">
                <input
                  type="search"
                  placeholder="Search destinations, states..."
                  value={navSearch}
                  onChange={(e) => setNavSearch(e.target.value)}
                />
                <button type="submit">Search</button>
              </form>
            </div>

            <div className="by-mobile-nav-list">
              <Link href="/destinations" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                📍 Destinations
              </Link>
              <Link href="/trip-planner" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                🗓 Trip Planner
              </Link>
              <Link href="/routes" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                🚗 Routes &amp; Transport
              </Link>
              <Link href="/budget-calculator" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                💰 Budget Calculator
              </Link>
              <Link href="/travel-help" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                🛡 Travel Help
              </Link>
              <Link href="/events" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                🎉 Events &amp; Festivals
              </Link>
              <Link href="/articles" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                📖 Blog &amp; Travel Guides
              </Link>
              <Link href="/states" className="by-mobile-link" onClick={() => setMobileMenuOpen(false)}>
                🗺 36 States &amp; UTs
              </Link>
            </div>

            <div className="by-mobile-footer-action">
              <button
                type="button"
                className="by-mobile-fav-btn"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setFavDrawerOpen(true);
                }}
              >
                ❤️ Saved Places ({favCount})
              </button>
              <Link href="/trip-planner" className="btn-gold-pill" style={{ display: 'block', textAlign: 'center', marginTop: '0.75rem' }} onClick={() => setMobileMenuOpen(false)}>
                Plan Your Journey →
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Favorites Drawer Popup */}
      <FavoritesDrawer isOpen={favDrawerOpen} onClose={() => setFavDrawerOpen(false)} />
    </>
  );
}
